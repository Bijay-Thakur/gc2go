import { demoVideoAnalysis } from "@/data/demo-trip";
import { socialPreviewSchema, videoAnalysisSchema } from "@/lib/schemas";

// Demo fallback data only. This fixture is scoped to one exact public Instagram URL.
export const DEFAULT_DEMO_SOCIAL_URL = "https://www.instagram.com/reel/DPcvIttgWVm/";

export const demoSocialPreview = socialPreviewSchema.parse({
  provider: "instagram",
  canonicalUrl: DEFAULT_DEMO_SOCIAL_URL,
  embedUrl: "https://www.instagram.com/reel/DPcvIttgWVm/embed/",
  status: "available",
  title: "Longwood Gardens water lily reel",
  authorName: "Public Instagram creator",
  demoFallback: true,
});

export const demoSocialAnalysis = videoAnalysisSchema.parse({
  ...demoVideoAnalysis,
  evidence: [
    "The public caption identifies Longwood and highlights its water-lily garden.",
    "Provider metadata describes a botanical-garden reel, but the underlying video was not downloaded.",
  ],
  confidence: 0.76,
  sourceMode: "social-metadata",
  sourceUrl: DEFAULT_DEMO_SOCIAL_URL,
  provider: "instagram",
  contentAccess: "metadata-only",
  confidenceReason: "The caption supports Longwood Gardens, but public metadata alone cannot verify every visual detail.",
});
