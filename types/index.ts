import type {
  TripPlan as TripPlanContract,
  VideoAnalysis as VideoAnalysisContract,
} from "@/lib/schemas";

export type {
  AvailabilitySlot,
  GroupMember,
  ItineraryItem,
  NearbyPlace,
  PlaceEnrichment,
  ReviewTip,
  SocialLinkInput,
  SocialPreview,
  SocialProvider,
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

export interface PreviousPlan {
  id: string;
  title: string;
  status: "confirmed" | "saved";
  dateLabel: string;
  attendanceLabel: string;
  votes?: VotesByMember;
  messages: ChatMessage[];
  analysis: VideoAnalysisContract;
  plan: TripPlanContract;
}
