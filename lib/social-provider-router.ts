import type { SocialLinkInput, VideoAnalysis } from "@/types";

export interface SocialAnalysisHandlers {
  youtube: (url: string) => Promise<VideoAnalysis>;
  tiktok: (url: string) => Promise<VideoAnalysis>;
  instagram: (url: string) => Promise<VideoAnalysis>;
}

export function routeSocialAnalysis(input: SocialLinkInput, handlers: SocialAnalysisHandlers) {
  switch (input.provider) {
    case "youtube":
      return handlers.youtube(input.url);
    case "tiktok":
      return handlers.tiktok(input.url);
    case "instagram":
      return handlers.instagram(input.url);
  }
}
