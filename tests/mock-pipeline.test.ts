import { describe, expect, it } from "vitest";

import {
  getMockPlanningFixtureByPlaceName,
  getMockPlanningFixtureBySourceUrl,
} from "@/data/mock-pipeline";
import { mockSocialVideoFixtures } from "@/data/mock-social-videos";
import {
  untermyerPlace,
  untermyerPlan,
  untermyerSocialFixture,
} from "@/data/mock-untermyer";
import { groundedPlaceSchema, tripPlanSchema } from "@/lib/schemas";

describe("complete mock planning pipeline", () => {
  it.each(mockSocialVideoFixtures)(
    "has schema-valid place and plan data for $canonicalUrl",
    (socialFixture) => {
      const planningFixture = getMockPlanningFixtureBySourceUrl(socialFixture.canonicalUrl);

      expect(planningFixture).not.toBeNull();
      expect(groundedPlaceSchema.safeParse(planningFixture?.place).success).toBe(true);
      expect(tripPlanSchema.safeParse(planningFixture?.plan).success).toBe(true);
      expect(planningFixture?.place.name).toBe(socialFixture.analysis.placeName);
      expect(getMockPlanningFixtureByPlaceName(planningFixture?.place.name ?? "")).toBe(planningFixture);
    },
  );

  it("does not substitute unrelated destinations", () => {
    expect(getMockPlanningFixtureByPlaceName("Unknown destination")).toBeNull();
    expect(getMockPlanningFixtureBySourceUrl("https://example.com/video")).toBeNull();
  });

  it("has a complete Untermyer Gardens simulated workflow", () => {
    const fixture = getMockPlanningFixtureBySourceUrl(untermyerSocialFixture.canonicalUrl);

    expect(fixture?.place).toEqual(untermyerPlace);
    expect(fixture?.plan).toEqual(untermyerPlan);
    expect(fixture?.place.nearbyFood).toHaveLength(3);
    expect(fixture?.plan.estimatedPerPersonMinimum).toBe(28);
    expect(fixture?.plan.estimatedPerPersonMaximum).toBe(48);
  });
});
