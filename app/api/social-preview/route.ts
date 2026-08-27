import { z } from "zod";

import { DEFAULT_DEMO_SOCIAL_URL, demoSocialPreview } from "@/data/demo-social";
import { socialPreviewSchema } from "@/lib/schemas";
import { getMockSocialVideoFixture, isMockPipelineEnabled } from "@/lib/social-analysis-fixtures";
import {
  buildSafeEmbedUrl,
  detectSocialProvider,
  extractInstagramShortcode,
  extractTikTokVideoId,
  extractYouTubeVideoId,
  getInstagramPostKind,
  inspectSocialUrl,
  isAllowedTikTokHostname,
  isApprovedSocialMediaUrl,
  normalizeSocialUrl,
} from "@/lib/social-links";

export const runtime = "nodejs";

function configuredDemoUrl() {
  try {
    return normalizeSocialUrl(process.env.DEMO_SOCIAL_URL || DEFAULT_DEMO_SOCIAL_URL);
  } catch {
    return DEFAULT_DEMO_SOCIAL_URL;
  }
}

const requestSchema = z.object({
  url: z.string().trim().min(1).max(2048),
});

const publicOEmbedSchema = z.object({
  title: z.string().max(500).optional(),
  author_name: z.string().max(200).optional(),
  author_url: z.url().optional(),
  thumbnail_url: z.url().optional(),
});

async function resolveShortTikTokUrl(initialUrl: string): Promise<string> {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    const parsed = new URL(currentUrl);
    if (parsed.protocol !== "https:" || !isAllowedTikTokHostname(parsed.hostname)) {
      throw new Error("TikTok redirected to an unsupported host.");
    }

    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(4_000),
      headers: { "User-Agent": "GC2Go social preview" },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("TikTok returned an incomplete redirect.");
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return normalizeSocialUrl(currentUrl);
  }

  throw new Error("TikTok used too many redirects.");
}

async function getYouTubeMetadata(canonicalUrl: string) {
  const response = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(canonicalUrl)}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(4_000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;
  const parsed = publicOEmbedSchema.safeParse(await response.json());
  if (!parsed.success) return null;
  return {
    title: parsed.data.title,
    authorName: parsed.data.author_name,
    authorUrl: parsed.data.author_url,
    thumbnailUrl: parsed.data.thumbnail_url,
  };
}

async function getTikTokMetadata(canonicalUrl: string) {
  const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(canonicalUrl)}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(4_000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) return null;
  const parsed = publicOEmbedSchema.safeParse(await response.json());
  if (!parsed.success) return null;

  return {
    title: parsed.data.title,
    authorName: parsed.data.author_name,
    authorUrl:
      parsed.data.author_url && detectSocialProvider(parsed.data.author_url) === "tiktok"
        ? parsed.data.author_url
        : undefined,
    thumbnailUrl:
      parsed.data.thumbnail_url && isApprovedSocialMediaUrl(parsed.data.thumbnail_url)
        ? parsed.data.thumbnail_url
        : undefined,
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 4_096) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }

  let rawBody: unknown;
  try {
    const text = await request.text();
    if (text.length > 4_096) return Response.json({ error: "Request is too large." }, { status: 413 });
    rawBody = JSON.parse(text);
  } catch {
    return Response.json({ error: "Send a JSON body containing a reel URL." }, { status: 400 });
  }

  const input = requestSchema.safeParse(rawBody);
  if (!input.success) return Response.json({ error: "A valid reel URL is required." }, { status: 400 });

  const validation = inspectSocialUrl(input.data.url);
  if (!validation.valid || !validation.provider) {
    return Response.json({ error: validation.error ?? "Unsupported social URL." }, { status: 400 });
  }

  const requestedCanonicalUrl = normalizeSocialUrl(input.data.url);
  if (isMockPipelineEnabled()) {
    const fixture = getMockSocialVideoFixture(requestedCanonicalUrl);
    if (!fixture) {
      return Response.json({ error: "This URL is not included in the recorded mock pipeline." }, { status: 404 });
    }
    return Response.json(fixture.preview);
  }

  const isDemoRequest = requestedCanonicalUrl === configuredDemoUrl();
  if (process.env.DEMO_MODE === "true" && isDemoRequest) {
    return Response.json(demoSocialPreview);
  }

  try {
    if (validation.provider === "youtube") {
      const canonicalUrl = normalizeSocialUrl(input.data.url);
      const videoId = extractYouTubeVideoId(canonicalUrl);
      if (!videoId) throw new Error("The YouTube video ID is missing or invalid.");
      const metadata = await getYouTubeMetadata(canonicalUrl);
      const fixture = getMockSocialVideoFixture(canonicalUrl);
      return Response.json(
        socialPreviewSchema.parse({
          provider: "youtube",
          canonicalUrl,
          embedUrl: buildSafeEmbedUrl("youtube", videoId),
          status: "available",
          title: metadata?.title ?? fixture?.preview.title ?? "YouTube Short",
          authorName: metadata?.authorName ?? fixture?.preview.authorName,
          authorUrl: metadata?.authorUrl ?? fixture?.preview.authorUrl,
          thumbnailUrl: metadata?.thumbnailUrl ?? fixture?.preview.thumbnailUrl,
        }),
      );
    }

    if (validation.provider === "tiktok") {
      const submittedUrl = normalizeSocialUrl(input.data.url);
      const submittedHost = new URL(submittedUrl).hostname;
      const canonicalUrl = submittedHost === "vm.tiktok.com" || submittedHost === "vt.tiktok.com"
        ? await resolveShortTikTokUrl(submittedUrl)
        : submittedUrl;
      const postId = extractTikTokVideoId(canonicalUrl);
      if (!postId) throw new Error("The TikTok redirect did not resolve to a public video.");

      const metadata = await getTikTokMetadata(canonicalUrl);
      const fixture = getMockSocialVideoFixture(canonicalUrl);
      return Response.json(
        socialPreviewSchema.parse({
          provider: "tiktok",
          canonicalUrl,
          embedUrl: buildSafeEmbedUrl("tiktok", postId),
          status: "available",
          title: metadata?.title ?? fixture?.preview.title,
          authorName: metadata?.authorName ?? fixture?.preview.authorName,
          authorUrl: metadata?.authorUrl ?? fixture?.preview.authorUrl,
          thumbnailUrl: metadata?.thumbnailUrl ?? fixture?.preview.thumbnailUrl,
        }),
      );
    }

    const canonicalUrl = requestedCanonicalUrl;
    const shortcode = extractInstagramShortcode(canonicalUrl);
    const postKind = getInstagramPostKind(canonicalUrl);
    if (!shortcode || !postKind) throw new Error("The Instagram shortcode is missing or invalid.");
    const fixture = getMockSocialVideoFixture(canonicalUrl);

    return Response.json(
      socialPreviewSchema.parse({
        provider: "instagram",
        canonicalUrl,
        embedUrl: buildSafeEmbedUrl("instagram", shortcode, postKind),
        status: "available",
        title: fixture?.preview.title,
        authorName: fixture?.preview.authorName,
      }),
    );
  } catch (error) {
    const fixturePreview = getMockSocialVideoFixture(requestedCanonicalUrl)?.preview;
    if (fixturePreview) return Response.json(fixturePreview);
    if (isDemoRequest) return Response.json(demoSocialPreview);
    const message = error instanceof Error ? error.message : "The reel preview is unavailable.";
    return Response.json(
      socialPreviewSchema.parse({
        provider: validation.provider,
        canonicalUrl: normalizeSocialUrl(input.data.url),
        embedUrl: null,
        status: "unavailable",
        error: message,
      }),
      { status: 422 },
    );
  }
}
