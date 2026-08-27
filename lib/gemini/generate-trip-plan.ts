import "server-only";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { auditPlanBudget } from "@/lib/feasibility";
import { tripPlanSchema } from "@/lib/schemas";
import type { FeasibilityResult, GroundedPlace, GroupMember, TripPlan, VideoAnalysis } from "@/types";

const generatedPlanSchema = z.object({
  estimatedPerPersonMinimum: z.number().nonnegative(),
  estimatedPerPersonMaximum: z.number().nonnegative(),
  itinerary: z.array(z.object({
    time: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
  })).min(1).max(6),
});

const generatedPlanJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedPerPersonMinimum: { type: "number", minimum: 0 },
    estimatedPerPersonMaximum: { type: "number", minimum: 0 },
    itinerary: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          time: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["time", "title", "description"],
      },
    },
  },
  required: ["estimatedPerPersonMinimum", "estimatedPerPersonMaximum", "itinerary"],
} as const;

export async function generateGroundedTripPlan(
  analysis: VideoAnalysis,
  place: GroundedPlace,
  members: GroupMember[],
  feasibility: FeasibilityResult,
): Promise<TripPlan> {
  if (!feasibility.commonAvailability) {
    throw new Error("No common availability window exists for this group.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini trip planning is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3.7-flash";
  const prompt = `Create a practical plan using only the provided grounded place information and group constraints. Do not invent venues, ratings, opening hours, review claims, links, or prices. Use only nearby places present in the grounded data. Respect the exact common availability window and budget. Return structured JSON.

All costs are estimates: use a per-person minimum and maximum range. Never claim live ticket or hotel pricing. Do not introduce hotels.

Input data:
${JSON.stringify({ analysis, place, members, feasibility })}`;

  const interaction = await ai.interactions.create({
    model,
    input: prompt,
    response_format: { type: "text", mime_type: "application/json", schema: generatedPlanJsonSchema },
    store: false,
  });

  let raw: unknown;
  try {
    raw = JSON.parse(interaction.output_text ?? "");
  } catch {
    throw new Error("Gemini returned malformed trip-plan JSON.");
  }
  const generated = generatedPlanSchema.parse(raw);
  if (generated.estimatedPerPersonMaximum < generated.estimatedPerPersonMinimum) {
    throw new Error("Gemini returned an invalid cost estimate range.");
  }

  const source = place.citations[0];
  const blockers = [...feasibility.blockers];
  const plan = tripPlanSchema.parse({
    proposedDay: feasibility.commonAvailability.day,
    startTime: feasibility.commonAvailability.start,
    endTime: feasibility.commonAvailability.end,
    feasibilityStatus: blockers.length ? "not-feasible" : "ready",
    blockers,
    driver: feasibility.driver?.name ?? null,
    transportationRecommendation: analysis.likelyRequiresCar
      ? feasibility.driver
        ? `${feasibility.driver.name} can drive with ${feasibility.driver.availableSeats} available seats.`
        : "A car appears necessary, but the group has no driver with enough seats."
      : "A car does not appear necessary; confirm the preferred transit or rideshare route before departure.",
    estimatedPerPersonMinimum: generated.estimatedPerPersonMinimum,
    estimatedPerPersonMaximum: generated.estimatedPerPersonMaximum,
    itinerary: generated.itinerary,
    nearbyPlaces: [...place.nearbyFood, ...place.nearbyActivities].map((recommendation) => ({
      name: recommendation.name,
      type: recommendation.category === "food" ? "food" : "attraction",
      note: recommendation.summary,
      mapsUrl: recommendation.mapsUrl,
    })),
    reviewTips: [...place.reviewHighlights, ...place.reviewWarnings].map((tip) => ({
      tip,
      sourceLabel: source.name,
      sourceUrl: source.url,
    })),
  });

  return auditPlanBudget(plan, feasibility.minimumBudget);
}
