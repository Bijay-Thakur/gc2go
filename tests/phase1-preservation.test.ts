import { describe, expect, it } from "vitest";

import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import { members } from "@/data/members";
import { tripPlanSchema, videoAnalysisSchema } from "@/lib/schemas";

describe("Phase 1 demo contracts", () => {
  it("keeps the four predefined Weekend Crew members", () => {
    expect(members).toHaveLength(4);
    expect(members.map((member) => member.name)).toEqual(["Maya", "Theo", "Jordan", "Priya"]);
  });

  it("keeps the mocked upload analysis and trip plan schema-valid", () => {
    expect(videoAnalysisSchema.safeParse(demoVideoAnalysis).success).toBe(true);
    expect(tripPlanSchema.safeParse(demoTripPlan).success).toBe(true);
  });
});
