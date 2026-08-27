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

export const socialProviderSchema = z.enum(["tiktok", "instagram"]);

export const videoAnalysisSchema = z.object({
  placeName: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  activityType: z.string().min(1),
  visibleActivities: z.array(z.string()).min(1),
  suggestedDurationHours: z.number().positive(),
  likelyRequiresCar: z.boolean(),
  evidence: z.array(z.string()).min(1),
  confidence: z.number().min(0).max(1),
  sourceMode: z.enum(["uploaded-video", "social-metadata", "thumbnail", "user-confirmed"]).optional(),
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
export type VideoAnalysis = z.infer<typeof videoAnalysisSchema>;
export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkInputSchema>;
export type SocialPreview = z.infer<typeof socialPreviewSchema>;
export type NearbyPlace = z.infer<typeof nearbyPlaceSchema>;
export type ReviewTip = z.infer<typeof reviewTipSchema>;
export type ItineraryItem = z.infer<typeof itineraryItemSchema>;
export type PlaceEnrichment = z.infer<typeof placeEnrichmentSchema>;
export type TripPlan = z.infer<typeof tripPlanSchema>;
