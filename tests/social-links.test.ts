import { describe, expect, it } from "vitest";

import {
  buildSafeEmbedUrl,
  detectSocialProvider,
  extractInstagramShortcode,
  extractTikTokVideoId,
  extractYouTubeVideoId,
  normalizeSocialUrl,
  normalizeYouTubeUrl,
  validateSocialUrl,
} from "@/lib/social-links";

describe("social link security and parsing", () => {
  it("validates standard and shortened TikTok URLs", () => {
    expect(validateSocialUrl("https://www.tiktok.com/@weekendcrew/video/1234567890123456789")).toBe(true);
    expect(validateSocialUrl("https://vm.tiktok.com/ZM123abc/")).toBe(true);
    expect(detectSocialProvider("https://m.tiktok.com/@weekendcrew/video/1234567890123456789")).toBe("tiktok");
  });

  it("validates Instagram Reel and post URLs", () => {
    expect(validateSocialUrl("https://www.instagram.com/reel/DPcvIttgWVm/")).toBe(true);
    expect(validateSocialUrl("https://instagram.com/p/C4ismclK07I/")).toBe(true);
    expect(detectSocialProvider("https://www.instagram.com/reel/DPcvIttgWVm/")).toBe("instagram");
  });

  it("validates YouTube Shorts, watch, and youtu.be video URLs", () => {
    expect(validateSocialUrl("https://www.youtube.com/shorts/9hE5-98ZeCg")).toBe(true);
    expect(validateSocialUrl("https://youtube.com/shorts/9hE5-98ZeCg")).toBe(true);
    expect(validateSocialUrl("https://www.youtube.com/watch?v=9hE5-98ZeCg")).toBe(true);
    expect(validateSocialUrl("https://youtu.be/9hE5-98ZeCg")).toBe(true);
    expect(detectSocialProvider("https://youtu.be/9hE5-98ZeCg")).toBe("youtube");
  });

  it("rejects unsupported, local, IP, non-HTTPS, and data URLs", () => {
    expect(validateSocialUrl("https://youtube.com/watch?v=abc")).toBe(false);
    expect(validateSocialUrl("https://localhost/reel/DPcvIttgWVm/")).toBe(false);
    expect(validateSocialUrl("https://127.0.0.1/reel/DPcvIttgWVm/")).toBe(false);
    expect(validateSocialUrl("http://www.instagram.com/reel/DPcvIttgWVm/")).toBe(false);
    expect(validateSocialUrl("data:text/html,hello")).toBe(false);
    expect(validateSocialUrl("https://www.youtube.com/@travelcreator")).toBe(false);
    expect(validateSocialUrl("https://www.youtube.com/playlist?list=PL1234567890")).toBe(false);
    expect(validateSocialUrl("https://www.youtube.com/watch?list=PL1234567890")).toBe(false);
    expect(validateSocialUrl("https://www.youtube.com/shorts/not-valid")).toBe(false);
  });

  it("extracts and normalizes YouTube video IDs", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/shorts/9hE5-98ZeCg?feature=share"))
      .toBe("9hE5-98ZeCg");
    expect(extractYouTubeVideoId("https://youtu.be/9hE5-98ZeCg?t=4")).toBe("9hE5-98ZeCg");
    expect(normalizeYouTubeUrl("https://youtube.com/shorts/9hE5-98ZeCg"))
      .toBe("https://www.youtube.com/watch?v=9hE5-98ZeCg");
    expect(normalizeSocialUrl("https://youtu.be/9hE5-98ZeCg?t=4"))
      .toBe("https://www.youtube.com/watch?v=9hE5-98ZeCg");
  });

  it("extracts a TikTok post ID", () => {
    expect(extractTikTokVideoId("https://www.tiktok.com/@scout2015/video/6718335390845095173?lang=en"))
      .toBe("6718335390845095173");
    expect(extractTikTokVideoId("https://vm.tiktok.com/ZM123abc/")).toBeNull();
  });

  it("extracts an Instagram shortcode", () => {
    expect(extractInstagramShortcode("https://www.instagram.com/reel/DPcvIttgWVm/?igsh=demo"))
      .toBe("DPcvIttgWVm");
  });

  it("normalizes provider URLs and builds trusted embeds", () => {
    expect(normalizeSocialUrl("https://instagram.com/reel/DPcvIttgWVm/?igsh=demo#fragment"))
      .toBe("https://www.instagram.com/reel/DPcvIttgWVm/");
    expect(buildSafeEmbedUrl("tiktok", "6718335390845095173"))
      .toContain("https://www.tiktok.com/player/v1/6718335390845095173");
    expect(buildSafeEmbedUrl("instagram", "DPcvIttgWVm"))
      .toBe("https://www.instagram.com/reel/DPcvIttgWVm/embed/");
    expect(buildSafeEmbedUrl("youtube", "9hE5-98ZeCg"))
      .toBe("https://www.youtube-nocookie.com/embed/9hE5-98ZeCg");
  });
});
