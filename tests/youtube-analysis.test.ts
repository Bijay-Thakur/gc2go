import { describe, expect, it } from "vitest";

import { parseYouTubeModelOutput } from "@/lib/gemini/youtube-analysis-contract";
import { videoAnalysisSchema } from "@/lib/schemas";

const structuredModelOutput = {
  placeName: "Pike Place Market",
  city: "Seattle",
  region: "Washington",
  country: "United States",
  activityType: "food market visit",
  visibleActivities: ["walking through market stalls"],
  suggestedDurationHours: 3,
  likelyRequiresCar: false,
  evidence: [{ timestamp: "00:04", observation: "The Pike Place Market sign is visible." }],
  visibleText: ["PUBLIC MARKET CENTER"],
  confidence: 0.96,
  confidenceReason: "A distinctive sign and spoken location name agree.",
};

describe("YouTube Gemini structured analysis", () => {
  it("validates a structured response with timestamped evidence", () => {
    const parsed = parseYouTubeModelOutput(JSON.stringify(structuredModelOutput));
    expect(parsed.placeName).toBe("Pike Place Market");
    expect(parsed.evidence[0]).toEqual({
      timestamp: "00:04",
      observation: "The Pike Place Market sign is visible.",
    });
  });

  it("rejects a response without evidence", () => {
    expect(() => parseYouTubeModelOutput(JSON.stringify({ ...structuredModelOutput, evidence: [] }))).toThrow();
  });

  it("accepts the server-owned YouTube source fields", () => {
    expect(videoAnalysisSchema.parse({
      ...structuredModelOutput,
      sourceMode: "youtube-video",
      provider: "youtube",
      contentAccess: "full-video",
      sourceUrl: "https://www.youtube.com/watch?v=9hE5-98ZeCg",
    }).sourceMode).toBe("youtube-video");
  });
});
