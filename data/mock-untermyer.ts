import {
  groundedPlaceSchema,
  socialPreviewSchema,
  tripPlanSchema,
  videoAnalysisSchema,
} from "@/lib/schemas";

export const UNTERMYER_REEL_URL = "https://www.instagram.com/reel/C67Vy76uq5J/";

export const untermyerSocialFixture = {
  id: "C67Vy76uq5J",
  submittedUrl: UNTERMYER_REEL_URL,
  canonicalUrl: UNTERMYER_REEL_URL,
  preview: socialPreviewSchema.parse({
    provider: "instagram",
    canonicalUrl: UNTERMYER_REEL_URL,
    embedUrl: "https://www.instagram.com/reel/C67Vy76uq5J/embed/",
    status: "available",
    title: "A spring walk through Untermyer Gardens",
    authorName: "Untermyer Gardens Conservancy",
  }),
  analysis: videoAnalysisSchema.parse({
    placeName: "Untermyer Park and Gardens",
    city: "Yonkers",
    region: "New York",
    country: "United States",
    activityType: "historic garden visit",
    visibleActivities: [
      "walking through the Walled Garden",
      "viewing the Persian Pool",
      "exploring garden paths and overlooks",
    ],
    suggestedDurationHours: 3,
    likelyRequiresCar: false,
    evidence: [
      {
        observation: "The official Untermyer Gardens Conservancy Reel describes a walk through Untermyer Gardens in spring.",
      },
      {
        observation: "The caption identifies Yonkers, New York and tags the Persian Pool and public garden.",
      },
    ],
    visibleText: ["Untermyer Gardens", "Yonkers", "New York"],
    confidence: 0.98,
    confidenceReason: "The Reel is published by the official Conservancy account and directly names the garden and city.",
    sourceMode: "social-video",
    sourceUrl: UNTERMYER_REEL_URL,
    provider: "instagram",
    contentAccess: "full-video",
  }),
  sources: [
    UNTERMYER_REEL_URL,
    "https://www.untermyergardens.org/visit.html",
    "https://www.untermyergardens.org/hours-and-directions.html",
  ],
};

export const untermyerPlace = groundedPlaceSchema.parse({
  name: "Untermyer Park and Gardens",
  address: "945 N Broadway, Yonkers, NY 10701",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Untermyer+Park+and+Gardens",
  openingSummary: "Open daily at 9:00 AM. Closing varies seasonally; last entry is 30 minutes before closing.",
  reviewHighlights: [
    "Free admission with no reservation required for groups under 20.",
    "The Walled Garden, Vista, Temple of Love, and Hudson River views are signature features.",
  ],
  reviewWarnings: [
    "There are no food or beverage sales inside the garden; bring water.",
    "Pets and emotional-support animals are not allowed; service animals are welcome.",
    "Weekend parking can be limited.",
  ],
  nearbyFood: [
    {
      name: "The Taco Project",
      category: "food",
      summary: "Casual Mexican food at the Boyce Thompson Center, about half a mile from the garden.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Taco+Project+1086+N+Broadway+Yonkers",
      priceLevel: "$",
    },
    {
      name: "Enbu",
      category: "food",
      summary: "Asian-fusion restaurant at 1086 N Broadway, listed by the Conservancy among nearby restaurants.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Enbu+1086+N+Broadway+Yonkers",
      priceLevel: "$$",
    },
    {
      name: "Gianna's",
      category: "food",
      summary: "Nearby Italian restaurant at 1034 N Broadway, listed by the Conservancy.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gianna%27s+1034+N+Broadway+Yonkers",
      priceLevel: "$$",
    },
  ],
  nearbyActivities: [
    {
      name: "Old Croton Aqueduct Trail",
      category: "activity",
      summary: "Historic walking trail with an entrance into Untermyer near the Ruin Garden.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Old+Croton+Aqueduct+Trail+Yonkers",
    },
    {
      name: "Greystone Hudson River Overlook",
      category: "activity",
      summary: "Add a short riverside-view walk near the lower garden entrance and Greystone station.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Greystone+Station+Yonkers",
    },
  ],
  childFriendly: true,
  petFriendly: false,
  priceLevel: "Free admission",
  citations: [
    {
      name: "Untermyer Gardens visitor information",
      url: "https://www.untermyergardens.org/visit.html",
    },
    {
      name: "Untermyer Gardens directions",
      url: "https://www.untermyergardens.org/hours-and-directions.html",
    },
    {
      name: "Untermyer Gardens nearby restaurants",
      url: "https://www.untermyergardens.org/nearby-restaurants-and-lodging.html",
    },
  ],
});

export const untermyerPlan = tripPlanSchema.parse({
  proposedDay: "Saturday",
  startTime: "10:00",
  endTime: "18:00",
  feasibilityStatus: "ready",
  blockers: [],
  driver: "Maya",
  transportationRecommendation:
    "Choose between a shared car or the 1 subway plus Bee-Line 2 bus. Times are planning estimates, not live traffic or schedules.",
  estimatedPerPersonMinimum: 28,
  estimatedPerPersonMaximum: 48,
  itinerary: [
    {
      time: "10:00 AM",
      title: "Meet in Manhattan",
      description: "Meet near the selected route and make sure everyone has water before leaving.",
    },
    {
      time: "11:30 AM",
      title: "Walled Garden + Persian Pool",
      description: "Start with the Indo-Persian Walled Garden, amphitheater, canals, and restored Persian Pool.",
    },
    {
      time: "1:00 PM",
      title: "Vista + Temple of Love",
      description: "Walk the Vista for Hudson views, then explore the rocky Temple of Love area.",
    },
    {
      time: "2:30 PM",
      title: "Late lunch nearby",
      description: "Walk or drive to the Boyce Thompson Center and choose a food stop that fits the group.",
    },
  ],
  nearbyPlaces: [
    {
      name: "Old Croton Aqueduct Trail",
      type: "attraction",
      note: "Extend the garden walk onto the historic trail near the Ruin Garden.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Old+Croton+Aqueduct+Trail+Yonkers",
    },
    {
      name: "The Taco Project",
      type: "food",
      note: "Casual Mexican option at 1086 N Broadway.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Taco+Project+1086+N+Broadway+Yonkers",
    },
    {
      name: "Enbu",
      type: "food",
      note: "Asian-fusion option at the nearby Boyce Thompson Center.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Enbu+1086+N+Broadway+Yonkers",
    },
  ],
  reviewTips: [
    {
      tip: "Admission is free, but check the seasonal closing time before leaving.",
      sourceLabel: "Official visitor information",
      sourceUrl: "https://www.untermyergardens.org/visit.html",
    },
    {
      tip: "Bring water; the garden does not sell food or beverages.",
      sourceLabel: "Official FAQ",
      sourceUrl: "https://www.untermyergardens.org/faq1.html",
    },
  ],
});

export const untermyerExperience = {
  summary:
    "A free, three-hour garden escape in Yonkers with Persian-inspired architecture, Hudson River views, and an easy nearby lunch stop.",
  images: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/2020_Untermyer_Gardens_The_Vista_looking_west_to_Hudson_River.jpg/1280px-2020_Untermyer_Gardens_The_Vista_looking_west_to_Hudson_River.jpg",
      alt: "The Vista descending toward the Hudson River at Untermyer Gardens",
      label: "The Vista",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/2020_Untermyer_Gardens_Temple_of_Love_from_southwest.jpg/960px-2020_Untermyer_Gardens_Temple_of_Love_from_southwest.jpg",
      alt: "Temple of Love rock garden at Untermyer Gardens",
      label: "Temple of Love",
    },
  ],
  imageCredit: {
    label: "Photos: Beyond My Ken / Wikimedia Commons, CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/Category:Untermyer_Park_and_Gardens",
  },
  transportOptions: [
    {
      id: "car",
      label: "Drive together",
      duration: "35–55 min",
      detail: "Estimated from Upper Manhattan; weekend traffic and limited parking can add time.",
      transportMinimum: 6,
      transportMaximum: 12,
    },
    {
      id: "subway",
      label: "Subway + bus",
      duration: "75–90 min",
      detail: "Take the 1 to 242nd Street, then Bee-Line 2 to Dehaven Drive.",
      transportMinimum: 6,
      transportMaximum: 12,
    },
  ],
  fixedCosts: {
    admission: 0,
    foodMinimum: 22,
    foodMaximum: 36,
  },
} as const;
