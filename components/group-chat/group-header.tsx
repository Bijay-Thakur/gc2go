import { Compass, Users } from "lucide-react";

import { memberAccentClasses } from "@/data/members";
import type { GroupMember } from "@/types";

interface GroupHeaderProps {
  members: GroupMember[];
  onProfilesClick: () => void;
}

export function GroupHeader({ members, onProfilesClick }: GroupHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#17233c]/8 bg-[#fffdf8]/94 px-4 py-3 backdrop-blur md:px-6 md:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-[0_7px_20px_rgba(15,118,110,0.2)]">
          <Compass className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-extrabold tracking-[-0.02em] text-[#17233c] md:text-lg">
              Weekend Crew
            </h1>
            <span className="size-2 rounded-full bg-[#20a888]" title="Group active" />
          </div>
          <p className="truncate text-xs font-medium text-[#5e6778]">4 friends · planning the weekend</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden -space-x-2 sm:flex" aria-label="Weekend Crew members">
          {members.map((member) => (
            <span
              key={member.id}
              className={`grid size-8 place-items-center rounded-full border-2 border-[#fffdf8] text-[10px] font-black shadow-sm ${memberAccentClasses[member.id]}`}
              title={member.name}
            >
              {member.avatarInitials}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onProfilesClick}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#17233c]/10 bg-white px-3 text-sm font-bold text-[#17233c] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f766e]/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
        >
          <Users className="size-4 text-[#0f766e]" aria-hidden="true" />
          <span className="hidden sm:inline">View profiles</span>
          <span className="sm:hidden">Crew</span>
        </button>
      </div>
    </header>
  );
}

