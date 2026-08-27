import { z } from "zod";

import { SocialExtractionError, type SocialMediaAsset } from "@/lib/social-extraction/types";

const tiktokRecordSchema = z.object({
  post_id: z.union([z.string(), z.number()]).optional(),
  description: z.string().nullable().optional(),
  create_time: z.union([z.string(), z.number()]).nullable().optional(),
  video_duration: z.union([z.string(), z.number()]).nullable().optional(),
  video_url: z.string().nullable().optional(),
  profile_username: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
}).passthrough();

const instagramRecordSchema = z.object({
  url: z.string().nullable().optional(),
  post_id: z.union([z.string(), z.number()]).optional(),
  shortcode: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  date_posted: z.string().nullable().optional(),
  length: z.union([z.string(), z.number()]).nullable().optional(),
  video_url: z.string().nullable().optional(),
  user_posted: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
}).passthrough();

function trustedHttpsUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function positiveNumber(value: unknown): number | undefined {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function firstRecord(payload: unknown) {
  const parsed = z.array(z.unknown()).min(1).safeParse(payload);
  if (!parsed.success) {
    throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "The extraction provider returned an unexpected response.");
  }
  return parsed.data[0];
}

export function normalizeBrightDataResponse(
  provider: "tiktok" | "instagram",
  payload: unknown,
  canonicalUrl: string,
): SocialMediaAsset {
  const rawRecord = firstRecord(payload);

  if (process.env.NODE_ENV === "development" && rawRecord && typeof rawRecord === "object") {
    console.info(`[Bright Data] ${provider} response keys:`, Object.keys(rawRecord).sort());
  }

  if (provider === "tiktok") {
    const result = tiktokRecordSchema.safeParse(rawRecord);
    if (!result.success) throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "TikTok extraction returned invalid data.");
    if (result.data.error) throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "This TikTok is private or unavailable.");
    const videoUrl = trustedHttpsUrl(result.data.video_url);
    if (!videoUrl) throw new SocialExtractionError("VIDEO_NOT_ACCESSIBLE", "We found the TikTok post but could not access its video.");

    return {
      provider,
      canonicalUrl,
      postId: result.data.post_id === undefined ? undefined : String(result.data.post_id),
      caption: result.data.description ?? undefined,
      authorName: result.data.profile_username ?? undefined,
      thumbnailUrl: trustedHttpsUrl(result.data.thumbnail) ?? trustedHttpsUrl(result.data.cover),
      videoUrl,
      durationSeconds: positiveNumber(result.data.video_duration),
      createdAt: typeof result.data.create_time === "string" ? result.data.create_time : undefined,
    };
  }

  const result = instagramRecordSchema.safeParse(rawRecord);
  if (!result.success) throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "Instagram extraction returned invalid data.");
  if (result.data.error) throw new SocialExtractionError("SOCIAL_EXTRACTION_FAILED", "This Instagram Reel is private or unavailable.");
  const videoUrl = trustedHttpsUrl(result.data.video_url);
  if (!videoUrl) throw new SocialExtractionError("VIDEO_NOT_ACCESSIBLE", "We found the Instagram post but could not access its video.");

  return {
    provider,
    canonicalUrl,
    postId: result.data.shortcode ?? (result.data.post_id === undefined ? undefined : String(result.data.post_id)),
    caption: result.data.description ?? undefined,
    authorName: result.data.user_posted ?? undefined,
    thumbnailUrl: trustedHttpsUrl(result.data.thumbnail),
    videoUrl,
    durationSeconds: positiveNumber(result.data.length),
    createdAt: result.data.date_posted ?? undefined,
  };
}
