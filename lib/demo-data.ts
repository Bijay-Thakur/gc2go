import type { ChatMessage } from "@/types";

export const initialMessages: ChatMessage[] = [
  {
    id: "message-1",
    memberId: "maya",
    text: "I want something green and quiet this weekend—without leaving the city too far.",
    time: "9:41 AM",
  },
  {
    id: "message-2",
    memberId: "theo",
    text: "What about Untermyer Gardens in Yonkers? I keep seeing that Persian garden everywhere.",
    time: "9:43 AM",
  },
  {
    id: "message-3",
    memberId: "priya",
    text: "Drop the link 👀 If there’s a transit option and good food nearby, I’m in.",
    time: "9:44 AM",
  },
];

export const analysisSteps = [
  "Checking the shared place…",
  "Confirming the destination…",
  "Checking everyone’s availability…",
  "Researching Google Maps…",
  "Building the plan…",
] as const;
