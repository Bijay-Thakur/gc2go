import { describe, expect, it, vi } from "vitest";

import { routeSocialAnalysis } from "@/lib/social-provider-router";
import type { VideoAnalysis } from "@/types";

const result: VideoAnalysis = {
  placeName: "Test place",
  city: "Test city",
  region: "Test region",
  activityType: "visit",
  visibleActivities: ["walking"],
  suggestedDurationHours: 2,
  likelyRequiresCar: false,
  evidence: [{ observation: "A sign is visible." }],
  visibleText: ["TEST"],
  confidence: 0.9,
  confidenceReason: "Visible sign.",
  sourceMode: "youtube-video",
  provider: "youtube",
  contentAccess: "full-video",
};

describe("social provider routing", () => {
  it("routes YouTube without invoking Bright Data providers", async () => {
    const youtube = vi.fn(async () => result);
    const tiktok = vi.fn(async () => result);
    const instagram = vi.fn(async () => result);
    await routeSocialAnalysis(
      { url: "https://www.youtube.com/watch?v=9hE5-98ZeCg", provider: "youtube" },
      { youtube, tiktok, instagram },
    );
    expect(youtube).toHaveBeenCalledOnce();
    expect(tiktok).not.toHaveBeenCalled();
    expect(instagram).not.toHaveBeenCalled();
  });

  it.each(["tiktok", "instagram"] as const)("routes %s to its adapter", async (provider) => {
    const handlers = {
      youtube: vi.fn(async () => result),
      tiktok: vi.fn(async () => result),
      instagram: vi.fn(async () => result),
    };
    await routeSocialAnalysis({ url: `https://${provider}.com/example`, provider }, handlers);
    expect(handlers[provider]).toHaveBeenCalledOnce();
    expect(handlers.youtube).not.toHaveBeenCalled();
  });
});
