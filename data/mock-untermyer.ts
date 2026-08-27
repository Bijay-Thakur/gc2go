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
  memberRoutes: [
    {
      memberId: "maya",
      name: "Maya",
      from: "Upper West Side, Manhattan",
      car: "25–40 min",
      subway: "65–80 min",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Upper+West+Side+Manhattan&destination=945+N+Broadway+Yonkers+NY",
    },
    {
      memberId: "theo",
      name: "Theo",
      from: "Astoria, Queens",
      car: "35–55 min",
      subway: "90–110 min",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Astoria+Queens+NY&destination=945+N+Broadway+Yonkers+NY",
    },
    {
      memberId: "jordan",
      name: "Jordan",
      from: "Williamsburg, Brooklyn",
      car: "45–70 min",
      subway: "95–115 min",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Williamsburg+Brooklyn+NY&destination=945+N+Broadway+Yonkers+NY",
    },
    {
      memberId: "priya",
      name: "Priya",
      from: "Lower East Side, Manhattan",
      car: "40–60 min",
      subway: "85–100 min",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Lower+East+Side+Manhattan&destination=945+N+Broadway+Yonkers+NY",
    },
  ],
  meetup: {
    name: "96th Street & Broadway",
    detail:
      "Meet outside the 96th Street 1/2/3 station. It keeps everyone on a major subway hub, puts the group directly on the northbound 1, and gives Maya a practical Upper West Side pickup point if the crew drives.",
    time: "10:00 AM",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=96th+Street+Subway+Station+Broadway+New+York",
  },
  suggestedSpots: [
    {
      id: "walled-garden",
      name: "Walled Garden",
      description: "The garden’s Indo-Persian centerpiece, with canals, mosaics, an amphitheater, and the Persian Pool.",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sphinxes%20on%20pillars%20in%20the%20walled%20garden%20of%20the%20Untermeyer%20Garden.jpg?width=900",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Walled+Garden+Untermyer+Gardens",
      duration: "45 min",
    },
    {
      id: "vista",
      name: "The Vista",
      description: "A long descending staircase modeled after Villa d’Este, ending at a Hudson River overlook.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/2020_Untermyer_Gardens_The_Vista_looking_west_to_Hudson_River.jpg/1280px-2020_Untermyer_Gardens_The_Vista_looking_west_to_Hudson_River.jpg",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Vista+Untermyer+Gardens",
      duration: "30 min",
    },
    {
      id: "temple-love",
      name: "Temple of Love",
      description: "A rocky water-feature fantasy crowned by a circular temple with views toward the Hudson and Palisades.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/2020_Untermyer_Gardens_Temple_of_Love_from_southwest.jpg/960px-2020_Untermyer_Gardens_Temple_of_Love_from_southwest.jpg",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Temple+of+Love+Untermyer+Gardens",
      duration: "35 min",
    },
    {
      id: "ruin-garden",
      name: "Ruin Garden",
      description: "Colorful planting, surviving estate structures, a grotto, and access toward the Old Croton Aqueduct.",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ruin%20Untermyer.jpg?width=900",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ruin+Garden+Untermyer+Gardens",
      duration: "30 min",
    },
  ],
  lunchSpots: [
    {
      id: "taco-project",
      name: "The Taco Project",
      cuisine: "Mexican",
      distance: "0.5 mi",
      rating: "4.5★ review snapshot",
      famousDish: "Carne asada tacos",
      imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=80",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Taco+Project+1086+N+Broadway+Yonkers",
    },
    {
      id: "enbu",
      name: "Enbu",
      cuisine: "Japanese & Asian fusion",
      distance: "0.5 mi",
      rating: "4.7★ review snapshot",
      famousDish: "Spicy tuna crispy rice",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Enbu+1086+N+Broadway+Yonkers",
    },
    {
      id: "giannas",
      name: "Gianna’s",
      cuisine: "Italian-American",
      distance: "0.4 mi",
      rating: "4.5★ Google snapshot",
      famousDish: "Thin-crust brick-oven pizza",
      imageUrl: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gianna%27s+1034+N+Broadway+Yonkers",
    },
    {
      id: "fresh-co",
      name: "fresh&co",
      cuisine: "Healthy bowls & salads",
      distance: "0.5 mi",
      rating: "4.7★ delivery snapshot",
      famousDish: "Roasted salmon market plate",
      imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=fresh%26co+1086+N+Broadway+Yonkers",
    },
  ],
  fixedCosts: {
    admission: 0,
    foodMinimum: 22,
    foodMaximum: 36,
  },
} as const;
