"use client";

import { useEffect } from "react";
import { CalendarDays, Car, MapPin, Utensils, WalletCards, X } from "lucide-react";

import { memberAccentClasses } from "@/data/members";
import type { GroupMember } from "@/types";

interface MemberProfilesProps {
  members: GroupMember[];
  open: boolean;
  onClose: () => void;
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function MemberProfiles({ members, open, onClose }: MemberProfilesProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#101a2d]/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profiles-title"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-[#fffdf8] p-5 shadow-2xl sm:rounded-[28px] sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">The decision makers</p>
            <h2 id="profiles-title" className="text-2xl font-black tracking-[-0.03em] text-[#17233c]">
              Weekend Crew profiles
            </h2>
            <p className="mt-1 text-sm text-[#6d7481]">The constraints GC2Go will use to build one plan.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profiles"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-[#17233c]/10 bg-white text-[#4f5868] transition hover:bg-[#f1f3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <article key={member.id} className="rounded-2xl border border-[#17233c]/8 bg-white p-4 shadow-[0_7px_22px_rgba(24,35,60,0.05)]">
              <div className="mb-4 flex items-center gap-3">
                <span className={`grid size-11 place-items-center rounded-2xl text-xs font-black ${memberAccentClasses[member.id]}`}>
                  {member.avatarInitials}
                </span>
                <div>
                  <h3 className="font-black text-[#17233c]">{member.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-[#747b88]">
                    <MapPin className="size-3" aria-hidden="true" /> {member.startingLocation}
                  </p>
                </div>
              </div>

              <dl className="grid gap-3 text-sm">
                <div className="flex gap-2.5">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                  <div>
                    <dt className="font-bold text-[#17233c]">Available</dt>
                    <dd className="text-xs leading-5 text-[#6d7481]">
                      {member.availability.map((slot) => `${slot.day} ${formatTime(slot.start)}–${formatTime(slot.end)}`).join(" · ")}
                    </dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2.5">
                    <WalletCards className="mt-0.5 size-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#17233c]">Budget</dt>
                      <dd className="text-xs text-[#6d7481]">Up to ${member.maximumBudget}</dd>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Car className="mt-0.5 size-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#17233c]">Car</dt>
                      <dd className="text-xs text-[#6d7481]">
                        {member.canDrive ? `${member.availableSeats} seats` : "Not driving"}
                      </dd>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <Utensils className="mt-0.5 size-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                  <div>
                    <dt className="font-bold text-[#17233c]">Preferences</dt>
                    <dd className="text-xs text-[#6d7481]">
                      {member.dietaryPreferences.length ? member.dietaryPreferences.join(", ") : "No dietary notes"}
                    </dd>
                  </div>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
