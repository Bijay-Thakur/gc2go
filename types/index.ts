export type {
  AvailabilitySlot,
  GroupMember,
  ItineraryItem,
  NearbyPlace,
  PlaceEnrichment,
  ReviewTip,
  TripPlan,
  VideoAnalysis,
} from "@/lib/schemas";

export type VoteChoice = "yes" | "maybe" | "no";
export type VotesByMember = Record<string, VoteChoice | undefined>;

export interface ChatMessage {
  id: string;
  memberId: string;
  text: string;
  time: string;
}
