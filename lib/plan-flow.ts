import { tripPlanSchema, videoAnalysisSchema } from "@/lib/schemas";
import type { TripPlan, VideoAnalysis } from "@/types";

export const DESTINATION_CONFIDENCE_THRESHOLD = 0.8;

export function destinationNeedsConfirmation(analysis: VideoAnalysis): boolean {
  return analysis.confidence < DESTINATION_CONFIDENCE_THRESHOLD;
}

export function confirmAnalysisDestination(
  analysis: VideoAnalysis,
  placeName: string,
  confirmedBy = "Bijay",
): VideoAnalysis {
  const trimmedPlace = placeName.trim();
  if (!trimmedPlace) throw new Error("A destination is required before planning.");

  if (!destinationNeedsConfirmation(analysis) && trimmedPlace === analysis.placeName) {
    return videoAnalysisSchema.parse(analysis);
  }

  return videoAnalysisSchema.parse({
    ...analysis,
    placeName: trimmedPlace,
    sourceMode: "user-confirmed",
    confidenceReason: `Destination confirmed by ${confirmedBy} after reviewing the available evidence.`,
  });
}

export function getAnalysisSourceLabel(analysis: VideoAnalysis, confirmedBy = "Bijay"): string {
  if (analysis.sourceMode === "user-confirmed") return `Destination confirmed by ${confirmedBy}`;
  if (analysis.sourceMode === "uploaded-video" || analysis.contentAccess === "full-video") {
    return "Analyzed from uploaded video";
  }
  if (analysis.provider || analysis.sourceMode === "social-metadata" || analysis.sourceMode === "thumbnail") {
    return "Identified from public reel information";
  }
  return "Built from Weekend Crew details";
}

export function enterPlanningPipeline(
  analysis: VideoAnalysis,
  confirmedPlace: string,
  plan: TripPlan,
  confirmedBy = "Bijay",
): { analysis: VideoAnalysis; plan: TripPlan } {
  return {
    analysis: confirmAnalysisDestination(analysis, confirmedPlace, confirmedBy),
    plan: tripPlanSchema.parse(plan),
  };
}
