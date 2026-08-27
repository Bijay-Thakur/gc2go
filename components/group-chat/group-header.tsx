import { Compass, Users } from "lucide-react";

import { memberAccentClasses } from "@/data/members";
import type { GroupMember } from "@/types";

interface GroupHeaderProps {
  members: GroupMember[];
  onProfilesClick: () => void;
}

export function GroupHeader({ members, onProfilesClick }: GroupHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#1F2937] bg-[#0F172A] px-4 py-3 md:px-6 md:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#2DD4BF]/12 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/20">
          <Compass className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-extrabold tracking-[-0.02em] text-[#F8FAFC] md:text-lg">
              Weekend Crew
            </h1>
            <span className="size-2 rounded-full bg-[#34D399]" title="Group active" />
          </div>
          <p className="truncate text-xs font-medium text-[#94A3B8]">4 members · planning the weekend</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden -space-x-2 sm:flex" aria-label="Weekend Crew members">
          {members.map((member) => (
            <span
              key={member.id}
              className={`grid size-8 place-items-center rounded-full border-2 border-[#0F172A] text-[10px] font-black shadow-sm ${memberAccentClasses[member.id]}`}
              title={member.name}
            >
              {member.avatarInitials}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onProfilesClick}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#334155] bg-[#111827] px-3 text-sm font-bold text-[#F8FAFC] transition hover:border-[#2DD4BF]/40 hover:bg-[#1F2937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
        >
          <Users className="size-4 text-[#2DD4BF]" aria-hidden="true" />
          <span className="hidden sm:inline">Profiles & availability</span>
          <span className="sm:hidden">Profiles</span>
        </button>
      </div>
    </header>
  );
}
