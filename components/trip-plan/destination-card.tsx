import { ArrowRight, MapPinned, ScanSearch, Sparkles, UploadCloud } from "lucide-react";

import type { VideoAnalysis } from "@/types";

interface DestinationCardProps {
  analysis: VideoAnalysis;
  confirmedPlace: string;
  disabled?: boolean;
  sourceLabel?: string;
  onPlaceChange: (value: string) => void;
  onConfirm: () => void;
  onUploadInstead?: () => void;
}

export function DestinationCard({
  analysis,
  confirmedPlace,
  disabled = false,
  sourceLabel,
  onPlaceChange,
  onConfirm,
  onUploadInstead,
}: DestinationCardProps) {
  const isLowConfidence = analysis.confidence < 0.8;
  const isSocialSource = Boolean(analysis.provider);
  const confidencePercent = Math.round(analysis.confidence * 100);

  return (
    <article className="assistant-entry w-full animate-[rise-in_420ms_ease-out]">
      <div className="mb-2 flex items-center gap-2 px-1 text-xs font-extrabold text-[#0f766e]">
        <span className="grid size-7 place-items-center rounded-lg bg-[#dff3ed]">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        <span>GC2Go found a match</span>
        {sourceLabel ? <span className="font-semibold text-[#94A3B8]">· {sourceLabel}</span> : null}
      </div>
      <div className="overflow-hidden rounded-[24px] border border-[#0f766e]/15 bg-white shadow-[0_18px_55px_rgba(24,35,60,0.09)]">
        <div className="relative overflow-hidden bg-[#dff3ed] px-5 py-6 sm:px-6">
          <div className="destination-pattern absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
                <MapPinned className="size-4" aria-hidden="true" /> Detected destination
              </p>
              <h2 className="text-2xl font-black tracking-[-0.035em] text-[#17233c] sm:text-3xl">
                {analysis.placeName}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#526070]">
                {analysis.city}, {analysis.region} · {analysis.activityType}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/70 bg-white/75 px-3 py-2 text-center shadow-sm backdrop-blur">
              <strong className="block text-lg font-black text-[#17233c]">{confidencePercent}%</strong>
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#6f7681]">confidence</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-black text-[#17233c]">
              <ScanSearch className="size-4 text-[#f97362]" aria-hidden="true" /> What the reel showed
            </p>
            <ul className="space-y-1.5 text-sm leading-6 text-[#626a78]">
              {analysis.evidence.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#f97362]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {isLowConfidence ? (
            <div className="mb-5 rounded-2xl border border-[#efb749]/30 bg-[#fff7e6] p-4">
              <label htmlFor="confirmed-place" className="block text-sm font-black text-[#17233c]">
                {isSocialSource ? "Confirm destination" : "Quick destination check"}
              </label>
              <p className="mb-3 mt-0.5 text-xs leading-5 text-[#737986]">
                {isSocialSource
                  ? "I could not confidently identify the destination from this reel’s public information."
                  : "Confidence is below 80%. Correct the place name before we plan."}
              </p>
              {isSocialSource && analysis.placeName !== "Unknown destination" ? (
                <p className="mb-2 text-xs font-bold text-[#FBBF24]">Suggested destination: {analysis.placeName}</p>
              ) : null}
              <input
                id="confirmed-place"
                value={confirmedPlace}
                disabled={disabled}
                onChange={(event) => onPlaceChange(event.target.value)}
                placeholder="Enter the destination name"
                className="h-11 w-full rounded-xl border border-[#17233c]/12 bg-white px-3.5 text-sm font-bold text-[#17233c] outline-none transition placeholder:text-[#9ca1a9] focus:border-[#0f766e] focus:ring-3 focus:ring-[#0f766e]/10 disabled:opacity-60"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={disabled || !confirmedPlace.trim()}
              onClick={onConfirm}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f97362] px-5 text-sm font-black text-white shadow-[0_8px_22px_rgba(249,115,98,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e96555] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97362] sm:w-auto"
            >
              {isSocialSource && isLowConfidence ? "Confirm destination" : "Make it happen"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            {isSocialSource && isLowConfidence && onUploadInstead ? (
              <button
                type="button"
                disabled={disabled}
                onClick={onUploadInstead}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#334155] bg-[#111827] px-4 text-sm font-extrabold text-[#E2E8F0] transition hover:border-[#2DD4BF]/40 hover:bg-[#1F2937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
              >
                <UploadCloud className="size-4" aria-hidden="true" /> Upload screen recording instead
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
