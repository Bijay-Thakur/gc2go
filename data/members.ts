import { groupMemberSchema } from "@/lib/schemas";

export const members = groupMemberSchema.array().parse([
  {
    id: "maya",
    name: "Maya",
    avatarInitials: "MA",
    startingLocation: "Upper West Side, Manhattan",
    availability: [
      { day: "Saturday", start: "09:00", end: "20:00" },
      { day: "Sunday", start: "10:00", end: "17:00" },
    ],
    maximumBudget: 120,
    canDrive: true,
    availableSeats: 4,
    dietaryPreferences: ["Vegetarian-friendly"],
    requiresPetFriendly: false,
    requiresChildFriendly: false,
  },
  {
    id: "theo",
    name: "Theo",
    avatarInitials: "TH",
    startingLocation: "Astoria, Queens",
    availability: [
      { day: "Saturday", start: "10:00", end: "18:00" },
      { day: "Sunday", start: "12:00", end: "19:00" },
    ],
    maximumBudget: 85,
    canDrive: false,
    availableSeats: 0,
    dietaryPreferences: ["No shellfish"],
    requiresPetFriendly: false,
    requiresChildFriendly: false,
  },
  {
    id: "jordan",
    name: "Jordan",
    avatarInitials: "JO",
    startingLocation: "Williamsburg, Brooklyn",
    availability: [
      { day: "Saturday", start: "09:30", end: "19:00" },
      { day: "Sunday", start: "09:00", end: "15:00" },
    ],
    maximumBudget: 100,
    canDrive: true,
    availableSeats: 3,
    dietaryPreferences: [],
    requiresPetFriendly: false,
    requiresChildFriendly: false,
  },
  {
    id: "priya",
    name: "Priya",
    avatarInitials: "PR",
    startingLocation: "Lower East Side, Manhattan",
    availability: [
      { day: "Saturday", start: "10:00", end: "18:30" },
      { day: "Sunday", start: "11:00", end: "16:00" },
    ],
    maximumBudget: 90,
    canDrive: false,
    availableSeats: 0,
    dietaryPreferences: ["Halal-friendly"],
    requiresPetFriendly: false,
    requiresChildFriendly: false,
  },
]);

export const memberAccentClasses: Record<string, string> = {
  maya: "bg-[#0f766e] text-white",
  theo: "bg-[#f97362] text-white",
  jordan: "bg-[#f0b44d] text-[#17233c]",
  priya: "bg-[#6c63a8] text-white",
};

