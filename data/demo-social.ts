import { instagramLongwoodFixture } from "@/data/mock-social-videos";
import { socialPreviewSchema, videoAnalysisSchema } from "@/lib/schemas";

export const DEFAULT_DEMO_SOCIAL_URL = instagramLongwoodFixture.canonicalUrl;

export const demoSocialPreview = socialPreviewSchema.parse(instagramLongwoodFixture.preview);

export const demoSocialAnalysis = videoAnalysisSchema.parse(instagramLongwoodFixture.analysis);
