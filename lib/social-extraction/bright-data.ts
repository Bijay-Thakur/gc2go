import "server-only";

import { normalizeBrightDataResponse } from "@/lib/social-extraction/normalize";
import {
  SocialExtractionError,
  type ExtractableSocialProvider,
  type SocialExtractionProvider,
} from "@/lib/social-extraction/types";
import {
  detectSocialProvider,
  inspectSocialUrl,
  isAllowedTikTokHostname,
  normalizeSocialUrl,
} from "@/lib/social-links";

const DEFAULT_DATASETS = {
  tiktok: "gd_lu702nij2f790tmv9h",
  instagram: "gd_lyclm20il4r5helnj",
} as const;

async function resolveTikTokShortUrl(url: string): Promise<string> {
  let currentUrl = url;
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    const parsed = new URL(currentUrl);
    if (parsed.protocol !== "https:" || !isAllowedTikTokHostname(parsed.hostname)) {
      throw new SocialExtractionError("INVALID_SOCIAL_URL", "TikTok redirected to an unsupported host.");
    }
    const currentValidation = inspectSocialUrl(currentUrl);
    if (currentValidation.valid && !["vm.tiktok.com", "vt.tiktok.com"].includes(parsed.hostname)) {
      return normalizeSocialUrl(currentUrl);
    }
    if (redirects === 3) break;

    const response = await fetch(currentUrl, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      headers: { "User-Agent": "GC2Go social extraction" },
    });
    await response.body?.cancel();
    const location = response.headers.get("location");
    if (response.status < 300 || response.status >= 400 || !location) break;
    currentUrl = new URL(location, currentUrl).toString();
  }
  throw new SocialExtractionError("INVALID_SOCIAL_URL", "The shortened TikTok URL did not resolve to a public video.");
}

export class BrightDataSocialExtractionProvider implements SocialExtractionProvider {
  async extract(url: string, provider: ExtractableSocialProvider) {
    const validation = inspectSocialUrl(url);
    if (!validation.valid || detectSocialProvider(url) !== provider) {
      throw new SocialExtractionError("INVALID_SOCIAL_URL", validation.error ?? "The social URL is invalid.");
    }

    let canonicalUrl = normalizeSocialUrl(url);
    const host = new URL(canonicalUrl).hostname;
    if (provider === "tiktok" && ["vm.tiktok.com", "vt.tiktok.com"].includes(host)) {
      canonicalUrl = await resolveTikTokShortUrl(canonicalUrl);
    }

    const token = process.env.BRIGHTDATA_API_TOKEN?.trim();
    if (!token) {
      throw new SocialExtractionError(
        "BRIGHTDATA_NOT_CONFIGURED",
        "TikTok/Instagram video extraction is not configured. Try a YouTube Short or upload a screen recording.",
      );
    }
    const datasetId = provider === "tiktok"
      ? process.env.BRIGHTDATA_TIKTOK_DATASET_ID || DEFAULT_DATASETS.tiktok
      : process.env.BRIGHTDATA_INSTAGRAM_DATASET_ID || DEFAULT_DATASETS.instagram;
    const endpoint = new URL("https://api.brightdata.com/datasets/v3/scrape");
    endpoint.searchParams.set("dataset_id", datasetId);
    endpoint.searchParams.set("format", "json");
    endpoint.searchParams.set("include_errors", "true");

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ url: canonicalUrl }]),
        cache: "no-store",
        signal: AbortSignal.timeout(65_000),
      });
    } catch {
      throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "The social extraction provider could not be reached.");
    }

    if (response.status === 202) {
      throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "The social extraction provider is still processing this video. Try again shortly.");
    }
    if (!response.ok) {
      throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", `The social extraction provider returned HTTP ${response.status}.`);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "The social extraction provider returned malformed JSON.");
    }
    return normalizeBrightDataResponse(provider, payload, canonicalUrl);
  }
}
