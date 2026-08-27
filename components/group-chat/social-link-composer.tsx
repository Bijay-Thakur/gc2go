"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";

import { VideoUpload } from "@/components/group-chat/video-upload";

interface SocialLinkComposerProps {
  disabled?: boolean;
  loading?: boolean;
  onFileSelected: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}

export function SocialLinkComposer({
  disabled = false,
  loading = false,
  onFileSelected,
  onUrlSubmit,
}: SocialLinkComposerProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Paste a link to start the plan.");
      return;
    }

    setError(null);
    onUrlSubmit(trimmedUrl);
    setUrl("");
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-[#1F2937] bg-[#0F172A] p-3 md:p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-3xl items-center gap-1.5 rounded-2xl border border-[#334155] bg-[#111827] p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.24)] focus-within:border-[#2DD4BF]/70 focus-within:ring-3 focus-within:ring-[#2DD4BF]/10"
      >
        <VideoUpload variant="attachment" disabled={disabled || loading} onFileSelected={onFileSelected} />
        <label htmlFor="social-reel-url" className="sr-only">Social post URL</label>
        <input
          id="social-reel-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          value={url}
          disabled={disabled || loading}
          onChange={(event) => {
            setUrl(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste the Untermyer Gardens link"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "social-link-error" : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-[#F8FAFC] outline-none placeholder:text-[#64748B] disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || loading || !url.trim()}
          aria-label={loading ? "Checking if the trip works" : "Send link"}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2DD4BF] text-[#080B12] transition hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:bg-[#1F2937] disabled:text-[#64748B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
        >
          {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-4.5" aria-hidden="true" />}
        </button>
      </form>
      {error ? (
        <p id="social-link-error" role="alert" className="mx-auto mt-2 max-w-3xl px-2 text-xs font-semibold text-[#FDA4AF]">
          {error}
        </p>
      ) : (
        <p className="mx-auto mt-2 max-w-3xl px-2 text-[10px] font-medium text-[#64748B]">
          Demo mode: any pasted link simulates the Untermyer Gardens group-planning flow.
        </p>
      )}
    </div>
  );
}
