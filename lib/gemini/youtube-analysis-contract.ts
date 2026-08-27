import { videoAnalysisSchema } from "@/lib/schemas";

export const youtubeModelAnalysisSchema = videoAnalysisSchema.pick({
  placeName: true,
  city: true,
  region: true,
  country: true,
  activityType: true,
  visibleActivities: true,
  suggestedDurationHours: true,
  likelyRequiresCar: true,
  evidence: true,
  visibleText: true,
  confidence: true,
  confidenceReason: true,
}).required({
  country: true,
  confidenceReason: true,
});

export const youtubeAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    placeName: { type: ["string", "null"] },
    city: { type: ["string", "null"] },
    region: { type: ["string", "null"] },
    country: { type: ["string", "null"] },
    activityType: { type: "string" },
    visibleActivities: { type: "array", items: { type: "string" }, minItems: 1 },
    suggestedDurationHours: { type: "number", minimum: 0.5, maximum: 24 },
    likelyRequiresCar: { type: "boolean" },
    evidence: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          timestamp: { type: "string" },
          observation: { type: "string" },
        },
        required: ["observation"],
      },
    },
    visibleText: { type: "array", items: { type: "string" } },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    confidenceReason: { type: "string" },
  },
  required: [
    "placeName",
    "city",
    "region",
    "country",
    "activityType",
    "visibleActivities",
    "suggestedDurationHours",
    "likelyRequiresCar",
    "evidence",
    "visibleText",
    "confidence",
    "confidenceReason",
  ],
} as const;

export function parseYouTubeModelOutput(text: string | undefined) {
  if (!text) throw new Error("Gemini returned an empty YouTube analysis.");

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned malformed YouTube analysis JSON.");
  }

  return youtubeModelAnalysisSchema.parse(value);
}
