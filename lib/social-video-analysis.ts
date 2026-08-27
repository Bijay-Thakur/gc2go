import "server-only";

import { analyzeYouTubeUrlDirectlyWithGemini } from "@/lib/gemini/analyze-youtube";
import {
  getMockSocialVideoFixture,
  isMockPipelineEnabled,
  waitForMockAnalysisDelay,
} from "@/lib/social-analysis-fixtures";
import { ingestWithBrightDataThenAnalyzeVideo } from "@/lib/social-extraction/analyze";
import { routeSocialAnalysis } from "@/lib/social-provider-router";
import type { SocialLinkInput } from "@/types";

export async function analyzeSocialVideo(input: SocialLinkInput) {
  const fixture = getMockSocialVideoFixture(input.url);
  if (fixture) {
    await waitForMockAnalysisDelay();
    return fixture.analysis;
  }

  if (isMockPipelineEnabled()) {
    throw new Error("This URL is not included in the recorded mock pipeline.");
  }

  return routeSocialAnalysis(input, {
    youtube: analyzeYouTubeUrlDirectlyWithGemini,
    tiktok: ingestWithBrightDataThenAnalyzeVideo,
    instagram: ingestWithBrightDataThenAnalyzeVideo,
  });
}
