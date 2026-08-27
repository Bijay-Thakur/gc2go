import type { ChatMessage } from "@/types";

export const initialMessages: ChatMessage[] = [
  {
    id: "message-1",
    memberId: "maya",
    text: "We should actually go somewhere this weekend.",
    time: "9:41 AM",
  },
  {
    id: "message-2",
    memberId: "theo",
    text: "I saw this place on TikTok.",
    time: "9:43 AM",
  },
  {
    id: "message-3",
    memberId: "priya",
    text: "Drop the reel 👀 let’s see if our schedules survive.",
    time: "9:44 AM",
  },
];

export const analysisSteps = [
  "Watching the reel…",
  "Identifying the destination…",
  "Checking everyone’s availability…",
  "Building the plan…",
] as const;

