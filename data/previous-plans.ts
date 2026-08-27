import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import { tripPlanSchema, videoAnalysisSchema } from "@/lib/schemas";
import type { PreviousPlan } from "@/types";

export const previousPlans: PreviousPlan[] = [
  {
    id: "storm-king",
    title: "Storm King Art Center",
    status: "confirmed",
    dateLabel: "Saturday",
    attendanceLabel: "3 of 4 attending",
    analysis: videoAnalysisSchema.parse({
      ...demoVideoAnalysis,
      placeName: "Storm King Art Center",
      city: "New Windsor",
      region: "New York",
      activityType: "outdoor sculpture park",
      visibleActivities: ["sculpture walk", "picnic", "tram loop"],
      evidence: ["Large-scale outdoor sculptures and the Hudson Valley landscape match Storm King."],
      confidence: 0.94,
    }),
    plan: tripPlanSchema.parse({
      ...demoTripPlan,
      proposedDay: "Saturday",
      startTime: "09:00",
      endTime: "18:30",
      driver: "Maya",
      transportationRecommendation: "Maya drives; meet at 30th Street Station for one pickup.",
      estimatedPerPersonMinimum: 52,
      estimatedPerPersonMaximum: 70,
      itinerary: [
        { time: "9:00 AM", title: "Meet & head north", description: "One pickup near 30th Street, then drive to the Hudson Valley." },
        { time: "11:30 AM", title: "Sculpture loop", description: "Walk the south fields, stop for lunch, and take the tram back." },
        { time: "4:00 PM", title: "Coffee in Beacon", description: "Make one relaxed stop before the drive home." },
      ],
      nearbyPlaces: [
        { name: "Beacon, NY", type: "coffee", note: "A compact Main Street stop on the return route." },
        { name: "Newburgh Waterfront", type: "food", note: "Casual dinner options with Hudson River views." },
      ],
      reviewTips: [
        { tip: "Wear shoes that can handle hills and uneven grass.", sourceLabel: "Storm King visitor guide", sourceUrl: "https://stormking.org/visit/" },
        { tip: "Download the map before arriving in case reception is limited.", sourceLabel: "Storm King maps", sourceUrl: "https://stormking.org/visit/" },
      ],
    }),
  },
  {
    id: "dumbo-food",
    title: "DUMBO Food Crawl",
    status: "saved",
    dateLabel: "Date undecided",
    attendanceLabel: "2 interested",
    analysis: videoAnalysisSchema.parse({
      ...demoVideoAnalysis,
      placeName: "DUMBO Food Crawl",
      city: "Brooklyn",
      region: "New York",
      activityType: "food crawl and waterfront walk",
      visibleActivities: ["pizza stop", "waterfront walk", "dessert stop"],
      likelyRequiresCar: false,
      suggestedDurationHours: 5,
      evidence: ["Brooklyn Bridge views and recognizable DUMBO streets support the neighborhood match."],
      confidence: 0.91,
    }),
    plan: tripPlanSchema.parse({
      ...demoTripPlan,
      proposedDay: "Sunday",
      startTime: "11:00",
      endTime: "17:00",
      feasibilityStatus: "decision-needed",
      blockers: ["The group still needs to choose a weekend date."],
      driver: null,
      transportationRecommendation: "Take the train to York Street and keep the day car-free.",
      estimatedPerPersonMinimum: 45,
      estimatedPerPersonMaximum: 65,
      itinerary: [
        { time: "11:00 AM", title: "Pizza opener", description: "Split two pies so there is room for later stops." },
        { time: "1:00 PM", title: "Waterfront reset", description: "Walk Brooklyn Bridge Park between food stops." },
        { time: "3:00 PM", title: "Dessert finale", description: "Finish with ice cream and coffee near Old Fulton Street." },
      ],
      nearbyPlaces: [
        { name: "Brooklyn Bridge Park", type: "attraction", note: "Free waterfront views between stops." },
        { name: "Time Out Market", type: "food", note: "A flexible backup when the group wants different cuisines." },
      ],
      reviewTips: [
        { tip: "Go before the late-afternoon bridge crowds.", sourceLabel: "Brooklyn Bridge Park", sourceUrl: "https://www.brooklynbridgepark.org/" },
        { tip: "Share portions to keep the crawl within budget.", sourceLabel: "DUMBO directory", sourceUrl: "https://dumbo.is/" },
      ],
    }),
  },
];
