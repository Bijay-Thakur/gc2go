import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import type { SocialMediaAsset } from "@/lib/social-extraction/types";

const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export class PublicVideoError extends Error {
  constructor(
    readonly code: "VIDEO_UNAVAILABLE" | "VIDEO_TOO_LARGE" | "UNSUPPORTED_VIDEO_TYPE" | "VIDEO_DOWNLOAD_TIMEOUT" | "UNSAFE_VIDEO_URL",
    message: string,
  ) {
    super(message);
    this.name = "PublicVideoError";
  }
}

function isPrivateIpv4(address: string) {
  const [a, b] = address.split(".").map(Number);
  return a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || a >= 224;
}

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) return isPrivateIpv4(address);
  const normalized = address.toLowerCase();
  return normalized === "::1"
    || normalized === "::"
    || normalized.startsWith("fc")
    || normalized.startsWith("fd")
    || normalized.startsWith("fe8")
    || normalized.startsWith("fe9")
    || normalized.startsWith("fea")
    || normalized.startsWith("feb");
}

export async function assertSafePublicVideoUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new PublicVideoError("UNSAFE_VIDEO_URL", "The extracted video URL is invalid.");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.hostname === "localhost") {
    throw new PublicVideoError("UNSAFE_VIDEO_URL", "The extracted video URL is unsafe.");
  }
  if (isIP(url.hostname) && isPrivateAddress(url.hostname)) {
    throw new PublicVideoError("UNSAFE_VIDEO_URL", "The extracted video URL points to a private network.");
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await lookup(url.hostname, { all: true });
  } catch {
    throw new PublicVideoError("VIDEO_UNAVAILABLE", "The extracted video host could not be resolved.");
  }
  if (!Array.isArray(addresses) || addresses.length === 0 || addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new PublicVideoError("UNSAFE_VIDEO_URL", "The extracted video host resolves to a private network.");
  }
}

interface FetchPublicVideoOptions {
  fetchImpl?: typeof fetch;
  assertSafeUrl?: (url: string) => Promise<void>;
}

export async function fetchPublicVideo(
  asset: SocialMediaAsset,
  options: FetchPublicVideoOptions = {},
): Promise<{ bytes: Buffer; mimeType: string; sizeBytes: number }> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const assertSafeUrl = options.assertSafeUrl ?? assertSafePublicVideoUrl;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  let currentUrl = asset.videoUrl;

  try {
    for (let redirects = 0; redirects <= 3; redirects += 1) {
      await assertSafeUrl(currentUrl);
      const response = await fetchImpl(currentUrl, {
        redirect: "manual",
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "video/mp4,video/webm,video/quicktime" },
      });

      if (response.status >= 300 && response.status < 400) {
        await response.body?.cancel();
        const location = response.headers.get("location");
        if (!location || redirects === 3) {
          throw new PublicVideoError("VIDEO_UNAVAILABLE", "The video used too many redirects.");
        }
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }
      if (!response.ok || !response.body) {
        throw new PublicVideoError("VIDEO_UNAVAILABLE", "The public video is unavailable.");
      }

      const mimeType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
      if (!ALLOWED_VIDEO_TYPES.has(mimeType)) {
        await response.body.cancel();
        throw new PublicVideoError("UNSUPPORTED_VIDEO_TYPE", "The extracted file is not a supported video type.");
      }
      const declaredBytes = Number(response.headers.get("content-length") ?? "0");
      if (declaredBytes > MAX_VIDEO_BYTES) {
        await response.body.cancel();
        throw new PublicVideoError("VIDEO_TOO_LARGE", "The video is too large. Upload a short screen recording instead.");
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let sizeBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        sizeBytes += value.byteLength;
        if (sizeBytes > MAX_VIDEO_BYTES) {
          await reader.cancel();
          throw new PublicVideoError("VIDEO_TOO_LARGE", "The video is too large. Upload a short screen recording instead.");
        }
        chunks.push(value);
      }
      return { bytes: Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))), mimeType, sizeBytes };
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new PublicVideoError("VIDEO_DOWNLOAD_TIMEOUT", "The temporary video download timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  throw new PublicVideoError("VIDEO_UNAVAILABLE", "The public video is unavailable.");
}
