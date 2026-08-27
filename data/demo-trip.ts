import { placeEnrichmentSchema, tripPlanSchema, videoAnalysisSchema } from "@/lib/schemas";

// Demo data only. Phases 3 and 4 replace these values with validated API responses
// while preserving this fallback for presentations.
export const demoVideoAnalysis = videoAnalysisSchema.parse({
  placeName: "Longwood Gardens",
  city: "Kennett Square",
  region: "Pennsylvania",
  activityType: "botanical gardens and outdoor walk",
  visibleActivities: ["fountain show", "garden paths", "conservatory visit"],
  suggestedDurationHours: 7,
  likelyRequiresCar: true,
  evidence: [
    "Large illuminated fountains match the Main Fountain Garden.",
    "The glass conservatory and formal garden layout are visible in the reel.",
  ],
  confidence: 0.76,
});

export const demoPlaceEnrichment = placeEnrichmentSchema.parse({
  rating: 4.8,
  openingSummary: "Timed admission is typically recommended; hours vary by season and event.",
  nearbyPlaces: [
    {
      name: "The Creamery of Kennett Square",
      type: "food",
      note: "Relaxed food-hall stop in a converted creamery.",
    },
    {
      name: "Anson B. Nixon Park",
      type: "attraction",
      note: "Easy trails and open space a short drive away.",
    },
  ],
  reviewTips: [
    {
      tip: "Reserve a timed entry before the weekend; popular fountain slots can fill up.",
      sourceLabel: "Longwood visitor information",
      sourceUrl: "https://longwoodgardens.org/visit",
    },
    {
      tip: "Wear comfortable shoes—the gardens cover more ground than the reel suggests.",
      sourceLabel: "Google Maps listing",
      sourceUrl: "https://www.google.com/maps/search/?api=1&query=Longwood+Gardens",
    },
  ],
  estimatedAdmissionCost: { minimum: 32, maximum: 42 },
  estimatedFoodCost: { minimum: 16, maximum: 20 },
  sourceLinks: [
    "https://longwoodgardens.org/visit",
    "https://www.google.com/maps/search/?api=1&query=Longwood+Gardens",
  ],
});

export const demoTripPlan = tripPlanSchema.parse({
  proposedDay: "Saturday",
  startTime: "10:00",
  endTime: "18:00",
  feasibilityStatus: "ready",
  blockers: [],
  driver: "Maya",
  transportationRecommendation:
    "Maya drives the group from Center City; her car has four available seats.",
  estimatedPerPersonMinimum: 48,
  estimatedPerPersonMaximum: 62,
  itinerary: [
    {
      time: "10:00 AM",
      title: "Meet & roll out",
      description: "Meet near City Hall, grab coffee, and leave together in Maya’s car.",
    },
    {
      time: "11:15 AM",
      title: "Gardens + conservatory",
      description: "Follow the highlights loop, explore the conservatory, and catch a fountain show.",
    },
    {
      time: "4:15 PM",
      title: "Early dinner nearby",
      description: "Stop at The Creamery, then head back to Philadelphia by 6:00 PM.",
    },
  ],
  nearbyPlaces: [
    {
      name: "The Creamery of Kennett Square",
      type: "food",
      note: "Casual food-hall energy, about 10 minutes away.",
    },
    {
      name: "Anson B. Nixon Park",
      type: "attraction",
      note: "A low-key alternate outdoor stop if the group finishes early.",
    },
  ],
  reviewTips: [
    {
      tip: "Book timed admission before the weekend.",
      sourceLabel: "Visitor information",
      sourceUrl: "https://longwoodgardens.org/visit",
    },
    {
      tip: "Bring comfortable walking shoes and a light layer.",
      sourceLabel: "Google Maps reviews",
      sourceUrl: "https://www.google.com/maps/search/?api=1&query=Longwood+Gardens",
    },
  ],
});
