import { describe, expect, it } from "vitest";

import { demoPlaceEnrichment, demoVideoAnalysis } from "@/data/demo-trip";
import { members } from "@/data/members";
import { auditPlanBudget, calculateGroupFeasibility, findCommonAvailability } from "@/lib/feasibility";
import { groundedPlaceSchema, tripPlanSchema } from "@/lib/schemas";

const groundedPlace = groundedPlaceSchema.parse({
  name: "Test destination",
  reviewHighlights: [],
  reviewWarnings: [],
  nearbyFood: [],
  nearbyActivities: [],
  citations: [{ name: "Google Maps", url: "https://www.google.com/maps?q=test" }],
});

describe("deterministic group feasibility", () => {
  it("finds the exact common Saturday intersection", () => {
    expect(findCommonAvailability(members)).toEqual({ day: "Saturday", start: "10:00", end: "18:00" });
  });

  it("reports insufficient car seats", () => {
    const reducedSeats = members.map((member) => ({ ...member, availableSeats: member.canDrive ? 2 : 0 }));
    const result = calculateGroupFeasibility(reducedSeats, demoVideoAnalysis, groundedPlace);
    expect(result.driver).toBeNull();
    expect(result.blockers).toContain("No available driver has enough seats for the group.");
  });

  it("marks a plan over the minimum member budget as not feasible", () => {
    const expensivePlan = tripPlanSchema.parse({
      proposedDay: "Saturday",
      startTime: "10:00",
      endTime: "18:00",
      feasibilityStatus: "ready",
      blockers: [],
      driver: "Maya",
      transportationRecommendation: "Drive together.",
      estimatedPerPersonMinimum: 90,
      estimatedPerPersonMaximum: 120,
      itinerary: [{ time: "10:00 AM", title: "Visit", description: "Visit the destination." }],
      nearbyPlaces: demoPlaceEnrichment.nearbyPlaces,
      reviewTips: demoPlaceEnrichment.reviewTips,
    });
    expect(auditPlanBudget(expensivePlan, 85).blockers[0]).toContain("$85");
  });
});
