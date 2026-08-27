import { Bookmark, CheckCircle2, Compass, MessageCircleMore, Plus, Route } from "lucide-react";

import type { PreviousPlan } from "@/types";

interface GroupSidebarProps {
  activePlanId: string | null;
  plans: PreviousPlan[];
  onNewPlan: () => void;
  onPlanSelect: (plan: PreviousPlan) => void;
}

export function GroupSidebar({ activePlanId, plans, onNewPlan, onPlanSelect }: GroupSidebarProps) {
  const planSections = [
    { title: "Confirmed", plans: plans.filter((plan) => plan.status === "confirmed" && plan.id !== "longwood-gardens" && plan.id !== "central-park-day") },
    { title: "Saved", plans: plans.filter((plan) => plan.status === "saved") },
    { title: "Previous", plans: plans.filter((plan) => plan.id === "longwood-gardens" || plan.id === "central-park-day") },
  ];

  function renderPlan(plan: PreviousPlan, sectionTitle: string) {
    const previous = sectionTitle === "Previous";
    const confirmed = plan.status === "confirmed" && !previous;

    return (
      <button
        key={plan.id}
        type="button"
        aria-pressed={activePlanId === plan.id}
        onClick={() => onPlanSelect(plan)}
        className={`w-full rounded-xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF] ${
          activePlanId === plan.id
            ? "border-[#2DD4BF]/35 bg-[#2DD4BF]/8"
            : "border-transparent bg-[#111827]/55 hover:border-[#1F2937] hover:bg-[#111827]"
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-sm font-extrabold leading-5 text-[#E2E8F0]">{plan.title}</p>
          {confirmed ? (
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#34D399]" aria-hidden="true" />
          ) : (
            <Bookmark className={`mt-0.5 size-3.5 shrink-0 ${previous ? "text-[#60A5FA]" : "text-[#FBBF24]"}`} aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748B]">
          <span className={previous ? "text-[#60A5FA]" : confirmed ? "text-[#34D399]" : "text-[#FBBF24]"}>
            {previous ? "Previous" : confirmed ? "Confirmed" : "Saved"}
          </span>
          <span aria-hidden="true">·</span>
          <span>{plan.dateLabel}</span>
        </div>
        <p className="mt-1 text-[10px] font-semibold text-[#94A3B8]">{plan.attendanceLabel}</p>
      </button>
    );
  }

  return (
    <aside className="hidden w-[270px] shrink-0 flex-col border-r border-[#1F2937] bg-[#0F172A] lg:flex">
      <div className="flex items-center gap-3 border-b border-[#1F2937] px-5 py-5">
        <span className="grid size-10 place-items-center rounded-xl bg-[#2DD4BF] text-[#080B12] shadow-[0_8px_24px_rgba(45,212,191,0.18)]">
          <Route className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-black tracking-[-0.04em] text-[#F8FAFC]">GC<span className="text-[#FB7185]">2</span>Go</p>
          <p className="-mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">Reel to real plan</p>
        </div>
      </div>

      <nav className="px-3 py-4" aria-label="Group navigation">
        <button
          type="button"
          onClick={onNewPlan}
          className="mb-1 flex min-h-11 w-full items-center gap-3 rounded-xl bg-[#2DD4BF]/10 px-3 text-sm font-extrabold text-[#5EEAD4] transition hover:bg-[#2DD4BF]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
        >
          <MessageCircleMore className="size-4" aria-hidden="true" />
          Weekend Crew
        </button>
        <button
          type="button"
          onClick={onNewPlan}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#94A3B8] transition hover:bg-[#111827] hover:text-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Start a new plan
        </button>
      </nav>

      <div className="px-5 pb-2 pt-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.16em] text-[#64748B]">Plans</h2>
          <Compass className="size-3.5 text-[#475569]" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-4 px-3">
        {planSections.map((section) => (
          <section key={section.title} aria-labelledby={`${section.title}-heading`}>
            <h3 id={`${section.title}-heading`} className={`mb-2 px-2 text-[10px] font-black uppercase tracking-[0.14em] ${section.title === "Previous" ? "text-[#60A5FA]" : section.title === "Confirmed" ? "text-[#34D399]" : "text-[#FBBF24]"}`}>
              {section.title}
            </h3>
            <div className="space-y-2">{section.plans.map((plan) => renderPlan(plan, section.title))}</div>
          </section>
        ))}
      </div>

      <div className="mt-auto border-t border-[#1F2937] px-5 py-4">
        <p className="text-[10px] leading-4 text-[#64748B]">Get the trip out of the group chat.</p>
      </div>
    </aside>
  );
}
