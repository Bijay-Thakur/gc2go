export type ExtractableSocialProvider = "tiktok" | "instagram";

export interface SocialMediaAsset {
  provider: ExtractableSocialProvider;
  canonicalUrl: string;
  postId?: string;
  caption?: string;
  authorName?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  durationSeconds?: number;
  createdAt?: string;
}

export interface SocialExtractionProvider {
  extract(url: string, provider: ExtractableSocialProvider): Promise<SocialMediaAsset>;
}

export class SocialExtractionError extends Error {
  constructor(
    readonly code: "INVALID_SOCIAL_URL" | "BRIGHTDATA_NOT_CONFIGURED" | "SOCIAL_EXTRACTION_FAILED" | "VIDEO_NOT_ACCESSIBLE",
    message: string,
  ) {
    super(message);
    this.name = "SocialExtractionError";
  }
}
