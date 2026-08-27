import { socialLinkInputSchema } from "@/lib/schemas";
import { analyzeSocialVideo } from "@/lib/social-video-analysis";
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

  const canonicalInput = { ...input.data, url: normalizeSocialUrl(input.data.url) };
  try {
    return Response.json(await analyzeSocialVideo(canonicalInput));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video analysis is temporarily unavailable.";
    return Response.json({ error: message }, { status: message.includes("not configured") ? 503 : 422 });
  }
}
