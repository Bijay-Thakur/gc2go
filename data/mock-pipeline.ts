import { groundedPlaceSchema, tripPlanSchema } from "@/lib/schemas";
import {
  untermyerPlace,
  untermyerPlan,
  UNTERMYER_REEL_URL,
} from "@/data/mock-untermyer";
import type { GroundedPlace, TripPlan } from "@/types";

interface MockPlanningFixture {
  place: GroundedPlace;
  plan: TripPlan;
}

function planningFixture(place: GroundedPlace, plan: TripPlan): MockPlanningFixture {
  return {
    place: groundedPlaceSchema.parse(place),
    plan: tripPlanSchema.parse(plan),
  };
}

const pikePlace = planningFixture(
  {
    name: "Pike Place Market",
    address: "85 Pike Street, Seattle, WA 98101",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pike+Place+Market+Seattle",
    openingSummary: "Individual businesses keep their own hours; verify the market directory before visiting.",
    reviewHighlights: ["Historic public market with food stalls, shops, and waterfront views."],
    reviewWarnings: ["The market can be crowded, and vendor hours vary."],
    nearbyFood: [],
    nearbyActivities: [],
    childFriendly: true,
    petFriendly: false,
    priceLevel: "Free entry; purchases vary.",
    citations: [
      {
        name: "Pike Place Market visitor information",
        url: "https://www.pikeplacemarket.org/about-pike-place-market/market-visitor-faq/",
      },
    ],
  },
  {
    proposedDay: "Saturday",
    startTime: "10:00",
    endTime: "18:00",
    feasibilityStatus: "not-feasible",
    blockers: ["A Seattle visit is not feasible as a same-day trip from the group’s Philadelphia starting locations."],
    driver: null,
    transportationRecommendation: "Plan Seattle as a separate trip with flights and lodging; use public transit within downtown Seattle.",
    estimatedPerPersonMinimum: 0,
    estimatedPerPersonMaximum: 85,
    itinerary: [
      {
        time: "10:00 AM",
        title: "Future Seattle trip",
        description: "Save Pike Place Market for a Seattle itinerary after the group chooses travel dates and transportation.",
      },
    ],
    nearbyPlaces: [],
    reviewTips: [
      {
        tip: "Check individual business hours in the official market directory.",
        sourceLabel: "Pike Place Market visitor information",
        sourceUrl: "https://www.pikeplacemarket.org/about-pike-place-market/market-visitor-faq/",
      },
    ],
  },
);

const centralPark = planningFixture(
  {
    name: "Central Park",
    address: "New York, NY",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Central+Park+New+York",
    openingSummary: "Park access and individual attraction hours vary; check official visitor information.",
    reviewHighlights: ["Large urban park with walking paths, landscapes, and historic features."],
    reviewWarnings: ["The park is extensive, so choose a specific entrance and route before arriving."],
    nearbyFood: [],
    nearbyActivities: [
      {
        name: "Vanderbilt Gate",
        category: "activity",
        summary: "Historic gate at the Fifth Avenue entrance to Conservatory Garden near 105th Street.",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vanderbilt+Gate+Central+Park",
      },
    ],
    childFriendly: true,
    petFriendly: true,
    priceLevel: "Free park entry.",
    citations: [
      {
        name: "Central Park Conservancy — Vanderbilt Gate",
        url: "https://www.centralparknyc.org/locations/vanderbilt-gate",
      },
    ],
  },
  {
    proposedDay: "Saturday",
    startTime: "10:00",
    endTime: "18:00",
    feasibilityStatus: "ready",
    blockers: [],
    driver: null,
    transportationRecommendation: "Take an intercity train to New York and use subway or walking to reach the park.",
    estimatedPerPersonMinimum: 55,
    estimatedPerPersonMaximum: 85,
    itinerary: [
      {
        time: "10:00 AM",
        title: "Travel to New York",
        description: "Meet at 30th Street Station and take the group’s selected train.",
      },
      {
        time: "1:00 PM",
        title: "Vanderbilt Gate and Conservatory Garden",
        description: "Enter near Fifth Avenue and 105th Street and explore the formal garden area.",
      },
      {
        time: "3:00 PM",
        title: "Central Park walk",
        description: "Follow a short north-end walking route before returning to the station.",
      },
    ],
    nearbyPlaces: [
      {
        name: "Vanderbilt Gate",
        type: "attraction",
        note: "The historic gate discussed by the Central Park Conservancy.",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vanderbilt+Gate+Central+Park",
      },
    ],
    reviewTips: [
      {
        tip: "Choose the Fifth Avenue entrance near 105th Street for Vanderbilt Gate.",
        sourceLabel: "Central Park Conservancy",
        sourceUrl: "https://www.centralparknyc.org/locations/vanderbilt-gate",
      },
    ],
  },
);

const franklinSquare = planningFixture(
  {
    name: "Franklin Square",
    address: "200 N 6th Street, Philadelphia, PA 19106",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Franklin+Square+Philadelphia",
    openingSummary: "Park and attraction hours vary by date; verify the official schedule before visiting.",
    reviewHighlights: ["Historic public square with open space and family-oriented attractions."],
    reviewWarnings: ["The Reel’s Chinese Lantern Festival dates ended August 16 and are not used as a current event claim."],
    nearbyFood: [],
    nearbyActivities: [],
    childFriendly: true,
    petFriendly: true,
    priceLevel: "Free park entry; individual attractions may cost extra.",
    citations: [
      {
        name: "Historic Philadelphia — Franklin Square",
        url: "https://historicphiladelphia.org/franklin-square/",
      },
    ],
  },
  {
    proposedDay: "Saturday",
    startTime: "10:00",
    endTime: "18:00",
    feasibilityStatus: "ready",
    blockers: [],
    driver: null,
    transportationRecommendation: "Use SEPTA or rideshare from the group’s Philadelphia starting locations.",
    estimatedPerPersonMinimum: 15,
    estimatedPerPersonMaximum: 45,
    itinerary: [
      {
        time: "11:00 AM",
        title: "Meet at Franklin Square",
        description: "Meet by the main entrance and walk through the square.",
      },
      {
        time: "12:00 PM",
        title: "Choose on-site activities",
        description: "Select only attractions that are open and fit the group’s budget that day.",
      },
      {
        time: "2:00 PM",
        title: "Old City walk",
        description: "Continue with a flexible walk through nearby public areas before heading home.",
      },
    ],
    nearbyPlaces: [],
    reviewTips: [
      {
        tip: "Confirm current park and attraction hours before departure.",
        sourceLabel: "Historic Philadelphia",
        sourceUrl: "https://historicphiladelphia.org/franklin-square/",
      },
    ],
  },
);

const longwoodGardens = planningFixture(
  {
    name: "Longwood Gardens",
    address: "1001 Longwood Road, Kennett Square, PA 19348",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Longwood+Gardens",
    openingSummary: "Admission and hours vary by date; timed tickets should be checked on the official site.",
    reviewHighlights: ["Botanical gardens, conservatories, and the Main Fountain Garden."],
    reviewWarnings: ["The grounds involve substantial walking and some programs are seasonal."],
    nearbyFood: [],
    nearbyActivities: [],
    childFriendly: true,
    petFriendly: false,
    priceLevel: "Paid admission; current ticket prices must be confirmed.",
    citations: [
      {
        name: "Longwood Gardens visitor information",
        url: "https://longwoodgardens.org/visit",
      },
    ],
  },
  {
    proposedDay: "Saturday",
    startTime: "10:00",
    endTime: "18:00",
    feasibilityStatus: "ready",
    blockers: [],
    driver: "Maya",
    transportationRecommendation: "Maya drives the group from Philadelphia with four available seats.",
    estimatedPerPersonMinimum: 48,
    estimatedPerPersonMaximum: 75,
    itinerary: [
      {
        time: "10:00 AM",
        title: "Meet and drive",
        description: "Meet in Center City and travel together to Kennett Square.",
      },
      {
        time: "11:30 AM",
        title: "Gardens and conservatories",
        description: "Follow a flexible route through the open garden areas and conservatories.",
      },
      {
        time: "3:30 PM",
        title: "Main Fountain Garden",
        description: "Visit the fountain area if it is open, then leave enough time for the return drive.",
      },
    ],
    nearbyPlaces: [],
    reviewTips: [
      {
        tip: "Check timed admission, operating hours, and the day’s fountain schedule before leaving.",
        sourceLabel: "Longwood Gardens visitor information",
        sourceUrl: "https://longwoodgardens.org/visit",
      },
    ],
  },
);

const fixturesBySourceUrl = new Map<string, MockPlanningFixture>([
  [UNTERMYER_REEL_URL, planningFixture(untermyerPlace, untermyerPlan)],
  ["https://www.youtube.com/watch?v=eNwtWyJYLfw", pikePlace],
  ["https://www.tiktok.com/@centralparknyc/video/7098419597799329066/", centralPark],
  ["https://www.tiktok.com/@discoverphl/video/7650566079432903950/", franklinSquare],
  ["https://www.instagram.com/reel/DCSTX1Ts9eK/", longwoodGardens],
]);

const fixturesByPlace = new Map<string, MockPlanningFixture>(
  [...fixturesBySourceUrl.values()].map((fixture) => [fixture.place.name.toLowerCase(), fixture]),
);

export function getMockPlanningFixtureBySourceUrl(sourceUrl: string | undefined) {
  return sourceUrl ? fixturesBySourceUrl.get(sourceUrl) ?? null : null;
}

export function getMockPlanningFixtureByPlaceName(placeName: string) {
  return fixturesByPlace.get(placeName.trim().toLowerCase()) ?? null;
}
