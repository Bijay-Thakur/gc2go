import { z } from "zod";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const dayOfWeekSchema = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const availabilitySlotSchema = z.object({
  day: dayOfWeekSchema,
  start: z.string().regex(timePattern, "Use 24-hour HH:mm format"),
  end: z.string().regex(timePattern, "Use 24-hour HH:mm format"),
});

export const groupMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarInitials: z.string().min(1).max(3),
  startingLocation: z.string().min(1),
  availability: z.array(availabilitySlotSchema).min(1),
  maximumBudget: z.number().nonnegative(),
  canDrive: z.boolean(),
  availableSeats: z.number().int().nonnegative(),
  dietaryPreferences: z.array(z.string()),
  requiresPetFriendly: z.boolean(),
  requiresChildFriendly: z.boolean(),
});

export const socialProviderSchema = z.enum(["youtube", "tiktok", "instagram"]);

export const videoEvidenceSchema = z.preprocess(
  (value) => typeof value === "string" ? { observation: value } : value,
  z.object({
    timestamp: z.string().min(1).max(40).optional(),
    observation: z.string().min(1).max(1_000),
  }),
);

export const videoAnalysisSchema = z.object({
  placeName: z.string().min(1).nullable(),
  city: z.string().min(1).nullable(),
  region: z.string().min(1).nullable(),
  country: z.string().min(1).nullable().optional(),
  activityType: z.string().min(1),
  visibleActivities: z.array(z.string()).min(1),
  suggestedDurationHours: z.number().positive(),
  likelyRequiresCar: z.boolean(),
  evidence: z.array(videoEvidenceSchema).min(1),
  visibleText: z.array(z.string().min(1)).default([]),
  confidence: z.number().min(0).max(1),
  sourceMode: z.enum(["uploaded-video", "youtube-video", "social-video", "social-metadata", "thumbnail", "user-confirmed"]).optional(),
  sourceUrl: z.url().optional(),
  provider: socialProviderSchema.optional(),
  contentAccess: z.enum(["full-video", "metadata-only", "thumbnail-only"]).optional(),
  confidenceReason: z.string().min(1).optional(),
});

export const socialLinkInputSchema = z.object({
  url: z.url(),
  provider: socialProviderSchema,
}).strict();

export const socialPreviewSchema = z.object({
  provider: socialProviderSchema,
  canonicalUrl: z.url(),
  embedUrl: z.url().nullable(),
  status: z.enum(["available", "blocked", "unavailable"]),
  title: z.string().max(500).optional(),
  authorName: z.string().max(200).optional(),
  authorUrl: z.url().optional(),
  thumbnailUrl: z.url().optional(),
  error: z.string().max(500).optional(),
  demoFallback: z.boolean().optional(),
});

export const nearbyPlaceSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["attraction", "food", "coffee", "other"]),
  note: z.string().min(1),
  mapsUrl: z.url().optional(),
});

export const reviewTipSchema = z.object({
  tip: z.string().min(1),
  sourceLabel: z.string().min(1),
  sourceUrl: z.url(),
});

export const itineraryItemSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const placeEnrichmentSchema = z.object({
  rating: z.number().min(0).max(5),
  openingSummary: z.string().min(1),
  nearbyPlaces: z.array(nearbyPlaceSchema).max(2),
  reviewTips: z.array(reviewTipSchema).max(2),
  estimatedAdmissionCost: z.object({
    minimum: z.number().nonnegative(),
    maximum: z.number().nonnegative(),
  }),
  estimatedFoodCost: z.object({
    minimum: z.number().nonnegative(),
    maximum: z.number().nonnegative(),
  }),
  sourceLinks: z.array(z.url()),
});

export const groundedRecommendationSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["food", "activity"]),
  summary: z.string().min(1),
  mapsUrl: z.url(),
  rating: z.number().min(0).max(5).optional(),
  priceLevel: z.string().min(1).optional(),
});

export const mapsCitationSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
});

export const groundedPlaceSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1).optional(),
  mapsUrl: z.url().optional(),
  rating: z.number().min(0).max(5).optional(),
  openingSummary: z.string().min(1).optional(),
  reviewHighlights: z.array(z.string().min(1)),
  reviewWarnings: z.array(z.string().min(1)),
  nearbyFood: z.array(groundedRecommendationSchema).max(3),
  nearbyActivities: z.array(groundedRecommendationSchema).max(2),
  childFriendly: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  priceLevel: z.string().min(1).optional(),
  citations: z.array(mapsCitationSchema).min(1),
});

export const feasibilityResultSchema = z.object({
  commonAvailability: availabilitySlotSchema.nullable(),
  tripFitsWindow: z.boolean(),
  driver: z.object({
    name: z.string().min(1),
    availableSeats: z.number().int().nonnegative(),
  }).nullable(),
  requiredSeats: z.number().int().positive(),
  minimumBudget: z.number().nonnegative(),
  blockers: z.array(z.string()),
});

export const tripPlanSchema = z.object({
  proposedDay: dayOfWeekSchema,
  startTime: z.string().regex(timePattern, "Use 24-hour HH:mm format"),
  endTime: z.string().regex(timePattern, "Use 24-hour HH:mm format"),
  feasibilityStatus: z.enum(["ready", "decision-needed", "not-feasible"]),
  blockers: z.array(z.string()),
  driver: z.string().nullable(),
  transportationRecommendation: z.string().min(1),
  estimatedPerPersonMinimum: z.number().nonnegative(),
  estimatedPerPersonMaximum: z.number().nonnegative(),
  itinerary: z.array(itineraryItemSchema).min(1),
  nearbyPlaces: z.array(nearbyPlaceSchema),
  reviewTips: z.array(reviewTipSchema),
});

export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;
export type GroupMember = z.infer<typeof groupMemberSchema>;
export type VideoEvidence = z.infer<typeof videoEvidenceSchema>;
export type VideoAnalysis = z.infer<typeof videoAnalysisSchema>;
export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkInputSchema>;
export type SocialPreview = z.infer<typeof socialPreviewSchema>;
export type NearbyPlace = z.infer<typeof nearbyPlaceSchema>;
export type ReviewTip = z.infer<typeof reviewTipSchema>;
export type ItineraryItem = z.infer<typeof itineraryItemSchema>;
export type PlaceEnrichment = z.infer<typeof placeEnrichmentSchema>;
export type GroundedRecommendation = z.infer<typeof groundedRecommendationSchema>;
export type MapsCitation = z.infer<typeof mapsCitationSchema>;
export type GroundedPlace = z.infer<typeof groundedPlaceSchema>;
export type FeasibilityResult = z.infer<typeof feasibilityResultSchema>;
export type TripPlan = z.infer<typeof tripPlanSchema>;
