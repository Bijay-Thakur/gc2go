import type { SocialProvider } from "@/types";

const TIKTOK_HOSTS = new Set(["tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"]);
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]);
const TIKTOK_VIDEO_PATH = /^\/@([A-Za-z0-9._-]+)\/video\/(\d+)\/?$/;
const INSTAGRAM_POST_PATH = /^\/(reel|p)\/([A-Za-z0-9_-]{3,})\/?$/;
const TIKTOK_ID = /^\d{6,30}$/;
const INSTAGRAM_SHORTCODE = /^[A-Za-z0-9_-]{3,64}$/;

export interface SocialUrlValidation {
  valid: boolean;
  provider: SocialProvider | null;
  error: string | null;
}

function parseHttpsUrl(value: string): URL | null {
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function detectSocialProvider(value: string): SocialProvider | null {
  const parsed = parseHttpsUrl(value);
  if (!parsed) return null;
  const hostname = parsed.hostname.toLowerCase();
  if (TIKTOK_HOSTS.has(hostname)) return "tiktok";
  if (INSTAGRAM_HOSTS.has(hostname)) return "instagram";
  return null;
}

export function inspectSocialUrl(value: string): SocialUrlValidation {
  if (!value.trim()) return { valid: false, provider: null, error: "Paste a public TikTok or Instagram link." };

  const parsed = parseHttpsUrl(value);
  if (!parsed) return { valid: false, provider: null, error: "Use a complete HTTPS link." };

  const provider = detectSocialProvider(value);
  if (!provider) return { valid: false, provider: null, error: "Only public TikTok and Instagram links are supported." };

  if (provider === "tiktok") {
    const isShortLink = parsed.hostname === "vm.tiktok.com" || parsed.hostname === "vt.tiktok.com";
    const validPath = isShortLink ? parsed.pathname.length > 1 : TIKTOK_VIDEO_PATH.test(parsed.pathname);
    return validPath
      ? { valid: true, provider, error: null }
      : { valid: false, provider, error: "Use a TikTok video link, not a profile or search page." };
  }

  return INSTAGRAM_POST_PATH.test(parsed.pathname)
    ? { valid: true, provider, error: null }
    : { valid: false, provider, error: "Use an Instagram Reel or public post link." };
}

export function validateSocialUrl(value: string): boolean {
  return inspectSocialUrl(value).valid;
}

export function normalizeSocialUrl(value: string): string {
  const validation = inspectSocialUrl(value);
  if (!validation.valid || !validation.provider) throw new Error(validation.error ?? "Invalid social URL.");

  const parsed = new URL(value.trim());
  parsed.hash = "";
  parsed.search = "";

  if (validation.provider === "tiktok") {
    if (parsed.hostname !== "vm.tiktok.com" && parsed.hostname !== "vt.tiktok.com") parsed.hostname = "www.tiktok.com";
  } else {
    parsed.hostname = "www.instagram.com";
  }

  parsed.pathname = `${parsed.pathname.replace(/\/+$/, "")}/`;
  return parsed.toString();
}

export function extractTikTokVideoId(value: string): string | null {
  const parsed = parseHttpsUrl(value);
  if (!parsed || detectSocialProvider(value) !== "tiktok") return null;
  return TIKTOK_VIDEO_PATH.exec(parsed.pathname)?.[2] ?? null;
}

export function extractInstagramShortcode(value: string): string | null {
  const parsed = parseHttpsUrl(value);
  if (!parsed || detectSocialProvider(value) !== "instagram") return null;
  return INSTAGRAM_POST_PATH.exec(parsed.pathname)?.[2] ?? null;
}

export function getInstagramPostKind(value: string): "reel" | "p" | null {
  const parsed = parseHttpsUrl(value);
  if (!parsed || detectSocialProvider(value) !== "instagram") return null;
  const kind = INSTAGRAM_POST_PATH.exec(parsed.pathname)?.[1];
  return kind === "reel" || kind === "p" ? kind : null;
}

export function buildSafeEmbedUrl(
  provider: SocialProvider,
  idOrShortcode: string,
  instagramKind: "reel" | "p" = "reel",
): string {
  if (provider === "tiktok") {
    if (!TIKTOK_ID.test(idOrShortcode)) throw new Error("Invalid TikTok post ID.");
    return `https://www.tiktok.com/player/v1/${idOrShortcode}?controls=1&description=1&autoplay=0`;
  }

  if (!INSTAGRAM_SHORTCODE.test(idOrShortcode)) throw new Error("Invalid Instagram shortcode.");
  return `https://www.instagram.com/${instagramKind}/${idOrShortcode}/embed/`;
}

export function isAllowedTikTokHostname(hostname: string): boolean {
  return TIKTOK_HOSTS.has(hostname.toLowerCase());
}

export function isApprovedSocialMediaUrl(value: string): boolean {
  const parsed = parseHttpsUrl(value);
  if (!parsed) return false;
  const hostname = parsed.hostname.toLowerCase();
  return ["tiktokcdn.com", "tiktokcdn-us.com", "cdninstagram.com", "fbcdn.net"].some(
    (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`),
  );
}
