"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Film, LoaderCircle, Sparkles } from "lucide-react";

import { ChatFeed } from "@/components/group-chat/chat-feed";
import { GroupHeader } from "@/components/group-chat/group-header";
import { GroupSidebar } from "@/components/group-chat/group-sidebar";
import { SocialLinkComposer } from "@/components/group-chat/social-link-composer";
import { MemberProfiles } from "@/components/profiles/member-profiles";
import { DestinationCard } from "@/components/trip-plan/destination-card";
import { TripPlanCard } from "@/components/trip-plan/trip-plan-card";
import { UntermyerExperienceCard } from "@/components/trip-plan/untermyer-experience-card";
import { VotingPanel } from "@/components/trip-plan/voting-panel";
import { demoTripPlan, demoVideoAnalysis } from "@/data/demo-trip";
import { members as initialMembers } from "@/data/members";
import { UNTERMYER_REEL_URL } from "@/data/mock-untermyer";
import { previousPlans } from "@/data/previous-plans";
import { analysisSteps, initialMessages } from "@/lib/demo-data";
import { confirmAnalysisDestination, enterPlanningPipeline, getAnalysisSourceLabel } from "@/lib/plan-flow";
import { groundedPlaceSchema, tripPlanSchema, videoAnalysisSchema } from "@/lib/schemas";
import type { ChatMessage, PreviousPlan, TripPlan, VoteChoice, VotesByMember } from "@/types";

type FlowStage = "idle" | "analyzing" | "destination" | "planning" | "planned" | "social-analyzing";

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
  const [members, setMembers] = useState(initialMembers);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [flowStage, setFlowStage] = useState<FlowStage>("idle");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [confirmedPlace, setConfirmedPlace] = useState(demoVideoAnalysis.placeName ?? "");
  const [analysis, setAnalysis] = useState(demoVideoAnalysis);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(demoTripPlan);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; previewUrl: string } | null>(null);
  const [socialUrl, setSocialUrl] = useState<string | null>(null);
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
    setSocialError(null);
    setAnalysis(demoVideoAnalysis);
    setTripPlan(demoTripPlan);
    setActivePlanId(null);
    setConfirmedPlace(demoVideoAnalysis.placeName ?? "");
    setVotes({});
    setChatMessages(initialMessages);
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
    const confirmedAnalysis = confirmAnalysisDestination(analysis, confirmedPlace);
    const useLivePlanning = Boolean(confirmedAnalysis.provider);

    if (useLivePlanning) {
      setAnalysis(confirmedAnalysis);
      setAnalysisStep(2);
      setFlowStage("planning");
      setSocialError(null);

      try {
        await wait(300);
        if (runIdRef.current !== runId) return;
        setAnalysisStep(3);

        const mapsResponse = await fetch("/api/enrich-place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placeName: confirmedAnalysis.placeName,
            city: confirmedAnalysis.city,
            region: confirmedAnalysis.region,
            country: confirmedAnalysis.country,
          }),
        });
        const mapsPayload: unknown = await mapsResponse.json();
        if (!mapsResponse.ok) {
          const message = typeof mapsPayload === "object" && mapsPayload && "error" in mapsPayload
            ? String(mapsPayload.error)
            : "Google Maps could not verify this destination.";
          throw new Error(message);
        }
        const groundedPlace = groundedPlaceSchema.parse(mapsPayload);

        if (runIdRef.current !== runId) return;
        setAnalysisStep(4);
        const planResponse = await fetch("/api/generate-trip-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis: confirmedAnalysis, place: groundedPlace }),
        });
        const planPayload: unknown = await planResponse.json();
        if (!planResponse.ok) {
          const message = typeof planPayload === "object" && planPayload && "error" in planPayload
            ? String(planPayload.error)
            : "The grounded trip plan could not be built.";
          throw new Error(message);
        }
        if (!planPayload || typeof planPayload !== "object" || !("plan" in planPayload)) {
          throw new Error("The planning response was incomplete.");
        }
        setTripPlan(tripPlanSchema.parse(planPayload.plan));
        setFlowStage("planned");
      } catch (error) {
        if (runIdRef.current !== runId) return;
        setSocialError(error instanceof Error ? error.message : "Real trip planning failed.");
        setFlowStage("destination");
      }
      return;
    }

    if (!tripPlan) return;
    const planningResult = enterPlanningPipeline(confirmedAnalysis, confirmedPlace, tripPlan);

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
    setSocialError(null);
    setActivePlanId(plan.id);
    setAnalysis(plan.analysis);
    setConfirmedPlace(plan.analysis.placeName ?? "");
    setTripPlan(plan.plan);
    setVotes(plan.votes ?? {});
    setChatMessages(plan.messages);
    setFlowStage("planned");
  }

  function handleNewPlan() {
    runIdRef.current += 1;
    setUploadedFile(null);
    setSocialUrl(null);
    setSocialError(null);
    setActivePlanId(null);
    setAnalysis(demoVideoAnalysis);
    setConfirmedPlace(demoVideoAnalysis.placeName ?? "");
    setTripPlan(demoTripPlan);
    setVotes({});
    setChatMessages(initialMessages);
    setFlowStage("idle");
  }

  async function handleSocialLinkSubmit(url: string) {
    const runId = ++runIdRef.current;
    setUploadedFile(null);
    setActivePlanId(null);
    setSocialUrl(url);
    setSocialError(null);
    setTripPlan(null);
    setVotes({});
    setChatMessages(initialMessages);
    setFlowStage("social-analyzing");

    try {
      await wait(900);
      if (runIdRef.current !== runId) return;

      const analysisResponse = await fetch("/api/analyze-social-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: UNTERMYER_REEL_URL,
          provider: "instagram",
        }),
      });
      const analysisPayload: unknown = await analysisResponse.json();
      if (runIdRef.current !== runId) return;
      if (!analysisResponse.ok) {
        const message = typeof analysisPayload === "object" && analysisPayload && "error" in analysisPayload
          ? String(analysisPayload.error)
          : "Could not identify the destination.";
        throw new Error(message);
      }

      const nextAnalysis = videoAnalysisSchema.parse(analysisPayload);
      setAnalysis(nextAnalysis);
      setConfirmedPlace(nextAnalysis.placeName ?? "");

      const placeResponse = await fetch("/api/enrich-place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName: nextAnalysis.placeName,
          city: nextAnalysis.city,
          region: nextAnalysis.region,
          country: nextAnalysis.country,
        }),
      });
      const placePayload: unknown = await placeResponse.json();
      if (runIdRef.current !== runId) return;
      if (!placeResponse.ok) {
        const message = typeof placePayload === "object" && placePayload && "error" in placePayload
          ? String(placePayload.error)
          : "Could not prepare destination details.";
        throw new Error(message);
      }
      const place = groundedPlaceSchema.parse(placePayload);

      const planResponse = await fetch("/api/generate-trip-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: nextAnalysis, place }),
      });
      const planPayload: unknown = await planResponse.json();
      if (runIdRef.current !== runId) return;
      if (!planResponse.ok || !planPayload || typeof planPayload !== "object" || !("plan" in planPayload)) {
        const message = typeof planPayload === "object" && planPayload && "error" in planPayload
          ? String(planPayload.error)
          : "Could not build the group plan.";
        throw new Error(message);
      }

      setTripPlan(tripPlanSchema.parse(planPayload.plan));
      setFlowStage("planned");
    } catch (error) {
      if (runIdRef.current !== runId) return;
      setSocialError(error instanceof Error ? error.message : "The simulated plan could not be built.");
      setFlowStage("idle");
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

        <ChatFeed members={members} messages={chatMessages} currentMemberId="maya">
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

          {socialError ? (
            <div role="alert" className="assistant-entry rounded-2xl border border-[#FB7185]/25 bg-[#FB7185]/8 p-4 text-sm font-semibold text-[#FDA4AF]">
              {socialError}
            </div>
          ) : null}

          {flowStage === "social-analyzing" ? (
            <div className="assistant-entry overflow-hidden rounded-[22px] border border-[#2DD4BF]/20 bg-[#0F172A] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]" role="status" aria-live="polite">
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#2DD4BF]/10">
                  <LoaderCircle className="size-5 animate-spin text-[#2DD4BF]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-[#F8FAFC]">Let&apos;s check if we can make it…</p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    Checking the destination, everyone&apos;s availability, routes, nearby stops, and budget.
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#1E293B]">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#5EEAD4]" />
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

          {flowStage === "planned" && tripPlan ? (
            <div className="space-y-4">
              {analysis.placeName === "Untermyer Park and Gardens" ? (
                <UntermyerExperienceCard />
              ) : (
                <TripPlanCard destination={analysis.placeName ?? confirmedPlace} plan={tripPlan} sourceLabel={sourceLabel} />
              )}
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
            loading={flowStage === "social-analyzing"}
            onFileSelected={handleVideoSelected}
            onUrlSubmit={handleSocialLinkSubmit}
          />
        </div>
      </section>

      <MemberProfiles
        members={members}
        open={profilesOpen}
        onClose={() => setProfilesOpen(false)}
        onMembersChange={setMembers}
      />
    </main>
  );
}
