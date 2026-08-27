import { mockSocialVideoFixtures, type MockSocialVideoFixture } from "@/data/mock-social-videos";
import { untermyerSocialFixture } from "@/data/mock-untermyer";
import { inspectSocialUrl, normalizeSocialUrl } from "@/lib/social-links";

const fixturesByCanonicalUrl = new Map(
  mockSocialVideoFixtures.map((fixture) => [fixture.canonicalUrl, fixture]),
);

export function isMockPipelineEnabled() {
  return process.env.MOCK_PIPELINE === "true";
}

export function getMockSocialVideoFixture(url: string): MockSocialVideoFixture | null {
  if (isMockPipelineEnabled()) return untermyerSocialFixture;

  const validation = inspectSocialUrl(url);
  if (!validation.valid) return null;
  return fixturesByCanonicalUrl.get(normalizeSocialUrl(url)) ?? null;
}

export async function waitForMockAnalysisDelay(milliseconds = 1_800) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
