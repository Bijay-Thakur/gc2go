import { DEFAULT_DEMO_SOCIAL_URL, demoSocialAnalysis } from "@/data/demo-social";
import { analyzeSocialLink } from "@/lib/social-analysis";
import { socialLinkInputSchema } from "@/lib/schemas";
import { detectSocialProvider, inspectSocialUrl, normalizeSocialUrl } from "@/lib/social-links";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 4_096) return Response.json({ error: "Request is too large." }, { status: 413 });

  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > 4_096) return Response.json({ error: "Request is too large." }, { status: 413 });
    payload = JSON.parse(text);
  } catch {
    return Response.json({ error: "Send a JSON SocialLinkInput body." }, { status: 400 });
  }

  const input = socialLinkInputSchema.safeParse(payload);
  if (!input.success) return Response.json({ error: "A URL and supported provider are required." }, { status: 400 });

  const validation = inspectSocialUrl(input.data.url);
  const detectedProvider = detectSocialProvider(input.data.url);
  if (!validation.valid || detectedProvider !== input.data.provider) {
    return Response.json({ error: validation.error ?? "The URL does not match the selected provider." }, { status: 400 });
  }

  const canonicalInput = {
    ...input.data,
    url: normalizeSocialUrl(input.data.url),
  };
  let configuredDemoUrl = DEFAULT_DEMO_SOCIAL_URL;
  try {
    configuredDemoUrl = normalizeSocialUrl(process.env.DEMO_SOCIAL_URL || DEFAULT_DEMO_SOCIAL_URL);
  } catch {
    // Keep the code-owned fixture URL when an optional environment override is invalid.
  }
  const isDemoRequest = canonicalInput.url === configuredDemoUrl;

  try {
    if (process.env.DEMO_MODE === "true" && isDemoRequest) {
      return Response.json(demoSocialAnalysis);
    }

    const analysis = await analyzeSocialLink(canonicalInput);
    if (isDemoRequest && analysis.placeName === "Unknown destination") {
      return Response.json(demoSocialAnalysis);
    }
    return Response.json(analysis);
  } catch {
    if (isDemoRequest) return Response.json(demoSocialAnalysis);
    return Response.json({ error: "Public reel analysis is temporarily unavailable." }, { status: 503 });
  }
}
