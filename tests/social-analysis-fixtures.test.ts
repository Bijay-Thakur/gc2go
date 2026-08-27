import { describe, expect, it } from "vitest";

import {
  instagramLongwoodFixture,
  mockSocialVideoFixtures,
  tiktokCentralParkFixture,
  tiktokFranklinSquareFixture,
  youtubeShortFixture,
} from "@/data/mock-social-videos";
import { getMockSocialVideoFixture } from "@/lib/social-analysis-fixtures";
import { normalizeSocialUrl } from "@/lib/social-links";

describe("recorded social analysis fixtures", () => {
  it("covers one YouTube Short, two TikTok videos, and one Instagram Reel", () => {
    expect(mockSocialVideoFixtures.map((fixture) => fixture.analysis.provider)).toEqual([
      "youtube",
      "tiktok",
      "tiktok",
      "instagram",
    ]);
  });

  it("resolves the Short watch URL and the original shorts URL to the same Pike Place analysis", () => {
    const fromShorts = getMockSocialVideoFixture("https://www.youtube.com/shorts/eNwtWyJYLfw");
    const fromWatch = getMockSocialVideoFixture("https://www.youtube.com/watch?v=eNwtWyJYLfw");
    expect(fromShorts?.analysis.placeName).toBe("Pike Place Market");
    expect(fromWatch?.canonicalUrl).toBe(youtubeShortFixture.canonicalUrl);
    expect(fromWatch?.analysis.city).toBe("Seattle");
    expect(fromWatch?.analysis.region).toBe("Washington");
    expect(fromWatch?.analysis.country).toBe("United States");
  });

  it("keeps Conservancy and Discover Philadelphia captions tied to named places only", () => {
    expect(getMockSocialVideoFixture(tiktokCentralParkFixture.submittedUrl)?.analysis.placeName).toBe("Central Park");
    expect(getMockSocialVideoFixture(tiktokFranklinSquareFixture.submittedUrl)?.analysis.placeName).toBe("Franklin Square");
    expect(getMockSocialVideoFixture(instagramLongwoodFixture.submittedUrl)?.analysis.placeName).toBe("Longwood Gardens");
  });

  it("does not invent a fixture for an unrecorded public URL", () => {
    expect(getMockSocialVideoFixture("https://www.youtube.com/watch?v=9hE5-98ZeCg")).toBeNull();
  });

  it("normalizes submitted fixture URLs before lookup", () => {
    expect(normalizeSocialUrl("https://youtube.com/shorts/eNwtWyJYLfw?feature=share"))
      .toBe(youtubeShortFixture.canonicalUrl);
  });
});
