"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Car, MapPin, Pencil, Utensils, WalletCards, X } from "lucide-react";

import { dayOfWeekSchema } from "@/lib/schemas";
import { memberAccentClasses } from "@/data/members";
import type { AvailabilitySlot, GroupMember } from "@/types";

interface MemberProfilesProps {
  members: GroupMember[];
  open: boolean;
  onClose: () => void;
  onMembersChange: (members: GroupMember[]) => void;
}

const fieldClassName = "mt-1 w-full rounded-xl border border-[#17233c]/10 bg-[#fffdf8] px-3 py-2 text-sm text-[#17233c] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/15";
const days = dayOfWeekSchema.options;

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function MemberProfiles({ members, open, onClose, onMembersChange }: MemberProfilesProps) {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [draft, setDraft] = useState<GroupMember | null>(null);

  function startEditing(member: GroupMember) {
    setEditingMemberId(member.id);
    setDraft({ ...member, availability: member.availability.map((slot) => ({ ...slot })) });
  }

  function cancelEditing() {
    setEditingMemberId(null);
    setDraft(null);
  }

  function updateDraft(changes: Partial<GroupMember>) {
    setDraft((current) => current ? { ...current, ...changes } : current);
  }

  function updateAvailability(index: number, changes: Partial<AvailabilitySlot>) {
    setDraft((current) => current ? {
      ...current,
      availability: current.availability.map((slot, slotIndex) => slotIndex === index ? { ...slot, ...changes } : slot),
    } : current);
  }

  function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !draft.name.trim() || !draft.startingLocation.trim()) return;
    onMembersChange(members.map((member) => member.id === draft.id ? {
      ...draft,
      name: draft.name.trim(),
      startingLocation: draft.startingLocation.trim(),
      dietaryPreferences: draft.dietaryPreferences.map((preference) => preference.trim()).filter(Boolean),
      availableSeats: draft.canDrive ? draft.availableSeats : 0,
    } : member));
    cancelEditing();
  }
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
        <div className={`mb-6 flex items-start justify-between gap-4 ${draft ? "hidden" : ""}`}>
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

        <div className={`grid gap-4 md:grid-cols-2 ${draft ? "hidden" : ""}`}>
          {members.map((member) => (
            <article key={member.id} className="rounded-2xl border border-[#17233c]/8 bg-white p-4 shadow-[0_7px_22px_rgba(24,35,60,0.05)]">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
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
                <button type="button" onClick={() => startEditing(member)} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#0f766e]/20 px-3 py-2 text-xs font-black text-[#0f766e] transition hover:bg-[#dff3ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"><Pencil className="size-3.5" aria-hidden="true" /> Edit</button>
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

        {draft && editingMemberId ? (
          <div className="fixed inset-0 z-10 flex items-end justify-center bg-[#101a2d]/35 p-0 sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && cancelEditing()}>
            <form onSubmit={saveDraft} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-[#fffdf8] p-5 shadow-2xl sm:rounded-[28px] sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Member details</p><h3 className="mt-1 text-xl font-black text-[#17233c]">Edit {draft.name}</h3></div>
                <button type="button" onClick={cancelEditing} aria-label="Close editor" className="grid size-9 place-items-center rounded-full border border-[#17233c]/10 text-[#4f5868] hover:bg-[#f1f3ee]"><X className="size-4" aria-hidden="true" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-[#17233c]">Name<input className={fieldClassName} value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} required /></label>
                <label className="text-xs font-bold text-[#17233c]">Avatar initials<input className={fieldClassName} value={draft.avatarInitials} maxLength={3} onChange={(event) => updateDraft({ avatarInitials: event.target.value.toUpperCase() })} required /></label>
                <label className="text-xs font-bold text-[#17233c] sm:col-span-2">Starting location<input className={fieldClassName} value={draft.startingLocation} onChange={(event) => updateDraft({ startingLocation: event.target.value })} required /></label>
                <label className="text-xs font-bold text-[#17233c]">Maximum budget ($)<input className={fieldClassName} type="number" min="0" step="1" value={draft.maximumBudget} onChange={(event) => updateDraft({ maximumBudget: Number(event.target.value) })} /></label>
                <div className="flex items-end gap-4 sm:col-span-2">
                  <label className="flex items-center gap-2 pb-2 text-sm font-bold text-[#17233c]"><input type="checkbox" checked={draft.canDrive} onChange={(event) => updateDraft({ canDrive: event.target.checked })} className="size-4 accent-[#0f766e]" /> Can drive</label>
                  {draft.canDrive ? <label className="max-w-40 flex-1 text-xs font-bold text-[#17233c]">Vehicle seats<input className={fieldClassName} type="number" min="1" step="1" value={draft.availableSeats} onChange={(event) => updateDraft({ availableSeats: Number(event.target.value) })} required /></label> : null}
                </div>
                <label className="text-xs font-bold text-[#17233c]">Dietary preferences<input className={fieldClassName} value={draft.dietaryPreferences.join(", ")} placeholder="e.g. Vegetarian-friendly" onChange={(event) => updateDraft({ dietaryPreferences: event.target.value.split(",") })} /></label>
              </div>
              <fieldset className="mt-5 space-y-3"><legend className="text-xs font-black uppercase tracking-[0.12em] text-[#17233c]">Availability</legend>
                {draft.availability.map((slot, index) => <div key={`${slot.day}-${index}`} className="grid gap-2 sm:grid-cols-[1.2fr_1fr_1fr]">
                  <select className={fieldClassName.replace("mt-1", "")} value={slot.day} onChange={(event) => updateAvailability(index, { day: event.target.value as AvailabilitySlot["day"] })} aria-label={`Availability day ${index + 1}`}>{days.map((day) => <option key={day}>{day}</option>)}</select>
                  <label className="text-xs font-bold text-[#17233c]">Start<input className={fieldClassName.replace("mt-1", "mt-1")} type="time" value={slot.start} onChange={(event) => updateAvailability(index, { start: event.target.value })} aria-label={`Availability start ${index + 1}`} /></label>
                  <label className="text-xs font-bold text-[#17233c]">End<input className={fieldClassName.replace("mt-1", "mt-1")} type="time" value={slot.end} onChange={(event) => updateAvailability(index, { end: event.target.value })} aria-label={`Availability end ${index + 1}`} /></label>
                </div>)}
              </fieldset>
              <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={cancelEditing} className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#4f5868] hover:bg-[#f1f3ee]">Cancel</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-black text-white hover:bg-[#0a655e]">Save changes</button></div>
            </form>
          </div>
        ) : null}
      </section>
    </div>
  );
}
