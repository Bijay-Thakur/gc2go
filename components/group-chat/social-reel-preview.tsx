"use client";

import { Camera, ExternalLink, LockKeyhole, Play, Sparkles } from "lucide-react";

import type { SocialPreview } from "@/types";

interface SocialReelPreviewProps {
  preview: SocialPreview;
  onAnalyze?: () => void;
}

export function SocialReelPreview({ preview, onAnalyze }: SocialReelPreviewProps) {
  const isTikTok = preview.provider === "tiktok";
  const isYouTube = preview.provider === "youtube";
  const providerName = isYouTube ? "YouTube Shorts" : isTikTok ? "TikTok" : "Instagram";
  const unavailable = preview.status !== "available" || !preview.embedUrl;

  return (
    <article className="assistant-entry w-full animate-[rise-in_320ms_ease-out]">
      <div className="mb-2 flex items-center gap-2 px-1 text-xs font-extrabold text-[#2DD4BF]">
        <span className="grid size-7 place-items-center rounded-lg bg-[#2DD4BF]/10">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        GC2Go public video preview
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#1F2937] bg-[#0F172A] shadow-[0_18px_52px_rgba(0,0,0,0.24)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#1F2937] px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${isTikTok ? "bg-[#F8FAFC] text-[#080B12]" : "bg-[#FB7185]/12 text-[#FB7185]"}`}>
              {isYouTube || isTikTok ? <Play className="size-4 fill-current" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black text-[#F8FAFC]">{preview.title || `${providerName} video`}</p>
              <p className="truncate text-xs text-[#94A3B8]">
                {preview.authorName ? `@${preview.authorName.replace(/^@/, "")}` : "Public post information"}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#334155] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#94A3B8]">
            {providerName}
          </span>
        </div>

        {unavailable ? (
          <div className="grid min-h-72 place-items-center px-6 py-10 text-center">
            <div>
              <span className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-[#1F2937] text-[#94A3B8]">
                <LockKeyhole className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-black text-[#F8FAFC]">Preview unavailable</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#94A3B8]">
                {preview.error || "The provider may require sign-in, or this reel may be private."}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[390px] bg-[#080B12] p-3 sm:p-4">
            <iframe
              src={preview.embedUrl ?? undefined}
              title={`${providerName} video preview`}
              className="aspect-[9/14] w-full rounded-xl border border-[#1F2937] bg-[#080B12]"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-[#1F2937] bg-[#111827] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#94A3B8]">
            Public video. Gemini will inspect visual frames, spoken clues, and on-screen text.
          </p>
          <div className="flex shrink-0 gap-2">
            <a
              href={preview.canonicalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#334155] px-3 text-xs font-extrabold text-[#E2E8F0] transition hover:border-[#64748B] hover:bg-[#1F2937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
            >
              Open video <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
            {onAnalyze ? (
              <button
                type="button"
                onClick={onAnalyze}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3 text-xs font-black text-[#080B12] transition hover:bg-[#5EEAD4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
              >
                Analyze video <Sparkles className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
