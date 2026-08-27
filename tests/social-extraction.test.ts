import { describe, expect, it } from "vitest";

import { normalizeBrightDataResponse } from "@/lib/social-extraction/normalize";

describe("Bright Data response normalization", () => {
  it("normalizes the documented TikTok video fields", () => {
    const asset = normalizeBrightDataResponse("tiktok", [{
      post_id: "7553300000000000000",
      description: "Travel clip",
      video_duration: 45,
      video_url: "https://v16-webapp-prime.tiktok.com/video/example.mp4",
      profile_username: "traveler",
    }], "https://www.tiktok.com/@traveler/video/7553300000000000000/");
    expect(asset.videoUrl).toContain("tiktok.com/video/example.mp4");
    expect(asset.durationSeconds).toBe(45);
  });

  it("normalizes the documented Instagram Reel fields", () => {
    const asset = normalizeBrightDataResponse("instagram", [{
      shortcode: "C5Rdyj_q7YN",
      description: "Travel Reel",
      length: "15.033",
      video_url: "https://scontent.cdninstagram.com/video/reel.mp4",
      thumbnail: "https://scontent.cdninstagram.com/image/reel.jpg",
      user_posted: "traveler",
    }], "https://www.instagram.com/reel/C5Rdyj_q7YN/");
    expect(asset.postId).toBe("C5Rdyj_q7YN");
    expect(asset.durationSeconds).toBe(15.033);
  });

  it("returns a typed error when no video URL is available", () => {
    expect(() => normalizeBrightDataResponse("instagram", [{ shortcode: "C5Rdyj_q7YN" }], "https://www.instagram.com/reel/C5Rdyj_q7YN/"))
      .toThrow("could not access its video");
  });
});
