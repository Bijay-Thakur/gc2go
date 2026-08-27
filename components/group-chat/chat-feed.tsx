import type { ReactNode } from "react";

import { memberAccentClasses } from "@/data/members";
import type { ChatMessage, GroupMember } from "@/types";

interface ChatFeedProps {
  members: GroupMember[];
  messages: ChatMessage[];
  currentMemberId: string;
  children?: ReactNode;
}

const memberBubbleClasses: Record<string, string> = {
  maya: "border-[#2DD4BF]/20 bg-[#134E4A]/45",
  theo: "border-[#FB7185]/15 bg-[#1E293B]",
  jordan: "border-[#FBBF24]/15 bg-[#1E293B]",
  priya: "border-[#A78BFA]/15 bg-[#1E293B]",
};

export function ChatFeed({ members, messages, currentMemberId, children }: ChatFeedProps) {
  const membersById = new Map(members.map((member) => [member.id, member]));

  return (
    <div className="chat-scroll flex-1 overflow-y-auto bg-[#080B12] px-4 py-6 md:px-7 md:py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="flex items-center gap-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
          <span className="h-px flex-1 bg-[#1F2937]" />
          This morning
          <span className="h-px flex-1 bg-[#1F2937]" />
        </div>

        {messages.map((message) => {
          const member = membersById.get(message.memberId);
          if (!member) return null;
          const isCurrentUser = member.id === currentMemberId;

          return (
            <article key={message.id} className={`flex max-w-[92%] items-end gap-2.5 sm:max-w-[78%] ${isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-[9px] font-black shadow-sm ${memberAccentClasses[member.id]}`}
                aria-hidden="true"
              >
                {member.avatarInitials}
              </span>
              <div>
                <div className={`mb-1 flex items-baseline gap-2 px-1 ${isCurrentUser ? "justify-end" : ""}`}>
                  <span className="text-xs font-extrabold text-[#E2E8F0]">{isCurrentUser ? "You" : member.name}</span>
                  <time className="text-[10px] text-[#64748B]">{message.time}</time>
                </div>
                <p className={`rounded-[20px] border px-4 py-3 text-sm leading-6 text-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${isCurrentUser ? "rounded-br-md" : "rounded-bl-md"} ${memberBubbleClasses[member.id] ?? "border-[#1F2937] bg-[#1E293B]"}`}>
                  {message.text}
                </p>
              </div>
            </article>
          );
        })}

        {children}
      </div>
    </div>
  );
}
