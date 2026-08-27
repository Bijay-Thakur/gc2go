import { describe, expect, it } from "vitest";

import { demoSocialAnalysis } from "@/data/demo-social";
import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import {
  destinationNeedsConfirmation,
  enterPlanningPipeline,
  getAnalysisSourceLabel,
} from "@/lib/plan-flow";

describe("shared upload and social planning flow", () => {
  it("preserves the existing MP4 flow", () => {
    expect(getAnalysisSourceLabel(demoVideoAnalysis)).toBe("Analyzed from uploaded video");
    const result = enterPlanningPipeline(demoVideoAnalysis, "Longwood Gardens", demoTripPlan);
    expect(result.plan.feasibilityStatus).toBe("ready");
    expect(result.analysis.placeName).toBe("Longwood Gardens");
  });

  it("requires human confirmation below 0.80 confidence", () => {
    expect(demoSocialAnalysis.confidence).toBeLessThan(0.8);
    expect(destinationNeedsConfirmation(demoSocialAnalysis)).toBe(true);
  });

  it("sends a confirmed social destination into the same plan pipeline", () => {
    const result = enterPlanningPipeline(
      { ...demoSocialAnalysis, placeName: "Unknown destination" },
      "Longwood Gardens",
      demoTripPlan,
      "Bijay",
    );

    expect(result.analysis.sourceMode).toBe("user-confirmed");
    expect(result.analysis.placeName).toBe("Longwood Gardens");
    expect(getAnalysisSourceLabel(result.analysis)).toBe("Destination confirmed by Bijay");
    expect(result.plan).toEqual(demoTripPlan);
  });
});
