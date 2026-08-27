"use client";

import { useState } from "react";
import {
  BusFront,
  Car,
  Check,
  Clock3,
  ExternalLink,
  Info,
  MapPin,
  Route,
  Trees,
  Utensils,
  WalletCards,
} from "lucide-react";

import {
  untermyerExperience,
  untermyerPlan,
} from "@/data/mock-untermyer";

type TransportId = (typeof untermyerExperience.transportOptions)[number]["id"];
type ExperienceTab = "plan" | "spots" | "lunch";

export function UntermyerExperienceCard() {
  const [transportId, setTransportId] = useState<TransportId>("subway");
  const [activeTab, setActiveTab] = useState<ExperienceTab>("plan");
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>(["walled-garden", "vista"]);
  const [selectedLunchId, setSelectedLunchId] = useState<string | null>(null);
  const transport = untermyerExperience.transportOptions.find((option) => option.id === transportId)
    ?? untermyerExperience.transportOptions[1];
  const minimum = untermyerExperience.fixedCosts.foodMinimum + transport.transportMinimum;
  const maximum = untermyerExperience.fixedCosts.foodMaximum + transport.transportMaximum;
  const selectedLunch = untermyerExperience.lunchSpots.find((spot) => spot.id === selectedLunchId);

  function toggleSpot(id: string) {
    setSelectedSpotIds((current) => current.includes(id)
      ? current.filter((spotId) => spotId !== id)
      : [...current, id]);
  }

  return (
    <article className="assistant-entry w-full animate-[rise-in_420ms_ease-out] overflow-hidden rounded-[28px] border border-[#2DD4BF]/15 bg-[#0F172A] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <div className="relative h-64 overflow-hidden sm:h-80">
        <img
          src={untermyerExperience.images[0].url}
          alt={untermyerExperience.images[0].alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07101a] via-[#07101a]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2DD4BF] px-3 py-1.5 text-[11px] font-black text-[#07101a]">
              <Check className="size-3.5" /> Works for everyone
            </span>
            <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
              Free admission
            </span>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5EEAD4]">Your Saturday escape</p>
          <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Untermyer Gardens
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white/75">
            <MapPin className="size-4" /> 945 N Broadway, Yonkers, NY
          </p>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-7">
        <p className="text-sm leading-6 text-[#CBD5E1]">{untermyerExperience.summary}</p>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-black text-white">
              <Route className="size-4 text-[#2DD4BF]" /> How should we get there?
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#64748B]">Choose a route</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {untermyerExperience.transportOptions.map((option) => {
              const selected = option.id === transportId;
              const Icon = option.id === "car" ? Car : BusFront;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTransportId(option.id)}
                  aria-pressed={selected}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#2DD4BF] bg-[#2DD4BF]/10 ring-2 ring-[#2DD4BF]/10"
                      : "border-[#334155] bg-[#111827] hover:border-[#475569]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid size-10 place-items-center rounded-xl ${selected ? "bg-[#2DD4BF] text-[#07101a]" : "bg-[#1E293B] text-[#94A3B8]"}`}>
                      <Icon className="size-5" />
                    </span>
                    {selected ? <Check className="size-4 text-[#2DD4BF]" /> : null}
                  </div>
                  <p className="mt-3 text-sm font-black text-white">{option.label}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-lg font-black text-[#5EEAD4]">
                    <Clock3 className="size-4" /> {option.duration}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#94A3B8]">{option.detail}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827]">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-[#1F2937] px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-[#64748B]">
              <span>Starting from</span>
              <span className="w-20 text-center">Car</span>
              <span className="w-20 text-center">Subway</span>
              <span className="w-5" />
            </div>
            {untermyerExperience.memberRoutes.map((route) => (
              <div key={route.memberId} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-[#1F2937] px-4 py-3 last:border-0">
                <div className="min-w-0">
                  <p className="text-xs font-black text-white">{route.name}</p>
                  <p className="truncate text-[10px] text-[#64748B]">{route.from}</p>
                </div>
                <span className="w-20 text-center text-xs font-bold text-[#CBD5E1]">{route.car}</span>
                <span className="w-20 text-center text-xs font-bold text-[#CBD5E1]">{route.subway}</span>
                <a
                  href={route.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${route.name}'s route in Google Maps`}
                  className="text-[#64748B] hover:text-[#2DD4BF]"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5EEAD4]">Fastest shared meetup</p>
              <h4 className="mt-1 text-base font-black text-white">
                {untermyerExperience.meetup.time} · {untermyerExperience.meetup.name}
              </h4>
              <p className="mt-1 max-w-xl text-xs leading-5 text-[#94A3B8]">{untermyerExperience.meetup.detail}</p>
            </div>
            <a
              href={untermyerExperience.meetup.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 text-xs font-black text-[#07101A] hover:bg-[#5EEAD4]"
            >
              <MapPin className="size-4" /> Google Maps
            </a>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4">
            <Trees className="mb-3 size-5 text-[#2DD4BF]" />
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#64748B]">Garden admission</p>
            <p className="mt-1 text-xl font-black text-white">$0</p>
            <p className="text-xs text-[#94A3B8]">No reservation under 20 people</p>
          </div>
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4">
            <Utensils className="mb-3 size-5 text-[#FB7185]" />
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#64748B]">Food estimate</p>
            <p className="mt-1 text-xl font-black text-white">
              ${untermyerExperience.fixedCosts.foodMinimum}–${untermyerExperience.fixedCosts.foodMaximum}
            </p>
            <p className="text-xs text-[#94A3B8]">Per person</p>
          </div>
          <div className="rounded-2xl border border-[#2DD4BF]/25 bg-gradient-to-br from-[#134E4A]/60 to-[#111827] p-4">
            <WalletCards className="mb-3 size-5 text-[#5EEAD4]" />
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#99F6E4]">Total per person</p>
            <p className="mt-1 text-2xl font-black text-white">${minimum}–${maximum}</p>
            <p className="text-xs text-[#99F6E4]/70">Food + {transport.label.toLowerCase()}</p>
          </div>
        </section>

        <section>
          <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-[#1F2937] bg-[#080B12] p-1">
            {([
              ["plan", "Your plan"],
              ["spots", `Suggested spots (${selectedSpotIds.length})`],
              ["lunch", selectedLunch ? `Lunch: ${selectedLunch.name}` : "Pick lunch"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`min-h-10 rounded-xl px-2 text-xs font-black transition ${
                  activeTab === id ? "bg-[#2DD4BF] text-[#07101A]" : "text-[#94A3B8] hover:bg-[#111827] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "plan" ? (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-white">
                  <Clock3 className="size-4 text-[#FB7185]" /> The plan
                </h3>
                <ol className="relative space-y-5 before:absolute before:bottom-5 before:left-[15px] before:top-5 before:w-px before:bg-[#334155]">
                  {untermyerPlan.itinerary.map((item, index) => (
                    <li key={item.title} className="relative flex gap-3.5">
                      <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-[#FB7185] text-xs font-black text-white ring-4 ring-[#0F172A]">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wide text-[#5EEAD4]">{item.time}</p>
                        <h4 className="text-sm font-black text-white">{item.title}</h4>
                        <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-[#5EEAD4]">Crew picks</p>
                  <p className="mt-2 text-sm font-bold text-white">
                    {selectedSpotIds.length} garden spots selected
                  </p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {selectedLunch ? `Lunch fixed at ${selectedLunch.name}.` : "Lunch is still open—pick a spot together."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("spots")}
                  className="min-h-11 w-full rounded-xl border border-[#334155] px-4 text-xs font-black text-white hover:border-[#2DD4BF]"
                >
                  Check out suggested spots to see
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("lunch")}
                  className="min-h-11 w-full rounded-xl border border-[#334155] px-4 text-xs font-black text-white hover:border-[#FB7185]"
                >
                  Choose the crew&apos;s lunch
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "spots" ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-black text-white">Check out suggested spots to see</h3>
                <p className="mt-1 text-xs text-[#94A3B8]">Select each card to fix it into the group plan.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {untermyerExperience.suggestedSpots.map((spot) => {
                  const selected = selectedSpotIds.includes(spot.id);
                  return (
                    <article key={spot.id} className={`overflow-hidden rounded-2xl border transition ${selected ? "border-[#2DD4BF] bg-[#2DD4BF]/5" : "border-[#1F2937] bg-[#111827]"}`}>
                      <button type="button" onClick={() => toggleSpot(spot.id)} className="block w-full text-left">
                        <div className="relative h-40">
                          <img src={spot.imageUrl} alt={spot.name} className="h-full w-full object-cover" />
                          <span className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full ${selected ? "bg-[#2DD4BF] text-[#07101A]" : "bg-black/60 text-white"}`}>
                            {selected ? <Check className="size-4" /> : <span className="text-lg">+</span>}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-black text-white">{spot.name}</h4>
                            <span className="text-[10px] font-bold text-[#5EEAD4]">{spot.duration}</span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{spot.description}</p>
                          <p className="mt-3 text-xs font-black text-[#2DD4BF]">
                            {selected ? "✓ Okay, we’re going here" : "Add to our plan"}
                          </p>
                        </div>
                      </button>
                      <a href={spot.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 border-t border-[#1F2937] px-4 py-2.5 text-[10px] font-bold text-[#94A3B8] hover:text-[#2DD4BF]">
                        View on Google Maps <ExternalLink className="size-3" />
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

          {activeTab === "lunch" ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-black text-white">Pick the crew&apos;s lunch stop</h3>
                <p className="mt-1 text-xs text-[#94A3B8]">Distances are from Untermyer Gardens. Ratings are snapshots—open Google Maps for the latest reviews.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {untermyerExperience.lunchSpots.map((spot) => {
                  const selected = selectedLunchId === spot.id;
                  return (
                    <article key={spot.id} className={`overflow-hidden rounded-2xl border transition ${selected ? "border-[#FB7185] bg-[#FB7185]/5" : "border-[#1F2937] bg-[#111827]"}`}>
                      <button type="button" onClick={() => setSelectedLunchId(spot.id)} className="block w-full text-left">
                        <img src={spot.imageUrl} alt={`${spot.cuisine} food`} className="h-36 w-full object-cover" />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-black text-white">{spot.name}</h4>
                              <p className="text-[10px] font-bold text-[#64748B]">{spot.cuisine} · {spot.distance}</p>
                            </div>
                            <span className="shrink-0 text-xs font-black text-[#FBBF24]">{spot.rating}</span>
                          </div>
                          <p className="mt-3 text-xs text-[#CBD5E1]">
                            Popular pick: <strong className="text-white">{spot.famousDish}</strong>
                          </p>
                          <p className="mt-3 text-xs font-black text-[#FB7185]">
                            {selected ? "✓ Lunch fixed here" : "Choose this spot"}
                          </p>
                        </div>
                      </button>
                      <a href={spot.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 border-t border-[#1F2937] px-4 py-2.5 text-[10px] font-bold text-[#94A3B8] hover:text-[#FB7185]">
                        Google reviews & directions <ExternalLink className="size-3" />
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>

        <section className="grid overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827] sm:grid-cols-[220px_1fr]">
          <img
            src={untermyerExperience.images[1].url}
            alt={untermyerExperience.images[1].alt}
            className="h-48 w-full object-cover sm:h-full"
          />
          <div className="p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5EEAD4]">Do not miss</p>
            <h3 className="mt-1 text-xl font-black text-white">The Temple of Love</h3>
            <p className="mt-2 text-xs leading-5 text-[#94A3B8]">
              View the rocky folly from below, then follow its bridges and water features for the strongest Hudson River photo stop.
            </p>
            <a href="https://www.untermyergardens.org/temple-of-love.html" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#2DD4BF]">
              Official garden guide <ExternalLink className="size-3" />
            </a>
          </div>
        </section>

        <div className="rounded-2xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-4">
          <p className="flex items-start gap-2 text-xs leading-5 text-[#FDE68A]">
            <Info className="mt-0.5 size-4 shrink-0" />
            Bring water—there are no food or beverage sales in the garden. Pets are not allowed, and
            weekend parking may be limited. Route times and costs are estimates; check live traffic and
            transit before leaving.
          </p>
        </div>

        <a
          href={untermyerExperience.imageCredit.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#64748B] hover:text-[#94A3B8]"
        >
          {untermyerExperience.imageCredit.label} <ExternalLink className="size-3" />
        </a>
      </div>
    </article>
  );
}
