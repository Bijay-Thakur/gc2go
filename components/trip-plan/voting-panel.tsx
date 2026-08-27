import { Check, HelpCircle, PartyPopper, X } from "lucide-react";

import { memberAccentClasses } from "@/data/members";
import type { GroupMember, VoteChoice, VotesByMember } from "@/types";

interface VotingPanelProps {
  members: GroupMember[];
  votes: VotesByMember;
  onVote: (memberId: string, vote: VoteChoice) => void;
}

const voteOptions: Array<{
  value: VoteChoice;
  label: string;
  icon: typeof Check;
  selectedClass: string;
}> = [
  { value: "yes", label: "Yes", icon: Check, selectedClass: "border-[#0f766e] bg-[#dff3ed] text-[#0a655e]" },
  { value: "maybe", label: "Maybe", icon: HelpCircle, selectedClass: "border-[#e3a936] bg-[#fff4d8] text-[#815f17]" },
  { value: "no", label: "No", icon: X, selectedClass: "border-[#ef7869] bg-[#fff0ed] text-[#ae4438]" },
];

export function VotingPanel({ members, votes, onVote }: VotingPanelProps) {
  const yesCount = Object.values(votes).filter((vote) => vote === "yes").length;
  const escaped = yesCount >= 3;

  return (
    <section className="mt-4 overflow-hidden rounded-[22px] border border-[#17233c]/8 bg-white shadow-[0_12px_38px_rgba(24,35,60,0.07)]">
      <div className="flex items-end justify-between gap-4 border-b border-[#17233c]/7 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0f766e]">Crew decision</p>
          <h3 className="mt-0.5 text-lg font-black tracking-[-0.02em] text-[#17233c]">Are we doing this?</h3>
        </div>
        <p className="shrink-0 text-xs font-bold text-[#777e8b]">
          <span className="text-[#0f766e]">{yesCount}/3</span> Yes votes
        </p>
      </div>

      <div className="divide-y divide-[#17233c]/7">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className={`grid size-8 place-items-center rounded-full text-[9px] font-black ${memberAccentClasses[member.id]}`}>
                {member.avatarInitials}
              </span>
              <span className="text-sm font-extrabold text-[#17233c]">{member.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5" aria-label={`${member.name}'s vote`}>
              {voteOptions.map((option) => {
                const Icon = option.icon;
                const selected = votes[member.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onVote(member.id, option.value)}
                    className={`inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border px-2.5 text-xs font-black transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0f766e] ${
                      selected
                        ? option.selectedClass
                        : "border-[#17233c]/9 bg-[#fafaf7] text-[#757c89] hover:border-[#17233c]/20 hover:bg-white"
                    }`}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {escaped ? (
        <div role="status" className="celebration relative overflow-hidden bg-[#0f766e] px-5 py-6 text-center text-white">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <PartyPopper className="relative mx-auto mb-2 size-7 text-[#ffd46e]" aria-hidden="true" />
          <p className="relative text-lg font-black tracking-[-0.02em]">This trip escaped the group chat!</p>
          <p className="relative mt-1 text-xs font-medium text-white/75">Three Yes votes. Screenshot it before anyone changes their mind.</p>
        </div>
      ) : (
        <div className="bg-[#f7f6f1] px-5 py-3 text-center text-xs font-semibold text-[#747b87]">
          Three Yes votes turn the idea into a real plan.
        </div>
      )}
    </section>
  );
}
