"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Film, UploadCloud } from "lucide-react";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ACCEPTED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

interface VideoUploadProps {
  disabled?: boolean;
  compact?: boolean;
  onFileSelected: (file: File) => void;
}

export function VideoUpload({ disabled = false, compact = false, onFileSelected }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function validateAndSelect(file: File | undefined) {
    if (!file) return;

    if (!ACCEPTED_VIDEO_TYPES.has(file.type)) {
      setError("Choose an MP4, WebM, or QuickTime video.");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError("That video is over 25 MB. Try a shorter clip.");
      return;
    }

    setError(null);
    onFileSelected(file);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    validateAndSelect(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) validateAndSelect(event.dataTransfer.files?.[0]);
  }

  return (
    <div className={compact ? "w-full" : "border-t border-[#17233c]/8 bg-[#fffdf8] p-3 md:p-4"}>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={error ? "video-upload-error" : undefined}
      />
      <div
        onDragEnter={() => !disabled && setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`mx-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border p-2.5 transition ${
          isDragging
            ? "border-[#0f766e] bg-[#e9f6f2]"
            : "border-[#17233c]/10 bg-white shadow-[0_7px_24px_rgba(24,35,60,0.06)]"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-[#f1f3ee] text-[#0f766e] sm:grid">
          <Film className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 px-1">
          <p className="truncate text-sm font-bold text-[#17233c]">
            {disabled ? "GC2Go is working on that reel…" : compact ? "Try another travel reel" : "Drop a travel reel here"}
          </p>
          <p className="text-[11px] text-[#777e8b]">MP4, WebM, or MOV · up to 25 MB</p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(15,118,110,0.24)] transition hover:bg-[#0b665f] disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
        >
          <UploadCloud className="size-4" aria-hidden="true" />
          Upload
        </button>
      </div>
      {error ? (
        <p id="video-upload-error" role="alert" className="mx-auto mt-2 max-w-3xl px-2 text-xs font-semibold text-[#c54b3c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

