import type { ReactNode } from "react";

import { memberAccentClasses } from "@/data/members";
import type { ChatMessage, GroupMember } from "@/types";

interface ChatFeedProps {
  members: GroupMember[];
  messages: ChatMessage[];
  children?: ReactNode;
}

export function ChatFeed({ members, messages, children }: ChatFeedProps) {
  const membersById = new Map(members.map((member) => [member.id, member]));

  return (
    <div className="chat-scroll flex-1 overflow-y-auto px-4 py-6 md:px-7 md:py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="flex items-center gap-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a8f9a]">
          <span className="h-px flex-1 bg-[#17233c]/8" />
          This morning
          <span className="h-px flex-1 bg-[#17233c]/8" />
        </div>

        {messages.map((message) => {
          const member = membersById.get(message.memberId);
          if (!member) return null;

          return (
            <article key={message.id} className="flex max-w-[92%] items-end gap-2.5 sm:max-w-[78%]">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-[9px] font-black shadow-sm ${memberAccentClasses[member.id]}`}
                aria-hidden="true"
              >
                {member.avatarInitials}
              </span>
              <div>
                <div className="mb-1 flex items-baseline gap-2 px-1">
                  <span className="text-xs font-extrabold text-[#17233c]">{member.name}</span>
                  <time className="text-[10px] text-[#969aa4]">{message.time}</time>
                </div>
                <p className="rounded-[20px] rounded-bl-md border border-[#17233c]/7 bg-white px-4 py-3 text-sm leading-6 text-[#313b4e] shadow-[0_5px_18px_rgba(24,35,60,0.05)]">
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
