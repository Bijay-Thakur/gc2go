import "server-only";

import { BrightDataSocialExtractionProvider } from "@/lib/social-extraction/bright-data";
import type { SocialExtractionProvider } from "@/lib/social-extraction/types";

export function createSocialExtractionProvider(): SocialExtractionProvider {
  return new BrightDataSocialExtractionProvider();
}
