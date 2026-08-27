import {
  dayOfWeekSchema,
  feasibilityResultSchema,
} from "@/lib/schemas";
import type {
  AvailabilitySlot,
  GroundedPlace,
  GroupMember,
  TripPlan,
  VideoAnalysis,
} from "@/types";

const DAYS = dayOfWeekSchema.options;

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function findCommonAvailability(members: GroupMember[]): AvailabilitySlot | null {
  for (const day of DAYS) {
    const dailySlots = members.map((member) => member.availability.filter((slot) => slot.day === day));
    if (dailySlots.some((slots) => slots.length === 0)) continue;

    for (const candidate of dailySlots[0]) {
      let start = toMinutes(candidate.start);
      let end = toMinutes(candidate.end);

      for (const slots of dailySlots.slice(1)) {
        const overlap = slots
          .map((slot) => ({ start: Math.max(start, toMinutes(slot.start)), end: Math.min(end, toMinutes(slot.end)) }))
          .find((slot) => slot.start < slot.end);
        if (!overlap) {
          end = start;
          break;
        }
        start = overlap.start;
        end = overlap.end;
      }

      if (start < end) return { day, start: fromMinutes(start), end: fromMinutes(end) };
    }
  }

  return null;
}

export function calculateGroupFeasibility(
  members: GroupMember[],
  analysis: VideoAnalysis,
  place: GroundedPlace,
) {
  const commonAvailability = findCommonAvailability(members);
  const requiredSeats = members.length;
  const driverMember = analysis.likelyRequiresCar
    ? members.find((member) => member.canDrive && member.availableSeats >= requiredSeats) ?? null
    : null;
  const tripFitsWindow = Boolean(
    commonAvailability
    && toMinutes(commonAvailability.end) - toMinutes(commonAvailability.start) >= analysis.suggestedDurationHours * 60,
  );
  const blockers: string[] = [];

  if (!commonAvailability) blockers.push("No common availability window was found.");
  else if (!tripFitsWindow) blockers.push("The suggested visit does not fit the common availability window.");
  if (analysis.likelyRequiresCar && !driverMember) blockers.push("No available driver has enough seats for the group.");
  if (members.some((member) => member.requiresChildFriendly) && place.childFriendly === false) {
    blockers.push("The destination conflicts with the group’s child-friendly requirement.");
  }
  if (members.some((member) => member.requiresPetFriendly) && place.petFriendly === false) {
    blockers.push("The destination conflicts with the group’s pet-friendly requirement.");
  }

  return feasibilityResultSchema.parse({
    commonAvailability,
    tripFitsWindow,
    driver: driverMember ? { name: driverMember.name, availableSeats: driverMember.availableSeats } : null,
    requiredSeats,
    minimumBudget: Math.min(...members.map((member) => member.maximumBudget)),
    blockers,
  });
}

export function auditPlanBudget(plan: TripPlan, minimumBudget: number): TripPlan {
  if (plan.estimatedPerPersonMaximum <= minimumBudget) return plan;
  const budgetBlocker = `Estimated maximum cost exceeds the group’s $${minimumBudget} per-person budget.`;
  return {
    ...plan,
    feasibilityStatus: "not-feasible",
    blockers: [...new Set([...plan.blockers, budgetBlocker])],
  };
}
