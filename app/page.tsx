"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  ArrowRight,
  MessageCircle,
  Search,
  LayoutDashboard,
  Shield,
  CheckCircle2,
  Users,
  Landmark,
  Lock,
  Globe,
  UserCheck,
  FileText,
  BookOpen,
  Video,
  Home,
  Briefcase,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ——— 1. Hero ——— */}
      <section
        id="hero"
        className="relative border-b border-slate-200/80 bg-[linear-gradient(to_bottom,rgba(108,45,199,0.04)_0%,transparent_50%)]"
        aria-label="Hero"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vk-primary">
              Organizing Legal Access for Digital India
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-vk-dark sm:text-5xl md:text-6xl md:leading-[1.1]">
              Legal access is infrastructure.
            </h1>
            <p className="mt-6 text-lg text-slate-600 sm:text-xl leading-relaxed">
              Vakeel Kutami brings structure, clarity, and trust to the first mile of justice. From understanding your issue to consulting verified advocates and tracking your case—one guided journey, full transparency.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-vk-primary px-6 py-3.5 text-base font-medium text-white shadow-sm transition hover:opacity-95 sm:w-auto"
              >
                Explain Your Legal Issue
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/advocates"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-vk-dark bg-white px-6 py-3.5 text-base font-medium text-vk-dark transition hover:bg-slate-50 sm:w-auto"
              >
                Find a Verified Advocate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 2. Problem ——— */}
      <section
        id="problem"
        className="border-b border-slate-200/80 bg-slate-50/50"
        aria-labelledby="problem-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <h2 id="problem-heading" className="text-center text-2xl font-semibold text-vk-dark sm:text-3xl">
            Why legal access in India is broken at the entry point
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Millions abandon or delay justice not because the law fails them—but because the path to it is unclear, manual, and opaque.
          </p>
          <ul className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {[
              { title: "Offline & paper-heavy", body: "Legal help is tied to physical visits, paper forms, and long waits—especially outside metros. Digital-first intake is rare." },
              { title: "Fragmented", body: "No single place to capture the issue, share documents, and see next steps. People juggle multiple channels and lose context." },
              { title: "Opaque", body: "Fees, timelines, and case status are often unclear. Trust erodes when there’s no visibility into process or progress." },
              { title: "Unstructured", body: "Systems are ad hoc. People don’t know which law applies, what to ask, or whom to trust. Confusion drives early drop-off." },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <h3 className="font-medium text-vk-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm font-medium text-slate-700">
            The result: justice is delayed or abandoned at the very entry point. Vakeel Kutami is built to fix that.
          </p>
        </div>
      </section>

      {/* ——— 3. Who This Affects ——— */}
      <section
        id="who-this-affects"
        className="border-b border-slate-200/80"
        aria-labelledby="who-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <h2 id="who-heading" className="text-center text-2xl font-semibold text-vk-dark sm:text-3xl">
            Who this affects
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            The cost of broken legal access falls on real people and businesses every day.
          </p>
          <ul className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {[
              { icon: Users, title: "Middle-class families", body: "Facing property, family, or consumer issues without a clear path—often giving up or paying more than they should." },
              { icon: Home, title: "Rural & semi-urban citizens", body: "Limited access to quality advocates and no digital structure. Travel and uncertainty make justice feel out of reach." },
              { icon: Briefcase, title: "SMEs & startups", body: "Contracts, compliance, and disputes need fast, transparent handling. Offline and opaque systems slow them down." },
              { icon: Scale, title: "Advocates", body: "Stuck in manual workflows, unclear client intake, and platforms that treat them as listings instead of partners in a journey." },
            ].map((item) => (
              <li
                key={item.title}
                className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-vk-primary/10 text-vk-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-medium text-vk-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— 4. The Solution ——— */}
      <section
        id="solution"
        className="border-b border-slate-200/80 bg-slate-50/50"
        aria-labelledby="solution-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-vk-primary/30 bg-vk-primary/5 px-3 py-1 text-xs font-medium text-vk-primary">
              The shift
            </span>
            <h2 id="solution-heading" className="mt-4 text-2xl font-semibold text-vk-dark sm:text-3xl">
              From directories to a Legal Access OS
            </h2>
            <p className="mt-4 text-slate-600">
              Vakeel Kutami is not an advocate directory or marketplace. It is the operating system for the full legal journey: structured intake, AI-assisted matching, verified advocates, transparent pricing, secure consultations, and case tracking—all in one place.
            </p>
          </div>
          <div className="mx-auto mt-12 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm md:p-10">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {[
                "Structured legal issue intake in plain language",
                "AI-assisted intent detection and advocate matching",
                "Verified advocates with digital KYC",
                "Transparent pricing and process at every step",
                "Secure voice/video consultations and document handling",
                "Case dashboards and real-time progress tracking",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-vk-primary" aria-hidden />
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— 5. How It Works ——— */}
      <section
        id="how-it-works"
        className="border-b border-slate-200/80"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <h2 id="how-heading" className="text-center text-2xl font-semibold text-vk-dark sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            One clear journey—from first question to case progress.
          </p>
          <ol className="mx-auto mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {[
              { step: "1", icon: MessageCircle, title: "Discover", desc: "Explain your legal problem in simple language. Our system helps structure your situation and surface what matters." },
              { step: "2", icon: Search, title: "Match", desc: "AI suggests suitable verified advocates based on your issue. Compare specialisation, language, and transparent pricing." },
              { step: "3", icon: Video, title: "Consult", desc: "Secure voice or video consultation and upload documents in an encrypted space. Get advice with clear next steps." },
              { step: "4", icon: LayoutDashboard, title: "Track", desc: "Real-time case progress and clarity in one dashboard. You and your advocate stay aligned—no guessing." },
            ].map((item) => (
              <li key={item.step} className="relative flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-vk-primary bg-white text-sm font-semibold text-vk-primary">
                  {item.step}
                </span>
                <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-lg bg-vk-primary/10 text-vk-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-medium text-vk-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— 6. AI + Human Collaboration ——— */}
      <section
        id="ai-human"
        className="border-b border-slate-200/80 bg-slate-50/50"
        aria-labelledby="ai-human-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <h2 id="ai-human-heading" className="text-center text-2xl font-semibold text-vk-dark sm:text-3xl">
            AI + human collaboration
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            AI assists at every step; advocates validate and advise. We never replace human judgment—we make it easier to reach.
          </p>
          <ul className="mx-auto mt-12 grid gap-6 sm:grid-cols-3" role="list">
            {[
              { icon: MessageCircle, title: "Legal Query Bot", body: "Helps users articulate their issue in plain language and surfaces relevant questions. Reduces confusion at the entry point." },
              { icon: BookOpen, title: "Research Bot", body: "Assists with legal research and context. Advocates use it to prepare; outputs are validated by the advocate before reliance." },
              { icon: FileText, title: "Draft Bot", body: "Supports first drafts of notices, replies, and simple documents. Every draft is reviewed and approved by the advocate." },
            ].map((item) => (
              <li
                key={item.title}
                className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-vk-primary/10 text-vk-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-medium text-vk-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm font-medium text-slate-700">
            Human-in-the-loop is non-negotiable: AI clarifies and accelerates; advocates own advice and outcomes.
          </p>
        </div>
      </section>

      {/* ——— 7. Trust, Security & Technology ——— */}
      <section
        id="trust"
        className="border-b border-slate-200/80"
        aria-labelledby="trust-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <h2 id="trust-heading" className="text-center text-2xl font-semibold text-vk-dark sm:text-3xl">
            Trust, security & technology
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Built for national-scale legal infrastructure—serious about verification, encryption, and architecture.
          </p>
          <ul className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {[
              { icon: UserCheck, title: "Advocate verification", desc: "Bar Council–verified advocates with digital KYC and platform checks. You know who you’re consulting." },
              { icon: Lock, title: "Encrypted document vault", desc: "Documents stored with encryption and access controls. Only you and your advocate see what’s needed." },
              { icon: Video, title: "Secure consultations", desc: "Voice and video consultations over secure channels. No unauthorised access or recording without consent." },
              { icon: Shield, title: "Scalable modular architecture", desc: "Built to serve citizens, advocates, and institutions at scale—reliable, auditable, and upgradeable." },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vk-primary/10 text-vk-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-medium text-vk-dark">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-vk-primary" aria-hidden />
              Multilingual: English, Hindi, Telugu
            </span>
          </p>
        </div>
      </section>

      {/* ——— 8. Why Vakeel Kutami Wins ——— */}
      <section
        id="why-us"
        className="border-b border-slate-200/80 bg-slate-50/50"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:py-24">
          <h2 id="why-heading" className="text-center text-2xl font-semibold text-vk-dark sm:text-3xl">
            Why Vakeel Kutami wins
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            We’re not a directory or an aggregator. We’re the operating system for the full legal journey.
          </p>
          <div className="mx-auto mt-12 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-6 py-4 font-medium text-vk-dark">Capability</th>
                    <th className="px-6 py-4 font-medium text-slate-700">Directories</th>
                    <th className="px-6 py-4 font-medium text-slate-700">Offline firms</th>
                    <th className="px-6 py-4 font-medium text-slate-700">Aggregators</th>
                    <th className="px-6 py-4 font-medium text-vk-dark">Vakeel Kutami</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { cap: "End-to-end legal workflow", dir: "—", firm: "—", agg: "Partial", us: "Yes" },
                    { cap: "Transparent pricing & process", dir: "Rare", firm: "Rare", agg: "Sometimes", us: "Yes" },
                    { cap: "AI + human validation", dir: "—", firm: "—", agg: "—", us: "Yes" },
                    { cap: "Verified advocates (KYC)", dir: "Mixed", firm: "N/A", agg: "Mixed", us: "Yes" },
                    { cap: "Structured intake & case tracking", dir: "No", firm: "No", agg: "No", us: "Yes" },
                  ].map((row) => (
                    <tr key={row.cap} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-700">{row.cap}</td>
                      <td className="px-6 py-4 text-slate-500">{row.dir}</td>
                      <td className="px-6 py-4 text-slate-500">{row.firm}</td>
                      <td className="px-6 py-4 text-slate-500">{row.agg}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-medium text-vk-primary">
                          <CheckCircle2 className="h-4 w-4" aria-hidden />
                          {row.us}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 9. Vision ——— */}
      <section
        id="vision"
        className="border-b border-slate-200/80"
        aria-labelledby="vision-heading"
      >
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20 md:py-24 text-center">
          <Landmark className="mx-auto h-12 w-12 text-vk-primary/60" aria-hidden />
          <h2 id="vision-heading" className="mt-6 text-2xl font-semibold text-vk-dark sm:text-3xl">
            Legal access is foundational infrastructure
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Just like roads and electricity, the ability to understand and pursue legal rights should be available to every Indian. Vakeel Kutami exists to democratise that access—through technology that clarifies, connects, and tracks—so more people complete their legal journey with confidence and dignity.
          </p>
        </div>
      </section>

      {/* ——— 10. Final CTA ——— */}
      <section
        id="cta"
        className="bg-vk-dark"
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20 md:py-24 text-center">
          <h2 id="cta-heading" className="text-2xl font-semibold text-white sm:text-3xl">
            Start your legal journey
          </h2>
          <p className="mt-4 text-slate-400">
            Get legal clarity today. Explain your issue or find a verified advocate—we’re here to guide you.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-vk-primary px-6 py-3.5 text-base font-medium text-white shadow-sm transition hover:opacity-95 sm:w-auto"
            >
              Start Your Legal Journey
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/advocates"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/10 sm:w-auto"
            >
              Get Legal Clarity Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
