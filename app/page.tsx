"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Film, LoaderCircle, Sparkles } from "lucide-react";

import { ChatFeed } from "@/components/group-chat/chat-feed";
import { GroupHeader } from "@/components/group-chat/group-header";
import { GroupSidebar } from "@/components/group-chat/group-sidebar";
import { SocialLinkComposer } from "@/components/group-chat/social-link-composer";
import { SocialReelPreview } from "@/components/group-chat/social-reel-preview";
import { MemberProfiles } from "@/components/profiles/member-profiles";
import { DestinationCard } from "@/components/trip-plan/destination-card";
import { TripPlanCard } from "@/components/trip-plan/trip-plan-card";
import { VotingPanel } from "@/components/trip-plan/voting-panel";
import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import { members } from "@/data/members";
import { previousPlans } from "@/data/previous-plans";
import { analysisSteps, initialMessages } from "@/lib/demo-data";
import { enterPlanningPipeline, getAnalysisSourceLabel } from "@/lib/plan-flow";
import { socialPreviewSchema, videoAnalysisSchema } from "@/lib/schemas";
import type { PreviousPlan, SocialPreview, TripPlan, VoteChoice, VotesByMember } from "@/types";

type FlowStage = "idle" | "analyzing" | "destination" | "planning" | "planned" | "social-loading" | "social-preview" | "social-analyzing";

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
  const [tripPlan, setTripPlan] = useState<TripPlan>(demoTripPlan);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; previewUrl: string } | null>(null);
  const [socialUrl, setSocialUrl] = useState<string | null>(null);
  const [socialPreview, setSocialPreview] = useState<SocialPreview | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
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
    setSocialUrl(null);
    setSocialPreview(null);
    setSocialError(null);
    setAnalysis(demoVideoAnalysis);
    setTripPlan(demoTripPlan);
    setActivePlanId(null);
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
    const planningResult = enterPlanningPipeline(analysis, confirmedPlace, tripPlan);

    setAnalysis(planningResult.analysis);
    setTripPlan(planningResult.plan);
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

  function handlePreviousPlan(plan: PreviousPlan) {
    runIdRef.current += 1;
    setUploadedFile(null);
    setSocialUrl(null);
    setSocialPreview(null);
    setSocialError(null);
    setActivePlanId(plan.id);
    setAnalysis(plan.analysis);
    setConfirmedPlace(plan.analysis.placeName);
    setTripPlan(plan.plan);
    setVotes({});
    setFlowStage("planned");
  }

  function handleNewPlan() {
    runIdRef.current += 1;
    setUploadedFile(null);
    setSocialUrl(null);
    setSocialPreview(null);
    setSocialError(null);
    setActivePlanId(null);
    setAnalysis(demoVideoAnalysis);
    setConfirmedPlace(demoVideoAnalysis.placeName);
    setTripPlan(demoTripPlan);
    setVotes({});
    setFlowStage("idle");
  }

  async function handleSocialLinkSubmit(url: string) {
    const runId = ++runIdRef.current;
    setUploadedFile(null);
    setActivePlanId(null);
    setSocialUrl(url);
    setSocialPreview(null);
    setSocialError(null);
    setTripPlan(demoTripPlan);
    setVotes({});
    setFlowStage("social-loading");

    try {
      const response = await fetch("/api/social-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload: unknown = await response.json();
      if (runIdRef.current !== runId) return;

      const preview = socialPreviewSchema.safeParse(payload);
      if (preview.success) {
        setSocialPreview(preview.data);
        setFlowStage("social-preview");
        return;
      }

      const errorMessage = typeof payload === "object" && payload && "error" in payload
        ? String(payload.error)
        : "The provider could not create a public preview.";
      throw new Error(errorMessage);
    } catch (error) {
      if (runIdRef.current !== runId) return;
      setSocialError(error instanceof Error ? error.message : "The reel preview is unavailable.");
      setFlowStage("idle");
    }
  }

  async function handleAnalyzeSocialLink() {
    if (!socialPreview) return;
    const runId = ++runIdRef.current;
    setSocialError(null);
    setFlowStage("social-analyzing");

    try {
      const response = await fetch("/api/analyze-social-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: socialPreview.canonicalUrl,
          provider: socialPreview.provider,
        }),
      });
      const payload: unknown = await response.json();
      if (runIdRef.current !== runId) return;
      if (!response.ok) {
        const message = typeof payload === "object" && payload && "error" in payload
          ? String(payload.error)
          : "Public reel analysis is unavailable.";
        throw new Error(message);
      }

      const nextAnalysis = videoAnalysisSchema.parse(payload);
      setAnalysis(nextAnalysis);
      setConfirmedPlace(nextAnalysis.placeName === "Unknown destination" ? "" : nextAnalysis.placeName);
      setTripPlan(demoTripPlan);
      setFlowStage("destination");
    } catch (error) {
      if (runIdRef.current !== runId) return;
      setSocialError(error instanceof Error ? error.message : "Public reel analysis is unavailable.");
      setFlowStage("social-preview");
    }
  }

  function handleUploadInstead() {
    document.querySelector<HTMLInputElement>('input[type="file"][accept*="video/mp4"]')?.click();
  }

  const isBusy = flowStage === "analyzing" || flowStage === "planning" || flowStage === "social-analyzing";
  const sourceLabel = getAnalysisSourceLabel(analysis);

  return (
    <main className="gc2go-dark min-h-dvh bg-[#080B12] text-[#F8FAFC]">
      <section className="mx-auto flex h-dvh max-w-[1500px] overflow-hidden border-x border-[#1F2937] bg-[#080B12] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <GroupSidebar
          plans={previousPlans}
          activePlanId={activePlanId}
          onNewPlan={handleNewPlan}
          onPlanSelect={handlePreviousPlan}
        />

        <div className="flex min-w-0 flex-1 flex-col bg-[#080B12]">
          <GroupHeader members={members} onProfilesClick={() => setProfilesOpen(true)} />

        <ChatFeed members={members} messages={initialMessages} currentMemberId="maya">
          {uploadedFile ? (
            <article className="ml-auto flex w-full max-w-[92%] justify-end sm:max-w-[72%]">
              <div>
                <div className="mb-1 flex items-baseline justify-end gap-2 px-1">
                  <time className="text-[10px] text-[#64748B]">Just now</time>
                  <span className="text-xs font-extrabold text-[#E2E8F0]">You</span>
                </div>
                <div className="overflow-hidden rounded-[20px] rounded-br-md border border-[#2DD4BF]/25 bg-[#134E4A]/60 p-2.5 text-white shadow-[0_9px_26px_rgba(0,0,0,0.2)]">
                  <video
                    src={uploadedFile.previewUrl}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full rounded-xl bg-[#080B12] object-cover"
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

          {socialUrl ? (
            <article className="ml-auto flex max-w-[92%] justify-end sm:max-w-[72%]">
              <div>
                <div className="mb-1 flex items-baseline justify-end gap-2 px-1">
                  <time className="text-[10px] text-[#64748B]">Just now</time>
                  <span className="text-xs font-extrabold text-[#E2E8F0]">You</span>
                </div>
                <a
                  href={socialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block max-w-full truncate rounded-[20px] rounded-br-md border border-[#2DD4BF]/25 bg-[#134E4A]/60 px-4 py-3 text-sm font-semibold text-[#CCFBF1] underline decoration-[#5EEAD4]/30 underline-offset-2 hover:decoration-[#5EEAD4]"
                >
                  {socialUrl}
                </a>
              </div>
            </article>
          ) : null}

          {flowStage === "social-loading" ? (
            <div className="assistant-entry flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#0F172A] p-4 text-sm font-bold text-[#E2E8F0]" role="status">
              <LoaderCircle className="size-5 animate-spin text-[#2DD4BF]" aria-hidden="true" />
              Loading public reel preview…
            </div>
          ) : null}

          {socialError ? (
            <div role="alert" className="assistant-entry rounded-2xl border border-[#FB7185]/25 bg-[#FB7185]/8 p-4 text-sm font-semibold text-[#FDA4AF]">
              {socialError} You can still open the reel directly or upload a screen recording.
            </div>
          ) : null}

          {flowStage === "social-preview" && socialPreview ? (
            <SocialReelPreview preview={socialPreview} onAnalyze={handleAnalyzeSocialLink} />
          ) : null}

          {flowStage === "social-analyzing" ? (
            <div className="assistant-entry rounded-2xl border border-[#1F2937] bg-[#0F172A] p-4" role="status" aria-live="polite">
              <div className="flex items-center gap-3">
                <LoaderCircle className="size-5 animate-spin text-[#2DD4BF]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-black text-[#F8FAFC]">Analyzing public reel information…</p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">Checking metadata, URL Context, and an approved thumbnail when available.</p>
                </div>
              </div>
            </div>
          ) : null}

          {flowStage === "analyzing" || flowStage === "planning" ? <AnalysisProgress activeStep={analysisStep} /> : null}

          {flowStage === "destination" ? (
            <DestinationCard
              analysis={analysis}
              confirmedPlace={confirmedPlace}
              sourceLabel={sourceLabel}
              onPlaceChange={setConfirmedPlace}
              onConfirm={handleMakeItHappen}
              onUploadInstead={handleUploadInstead}
            />
          ) : null}

          {flowStage === "planned" ? (
            <div className="space-y-4">
              <TripPlanCard destination={analysis.placeName} plan={tripPlan} sourceLabel={sourceLabel} />
              <VotingPanel members={members} votes={votes} onVote={handleVote} />
            </div>
          ) : null}

          {!uploadedFile && !socialUrl && flowStage === "idle" ? (
            <div className="my-2 rounded-2xl border border-dashed border-[#2DD4BF]/25 bg-[#0F172A] px-5 py-4 text-center">
              <Sparkles className="mx-auto mb-2 size-5 text-[#2DD4BF]" aria-hidden="true" />
              <p className="text-sm font-black text-[#F8FAFC]">Share the reel that started the debate.</p>
              <p className="mt-1 text-xs text-[#94A3B8]">Paste a public link or attach a short video to start a plan.</p>
            </div>
          ) : null}
          <div ref={feedEndRef} />
          </ChatFeed>

          <SocialLinkComposer
            disabled={isBusy}
            loading={flowStage === "social-loading"}
            onFileSelected={handleVideoSelected}
            onUrlSubmit={handleSocialLinkSubmit}
          />
        </div>
      </section>

      <MemberProfiles members={members} open={profilesOpen} onClose={() => setProfilesOpen(false)} />
    </main>
  );
}
