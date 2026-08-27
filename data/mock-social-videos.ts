import { socialPreviewSchema, videoAnalysisSchema } from "@/lib/schemas";
import {
  buildSafeEmbedUrl,
  extractInstagramShortcode,
  extractTikTokVideoId,
  extractYouTubeVideoId,
  normalizeSocialUrl,
} from "@/lib/social-links";
import type { SocialPreview, VideoAnalysis } from "@/types";

export interface MockSocialVideoFixture {
  id: string;
  submittedUrl: string;
  canonicalUrl: string;
  preview: SocialPreview;
  analysis: VideoAnalysis;
  sources: string[];
}

function youtubeFixture(submittedUrl: string, preview: Omit<SocialPreview, "canonicalUrl" | "embedUrl" | "provider" | "status">, analysis: Omit<VideoAnalysis, "sourceUrl" | "provider" | "sourceMode" | "contentAccess">, sources: string[]): MockSocialVideoFixture {
  const canonicalUrl = normalizeSocialUrl(submittedUrl);
  const videoId = extractYouTubeVideoId(canonicalUrl);
  if (!videoId) throw new Error("Mock YouTube fixture is missing a video ID.");
  return {
    id: videoId,
    submittedUrl,
    canonicalUrl,
    sources,
    preview: socialPreviewSchema.parse({
      provider: "youtube",
      canonicalUrl,
      embedUrl: buildSafeEmbedUrl("youtube", videoId),
      status: "available",
      ...preview,
    }),
    analysis: videoAnalysisSchema.parse({
      ...analysis,
      sourceMode: "youtube-video",
      provider: "youtube",
      contentAccess: "full-video",
      sourceUrl: canonicalUrl,
    }),
  };
}

function tiktokFixture(submittedUrl: string, preview: Omit<SocialPreview, "canonicalUrl" | "embedUrl" | "provider" | "status">, analysis: Omit<VideoAnalysis, "sourceUrl" | "provider" | "sourceMode" | "contentAccess">, sources: string[]): MockSocialVideoFixture {
  const canonicalUrl = normalizeSocialUrl(submittedUrl);
  const postId = extractTikTokVideoId(canonicalUrl);
  if (!postId) throw new Error("Mock TikTok fixture is missing a video ID.");
  return {
    id: postId,
    submittedUrl,
    canonicalUrl,
    sources,
    preview: socialPreviewSchema.parse({
      provider: "tiktok",
      canonicalUrl,
      embedUrl: buildSafeEmbedUrl("tiktok", postId),
      status: "available",
      ...preview,
    }),
    analysis: videoAnalysisSchema.parse({
      ...analysis,
      sourceMode: "social-video",
      provider: "tiktok",
      contentAccess: "full-video",
      sourceUrl: canonicalUrl,
    }),
  };
}

function instagramReelFixture(submittedUrl: string, preview: Omit<SocialPreview, "canonicalUrl" | "embedUrl" | "provider" | "status">, analysis: Omit<VideoAnalysis, "sourceUrl" | "provider" | "sourceMode" | "contentAccess">, sources: string[]): MockSocialVideoFixture {
  const canonicalUrl = normalizeSocialUrl(submittedUrl);
  const shortcode = extractInstagramShortcode(canonicalUrl);
  if (!shortcode) throw new Error("Mock Instagram fixture is missing a shortcode.");
  return {
    id: shortcode,
    submittedUrl,
    canonicalUrl,
    sources,
    preview: socialPreviewSchema.parse({
      provider: "instagram",
      canonicalUrl,
      embedUrl: buildSafeEmbedUrl("instagram", shortcode, "reel"),
      status: "available",
      ...preview,
    }),
    analysis: videoAnalysisSchema.parse({
      ...analysis,
      sourceMode: "social-video",
      provider: "instagram",
      contentAccess: "full-video",
      sourceUrl: canonicalUrl,
    }),
  };
}

// Public posts verified via provider oEmbed / official pages before this fixture was written.
export const youtubeShortFixture = youtubeFixture(
  "https://www.youtube.com/shorts/eNwtWyJYLfw",
  {
    title: "Seattle in 60 Seconds: Pike Place Market | things to do in Seattle #seattle #pnw #washingtonstate",
    authorName: "emmasedition",
    authorUrl: "https://www.youtube.com/@emmasedition",
    thumbnailUrl: "https://i.ytimg.com/vi/eNwtWyJYLfw/hqdefault.jpg",
  },
  {
    placeName: "Pike Place Market",
    city: "Seattle",
    region: "Washington",
    country: "United States",
    activityType: "public market visit",
    visibleActivities: ["walking the market arcade", "browsing food stalls", "watching street activity"],
    suggestedDurationHours: 3,
    likelyRequiresCar: false,
    evidence: [
      { observation: "The public Short title names Pike Place Market and frames it as a thing to do in Seattle." },
      { observation: "The title tags include #seattle, #pnw, and #washingtonstate, matching the market’s published downtown Seattle location." },
    ],
    visibleText: ["Pike Place Market", "Seattle"],
    confidence: 0.93,
    confidenceReason: "The video’s public title names Pike Place Market and Seattle, which matches the market’s official downtown Seattle, Washington location. The Short does not name a single stall, so the destination is the market as a whole.",
  },
  [
    "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=eNwtWyJYLfw",
    "https://www.pikeplacemarket.org/about-pike-place-market/market-visitor-faq/",
    "https://www.pikeplacemarket.org/7-ways-to-get-to-pike-place-market-using-public-transit/",
  ],
);

export const tiktokCentralParkFixture = tiktokFixture(
  "https://www.tiktok.com/@centralparknyc/video/7098419597799329066",
  {
    title: "The story of how part of a #GildedAge mansion became an entrance to #CentralPark! #CentralParkConservancy #SecretNYC",
    authorName: "Central Park Conservancy",
    authorUrl: "https://www.tiktok.com/@centralparknyc",
  },
  {
    placeName: "Central Park",
    city: "New York",
    region: "New York",
    country: "United States",
    activityType: "urban park visit",
    visibleActivities: ["viewing a historic park entrance", "walking in Central Park"],
    suggestedDurationHours: 2,
    likelyRequiresCar: false,
    evidence: [
      { observation: "The official Central Park Conservancy caption says a Gilded Age mansion became an entrance to Central Park." },
      { observation: "The caption uses #CentralPark and #CentralParkConservancy, and the account is Central Park Conservancy." },
    ],
    visibleText: ["Central Park", "Central Park Conservancy"],
    confidence: 0.91,
    confidenceReason: "The Conservancy’s public caption identifies Central Park and an entrance made from a Gilded Age mansion. It does not name Vanderbilt Gate or Conservatory Garden on-screen, so the destination is recorded as Central Park rather than a more specific garden.",
  },
  [
    "https://www.tiktok.com/oembed?url=https://www.tiktok.com/@centralparknyc/video/7098419597799329066",
    "https://www.centralparknyc.org/locations/vanderbilt-gate",
  ],
);

export const tiktokFranklinSquareFixture = tiktokFixture(
  "https://www.tiktok.com/@discoverphl/video/7650566079432903950",
  {
    title: "The Philadelphia Chinese Lantern Festival is back and brighter than ever! Come see the beautiful lanterns and cultural performances, eat great food, and much more at Franklin Square now through August 16! And if you’re here for the World Cup, there are lanterns just for you 😉⚽️. #discoverPHL",
    authorName: "Discover Philadelphia",
    authorUrl: "https://www.tiktok.com/@discoverphl",
  },
  {
    placeName: "Franklin Square",
    city: "Philadelphia",
    region: "Pennsylvania",
    country: "United States",
    activityType: "public square visit",
    visibleActivities: ["viewing lantern displays", "watching cultural performances", "eating festival food"],
    suggestedDurationHours: 2.5,
    likelyRequiresCar: false,
    evidence: [
      { observation: "The Discover Philadelphia caption names Franklin Square as the place to see lanterns, performances, and food." },
      { observation: "The caption places the event in Philadelphia and uses #discoverPHL." },
    ],
    visibleText: ["Franklin Square", "Philadelphia Chinese Lantern Festival"],
    confidence: 0.94,
    confidenceReason: "The public caption names Franklin Square in Philadelphia. It also advertised lantern-festival dates through August 16; that schedule is treated as caption evidence only, not as a claim that the festival is still running.",
  },
  [
    "https://www.tiktok.com/oembed?url=https://www.tiktok.com/@discoverphl/video/7650566079432903950",
  ],
);

export const instagramLongwoodFixture = instagramReelFixture(
  "https://www.instagram.com/reel/DCSTX1Ts9eK/",
  {
    title: "Magical Moment number 12: 1906 Restaurant and Bar & Lounge overlooking Main Fountain Garden",
    authorName: "Longwood Gardens",
  },
  {
    placeName: "Longwood Gardens",
    city: "Kennett Square",
    region: "Pennsylvania",
    country: "United States",
    activityType: "botanical gardens visit",
    visibleActivities: ["Main Fountain Garden views", "garden-to-table dining at 1906 Restaurant"],
    suggestedDurationHours: 6,
    likelyRequiresCar: true,
    evidence: [
      { observation: "The official @longwoodgardens Reel caption names 1906 Restaurant and Bar & Lounge overlooking the Main Fountain Garden." },
      { observation: "The same caption points visitors to longwoodgardens.org for Longwood Reimagined and member previews." },
    ],
    visibleText: ["Longwood Gardens", "1906 Restaurant", "Main Fountain Garden"],
    confidence: 0.95,
    confidenceReason: "The public Reel is from Longwood Gardens and names the Main Fountain Garden plus 1906 Restaurant on the estate. Kennett Square, Pennsylvania is the gardens’ published location.",
  },
  [
    "https://www.instagram.com/reel/DCSTX1Ts9eK/",
    "https://longwoodgardens.org/visit",
  ],
);

export const mockSocialVideoFixtures: MockSocialVideoFixture[] = [
  youtubeShortFixture,
  tiktokCentralParkFixture,
  tiktokFranklinSquareFixture,
  instagramLongwoodFixture,
];
