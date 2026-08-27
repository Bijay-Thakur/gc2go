import { z } from "zod";

import { getMockPlanningFixtureByPlaceName } from "@/data/mock-pipeline";
import { groundConfirmedDestination } from "@/lib/gemini/maps-grounding";
import { isMockPipelineEnabled, waitForMockAnalysisDelay } from "@/lib/social-analysis-fixtures";

export const runtime = "nodejs";

const requestSchema = z.object({
  placeName: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(120).nullable().optional(),
  region: z.string().trim().min(1).max(120).nullable().optional(),
  country: z.string().trim().min(1).max(120).nullable().optional(),
}).strict();

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send a confirmed destination as JSON." }, { status: 400 });
  }

  const input = requestSchema.safeParse(payload);
  if (!input.success) return Response.json({ error: "A confirmed destination is required." }, { status: 400 });

  if (isMockPipelineEnabled()) {
    const fixture = getMockPlanningFixtureByPlaceName(input.data.placeName);
    if (!fixture) {
      return Response.json({ error: "This destination is not included in the mock pipeline." }, { status: 404 });
    }
    await waitForMockAnalysisDelay(900);
    return Response.json(fixture.place);
  }

  try {
    return Response.json(await groundConfirmedDestination(input.data));
  } catch (error) {
    const message = error instanceof Error ? error.message.replace(/^PLACE_GROUNDING_FAILED:\s*/, "") : "Google Maps could not verify this destination.";
    return Response.json({ code: "PLACE_GROUNDING_FAILED", error: message }, { status: 422 });
  }
}
