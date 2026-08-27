import {
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Lightbulb,
  MapPin,
  Navigation,
  Sparkles,
  Utensils,
  WalletCards,
} from "lucide-react";

import type { TripPlan } from "@/types";

interface TripPlanCardProps {
  destination: string;
  plan: TripPlan;
}

const statusContent = {
  ready: { label: "Ready to go", className: "border-[#0f766e]/20 bg-[#dff3ed] text-[#0a655e]" },
  "decision-needed": { label: "Decision needed", className: "border-[#e6ae42]/25 bg-[#fff4d8] text-[#815f17]" },
  "not-feasible": { label: "Not feasible", className: "border-[#ef7869]/25 bg-[#fff0ed] text-[#ae4438]" },
} as const;

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function TripPlanCard({ destination, plan }: TripPlanCardProps) {
  const status = statusContent[plan.feasibilityStatus];

  return (
    <article className="assistant-entry w-full animate-[rise-in_420ms_ease-out]">
      <div className="mb-2 flex items-center gap-2 px-1 text-xs font-extrabold text-[#0f766e]">
        <span className="grid size-7 place-items-center rounded-lg bg-[#dff3ed]">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        One plan that works for everyone
      </div>

      <div className="overflow-hidden rounded-[26px] border border-[#17233c]/8 bg-white shadow-[0_20px_65px_rgba(24,35,60,0.1)]">
        <div className="relative overflow-hidden bg-[#17233c] px-5 py-6 text-white sm:px-7 sm:py-7">
          <div className="plan-pattern absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.17em] text-[#79d7c6]">Your weekend plan</p>
                <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">{destination}</h2>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${status.className}`}>
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                {status.label}
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/8 p-3.5 ring-1 ring-white/10">
                <CalendarDays className="mb-2 size-4 text-[#79d7c6]" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">When</p>
                <p className="mt-0.5 text-sm font-black">{plan.proposedDay}</p>
                <p className="text-xs text-white/70">{formatTime(plan.startTime)}–{formatTime(plan.endTime)}</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-3.5 ring-1 ring-white/10">
                <Car className="mb-2 size-4 text-[#79d7c6]" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">Driver</p>
                <p className="mt-0.5 text-sm font-black">{plan.driver ?? "No driver"}</p>
                <p className="text-xs text-white/70">One car · 4 seats</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-3.5 ring-1 ring-white/10">
                <WalletCards className="mb-2 size-4 text-[#79d7c6]" aria-hidden="true" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">Per person</p>
                <p className="mt-0.5 text-sm font-black">${plan.estimatedPerPersonMinimum}–${plan.estimatedPerPersonMaximum}</p>
                <p className="text-xs text-white/70">Admission, food + gas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-6 rounded-2xl border border-[#0f766e]/12 bg-[#f1f8f5] p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-black text-[#17233c]">
                <Navigation className="size-4 text-[#0f766e]" aria-hidden="true" /> Getting there
              </p>
              <p className="text-sm leading-6 text-[#606a78]">{plan.transportationRecommendation}</p>
            </div>

            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#17233c]">
              <Clock3 className="size-4 text-[#f97362]" aria-hidden="true" /> Three-stop itinerary
            </h3>
            <ol className="relative space-y-0 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-[#17233c]/10">
              {plan.itinerary.map((item, index) => (
                <li key={`${item.time}-${item.title}`} className="relative flex gap-3.5 pb-5 last:pb-0">
                  <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-4 border-white bg-[#f97362] text-xs font-black text-white shadow-sm">
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-black uppercase tracking-wide text-[#0f766e]">{item.time}</p>
                    <h4 className="text-sm font-black text-[#17233c]">{item.title}</h4>
                    <p className="mt-0.5 text-sm leading-5 text-[#69717f]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-[#17233c]">
                <MapPin className="size-4 text-[#f97362]" aria-hidden="true" /> Nearby if there’s time
              </h3>
              <div className="space-y-2.5">
                {plan.nearbyPlaces.map((place) => (
                  <div key={place.name} className="rounded-xl border border-[#17233c]/8 bg-[#fafaf7] p-3">
                    <div className="mb-0.5 flex items-center gap-2">
                      {place.type === "food" ? (
                        <Utensils className="size-3.5 text-[#0f766e]" aria-hidden="true" />
                      ) : (
                        <MapPin className="size-3.5 text-[#0f766e]" aria-hidden="true" />
                      )}
                      <h4 className="text-xs font-black text-[#17233c]">{place.name}</h4>
                    </div>
                    <p className="text-xs leading-5 text-[#707784]">{place.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-[#17233c]">
                <Lightbulb className="size-4 text-[#e3a936]" aria-hidden="true" /> Review-backed tips
              </h3>
              <ul className="space-y-3">
                {plan.reviewTips.map((tip) => (
                  <li key={tip.tip} className="text-xs leading-5 text-[#69717f]">
                    <p>{tip.tip}</p>
                    <a
                      href={tip.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-extrabold text-[#0f766e] underline decoration-[#0f766e]/25 underline-offset-2 hover:decoration-[#0f766e]"
                    >
                      {tip.sourceLabel} <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className={`border-t px-5 py-3.5 text-xs font-bold sm:px-7 ${plan.blockers.length ? "border-[#ef7869]/20 bg-[#fff0ed] text-[#ae4438]" : "border-[#0f766e]/10 bg-[#f1f8f5] text-[#0a655e]"}`}>
          {plan.blockers.length ? (
            <span>Before you go: {plan.blockers.join(" · ")}</span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" /> No availability, seat, or budget blockers found.
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
