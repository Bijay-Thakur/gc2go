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

  it("does not require confirmation for the recorded Longwood Gardens Reel", () => {
    expect(demoSocialAnalysis.confidence).toBeGreaterThanOrEqual(0.8);
    expect(demoSocialAnalysis.placeName).toBe("Longwood Gardens");
    expect(destinationNeedsConfirmation(demoSocialAnalysis)).toBe(false);
  });

  it("labels recorded social-video analysis as analyzed from social video", () => {
    expect(getAnalysisSourceLabel(demoSocialAnalysis)).toBe("Analyzed from social video");
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
