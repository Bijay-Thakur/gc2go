import { members } from "@/data/members";
import { getMockPlanningFixtureBySourceUrl } from "@/data/mock-pipeline";
import { calculateGroupFeasibility } from "@/lib/feasibility";
import { generateGroundedTripPlan } from "@/lib/gemini/generate-trip-plan";
import { groundedPlaceSchema, videoAnalysisSchema } from "@/lib/schemas";
import { isMockPipelineEnabled, waitForMockAnalysisDelay } from "@/lib/social-analysis-fixtures";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send analysis and grounded place data as JSON." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") return Response.json({ error: "Planning input is required." }, { status: 400 });
  const record = payload as Record<string, unknown>;
  const analysis = videoAnalysisSchema.safeParse(record.analysis);
  const place = groundedPlaceSchema.safeParse(record.place);
  if (!analysis.success || !analysis.data.placeName || !place.success) {
    return Response.json({ error: "Confirmed analysis and grounded Maps data are required." }, { status: 400 });
  }

  try {
    const feasibility = calculateGroupFeasibility(members, analysis.data, place.data);
    if (isMockPipelineEnabled()) {
      const fixture = getMockPlanningFixtureBySourceUrl(analysis.data.sourceUrl);
      if (!fixture) {
        return Response.json({ error: "This video is not included in the mock pipeline." }, { status: 404 });
      }
      await waitForMockAnalysisDelay(1_200);
      const mockFeasibility = {
        ...feasibility,
        blockers: [...new Set([...feasibility.blockers, ...fixture.plan.blockers])],
      };
      return Response.json({ feasibility: mockFeasibility, plan: fixture.plan });
    }

    const plan = await generateGroundedTripPlan(analysis.data, place.data, members, feasibility);
    return Response.json({ feasibility, plan });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Trip planning failed." }, { status: 422 });
  }
}
