import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import { tripPlanSchema, videoAnalysisSchema } from "@/lib/schemas";
import type { ChatMessage, PreviousPlan } from "@/types";

const basePreviousPlans: PreviousPlan[] = [
  {
    id: "storm-king",
    title: "Storm King Art Center",
    status: "confirmed",
    dateLabel: "Saturday",
    attendanceLabel: "3 of 4 attending",
    votes: { maya: "yes", theo: "yes", jordan: "maybe", priya: "yes" },
    messages: [
      { id: "storm-message-1", memberId: "maya", text: "Storm King is looking perfect for Saturday.", time: "10:12 AM" },
      { id: "storm-message-2", memberId: "jordan", text: "I’m a maybe, but the sculpture loop sounds great.", time: "10:18 AM" },
      { id: "storm-message-3", memberId: "priya", text: "I’m in. Can we stop for coffee in Beacon afterward?", time: "10:24 AM" },
    ],
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
    messages: [
      { id: "dumbo-message-1", memberId: "theo", text: "Saving this food crawl for when we pick a date.", time: "Yesterday" },
      { id: "dumbo-message-2", memberId: "maya", text: "The waterfront walk makes this a strong backup plan.", time: "Yesterday" },
    ],
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

const allMembersConfirmedPlan: PreviousPlan = {
  ...basePreviousPlans[0],
  id: "longwood-gardens",
  title: "Longwood Gardens",
  dateLabel: "Sunday",
  attendanceLabel: "4 of 4 attending",
  votes: { maya: "yes", theo: "yes", jordan: "yes", priya: "yes" },
  messages: [
    { id: "longwood-message-1", memberId: "maya", text: "Everyone said yes to Longwood Gardens!", time: "Sunday" },
    { id: "longwood-message-2", memberId: "theo", text: "The conservatory and fountain show are must-sees.", time: "Sunday" },
    { id: "longwood-message-3", memberId: "priya", text: "I’ll bring snacks for the drive.", time: "Sunday" },
  ],
  analysis: videoAnalysisSchema.parse({
    ...basePreviousPlans[0].analysis,
    placeName: "Longwood Gardens",
    city: "Kennett Square",
    region: "Pennsylvania",
    activityType: "garden and conservatory visit",
    visibleActivities: ["garden walk", "conservatory visit", "fountain show"],
    evidence: ["Formal gardens, conservatories, and fountains match Longwood Gardens."],
    confidence: 0.95,
  }),
  plan: tripPlanSchema.parse({
    ...basePreviousPlans[0].plan,
    proposedDay: "Sunday",
    startTime: "10:00",
    endTime: "17:00",
    driver: "Maya",
    transportationRecommendation: "Maya drives; everyone meets at the group pickup point.",
    estimatedPerPersonMinimum: 38,
    estimatedPerPersonMaximum: 55,
  }),
};

export const previousPlans: PreviousPlan[] = [...basePreviousPlans, allMembersConfirmedPlan];
export const confirmedPlans = previousPlans.filter((plan) => plan.status === "confirmed");
export const savedPlans = previousPlans.filter((plan) => plan.status === "saved");
