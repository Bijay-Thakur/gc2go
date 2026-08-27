"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Film, LoaderCircle, Route, Sparkles } from "lucide-react";

import { ChatFeed } from "@/components/group-chat/chat-feed";
import { GroupHeader } from "@/components/group-chat/group-header";
import { VideoUpload } from "@/components/group-chat/video-upload";
import { MemberProfiles } from "@/components/profiles/member-profiles";
import { DestinationCard } from "@/components/trip-plan/destination-card";
import { TripPlanCard } from "@/components/trip-plan/trip-plan-card";
import { VotingPanel } from "@/components/trip-plan/voting-panel";
import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import { members } from "@/data/members";
import { analysisSteps, initialMessages } from "@/lib/demo-data";
import { videoAnalysisSchema } from "@/lib/schemas";
import type { VoteChoice, VotesByMember } from "@/types";

type FlowStage = "idle" | "analyzing" | "destination" | "planning" | "planned";

const VOTES_STORAGE_KEY = "gc2go-weekend-crew-votes";

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AnalysisProgress({ activeStep }: { activeStep: number }) {
  return (
    <div className="assistant-entry w-full animate-[rise-in_300ms_ease-out]" role="status" aria-live="polite">
      <div className="mb-2 flex items-center gap-2 px-1 text-xs font-extrabold text-[#0f766e]">
        <span className="grid size-7 place-items-center rounded-lg bg-[#dff3ed]">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        GC2Go
      </div>
      <div className="rounded-[22px] rounded-tl-md border border-[#0f766e]/12 bg-white p-4 shadow-[0_12px_35px_rgba(24,35,60,0.07)] sm:p-5">
        <div className="space-y-3">
          {analysisSteps.slice(0, activeStep + 1).map((label, index) => {
            const isActive = index === activeStep;
            return (
              <div key={label} className="flex items-center gap-3">
                <span className={`grid size-7 shrink-0 place-items-center rounded-full ${isActive ? "bg-[#dff3ed] text-[#0f766e]" : "bg-[#edf3f0] text-[#0f766e]"}`}>
                  {isActive ? (
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Check className="size-4" aria-hidden="true" />
                  )}
                </span>
                <span className={`text-sm ${isActive ? "font-black text-[#17233c]" : "font-semibold text-[#7a818d]"}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [flowStage, setFlowStage] = useState<FlowStage>("idle");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [confirmedPlace, setConfirmedPlace] = useState(demoVideoAnalysis.placeName);
  const [analysis, setAnalysis] = useState(demoVideoAnalysis);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; previewUrl: string } | null>(null);
  const [votes, setVotes] = useState<VotesByMember>({});
  const [votesHydrated, setVotesHydrated] = useState(false);
  const [profilesOpen, setProfilesOpen] = useState(false);
  const runIdRef = useRef(0);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedVotes = window.localStorage.getItem(VOTES_STORAGE_KEY);
      if (savedVotes) {
        const parsed = JSON.parse(savedVotes) as Record<string, unknown>;
        const validVotes = Object.fromEntries(
          members
            .map((member) => [member.id, parsed[member.id]])
            .filter((entry): entry is [string, VoteChoice] => ["yes", "maybe", "no"].includes(String(entry[1]))),
        );
        setVotes(validVotes);
      }
    } catch {
      window.localStorage.removeItem(VOTES_STORAGE_KEY);
    } finally {
      setVotesHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (votesHydrated) window.localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  }, [votes, votesHydrated]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [analysisStep, flowStage, votes]);

  useEffect(() => {
    const previewUrl = uploadedFile?.previewUrl;
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [uploadedFile?.previewUrl]);

  async function handleVideoSelected(file: File) {
    const runId = ++runIdRef.current;
    const previewUrl = URL.createObjectURL(file);

    setUploadedFile({ name: file.name, size: file.size, previewUrl });
    setAnalysis(demoVideoAnalysis);
    setConfirmedPlace(demoVideoAnalysis.placeName);
    setVotes({});
    setAnalysisStep(0);
    setFlowStage("analyzing");

    await wait(750);
    if (runIdRef.current !== runId) return;
    setAnalysisStep(1);

    await wait(900);
    if (runIdRef.current !== runId) return;
    setFlowStage("destination");
  }

  async function handleMakeItHappen() {
    const runId = ++runIdRef.current;
    const validatedAnalysis = videoAnalysisSchema.parse({
      ...analysis,
      placeName: confirmedPlace.trim(),
    });

    setAnalysis(validatedAnalysis);
    setAnalysisStep(2);
    setFlowStage("planning");

    await wait(750);
    if (runIdRef.current !== runId) return;
    setAnalysisStep(3);

    await wait(850);
    if (runIdRef.current !== runId) return;
    setFlowStage("planned");
  }

  function handleVote(memberId: string, vote: VoteChoice) {
    setVotes((currentVotes) => ({ ...currentVotes, [memberId]: vote }));
  }

  const isBusy = flowStage === "analyzing" || flowStage === "planning";

  return (
    <main className="min-h-dvh bg-[#f6f1e7] px-0 py-0 text-[#17233c] sm:px-4 sm:py-5 lg:px-8 lg:py-7">
      <div className="mx-auto mb-4 hidden max-w-5xl items-end justify-between px-1 sm:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-[#17233c] text-white shadow-md">
            <Route className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-black tracking-[-0.04em]">GC<span className="text-[#f97362]">2</span>Go</p>
            <p className="-mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#777e8b]">Turn the reel into a real plan</p>
          </div>
        </div>
        <p className="text-xs font-bold text-[#777e8b]">Get the trip out of the group chat.</p>
      </div>

      <section className="mx-auto flex h-dvh max-w-5xl flex-col overflow-hidden bg-[#fbfaf6] shadow-[0_28px_90px_rgba(24,35,60,0.14)] sm:h-[calc(100dvh-6.75rem)] sm:min-h-[650px] sm:rounded-[30px] sm:border sm:border-white/70">
        <GroupHeader members={members} onProfilesClick={() => setProfilesOpen(true)} />

        <ChatFeed members={members} messages={initialMessages}>
          {uploadedFile ? (
            <article className="ml-auto flex w-full max-w-[92%] justify-end sm:max-w-[72%]">
              <div>
                <div className="mb-1 flex items-baseline justify-end gap-2 px-1">
                  <time className="text-[10px] text-[#969aa4]">Just now</time>
                  <span className="text-xs font-extrabold text-[#17233c]">You</span>
                </div>
                <div className="overflow-hidden rounded-[20px] rounded-br-md bg-[#0f766e] p-2.5 text-white shadow-[0_9px_26px_rgba(15,118,110,0.18)]">
                  <video
                    src={uploadedFile.previewUrl}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full rounded-xl bg-[#0a4f4b] object-cover"
                    aria-label={`Preview of ${uploadedFile.name}`}
                  />
                  <div className="flex items-center gap-2 px-1 pb-0.5 pt-2">
                    <Film className="size-4 shrink-0 text-white/75" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-xs font-bold">{uploadedFile.name}</span>
                    <span className="text-[10px] text-white/65">{formatFileSize(uploadedFile.size)}</span>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {flowStage === "analyzing" || flowStage === "planning" ? <AnalysisProgress activeStep={analysisStep} /> : null}

          {flowStage === "destination" ? (
            <DestinationCard
              analysis={analysis}
              confirmedPlace={confirmedPlace}
              onPlaceChange={setConfirmedPlace}
              onConfirm={handleMakeItHappen}
            />
          ) : null}

          {flowStage === "planned" ? (
            <div className="space-y-4">
              <TripPlanCard destination={analysis.placeName} plan={demoTripPlan} />
              <VotingPanel members={members} votes={votes} onVote={handleVote} />
            </div>
          ) : null}

          {!uploadedFile && flowStage === "idle" ? (
            <div className="my-2 rounded-2xl border border-dashed border-[#0f766e]/25 bg-[#eef7f3] px-5 py-4 text-center">
              <Sparkles className="mx-auto mb-2 size-5 text-[#0f766e]" aria-hidden="true" />
              <p className="text-sm font-black text-[#17233c]">Share the reel that started the debate.</p>
              <p className="mt-1 text-xs text-[#737b88]">For Phase 1, any valid short video runs the polished demo path.</p>
            </div>
          ) : null}
          <div ref={feedEndRef} />
        </ChatFeed>

        <VideoUpload disabled={isBusy} compact={flowStage === "planned"} onFileSelected={handleVideoSelected} />
      </section>

      <MemberProfiles members={members} open={profilesOpen} onClose={() => setProfilesOpen(false)} />
    </main>
  );
}

