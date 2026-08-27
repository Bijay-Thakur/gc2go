import "server-only";

import { analyzeExtractedSocialVideo } from "@/lib/gemini/analyze-video";
import { createSocialExtractionProvider } from "@/lib/social-extraction/provider";
import type { ExtractableSocialProvider } from "@/lib/social-extraction/types";
import { detectSocialProvider } from "@/lib/social-links";
import { fetchPublicVideo } from "@/lib/video-fetch";

export async function ingestWithBrightDataThenAnalyzeVideo(url: string) {
  const detected = detectSocialProvider(url);
  if (detected !== "tiktok" && detected !== "instagram") {
    throw new Error("Bright Data only handles TikTok and Instagram URLs.");
  }
  const provider: ExtractableSocialProvider = detected;
  const asset = await createSocialExtractionProvider().extract(url, provider);
  const video = await fetchPublicVideo(asset);
  return analyzeExtractedSocialVideo(asset, video);
}
