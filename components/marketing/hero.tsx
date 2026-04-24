import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="grid gap-8 pb-16 pt-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-8">
        <Badge>Educational physician-reviewed second opinions</Badge>
        <div className="space-y-6">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            Physician-reviewed second opinions, without the confusion.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Upload records, explain your concern, and receive a structured
            written review from a licensed physician, assisted by AI and
            reviewed by a human doctor.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/signup">
            <Button className="gap-2">
              Get a second opinion
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="secondary">See how it works</Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Not emergency care",
            "Review is limited to records you provide",
            "AI assists summarization only",
            "Physician may request more information",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-teal" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <Card className="space-y-6 bg-[linear-gradient(180deg,#ffffff_0%,#f3f8f9_100%)]">
        <div className="flex items-center justify-between">
          <Badge className="bg-white">Typical workflow</Badge>
          <Stethoscope className="h-5 w-5 text-ocean" />
        </div>
        <div className="space-y-4">
          {[
            "Upload labs, scans, discharge summaries, and questions",
            "AI organizes the case into a physician-ready brief",
            "A physician reviews, edits, and delivers a written opinion",
          ].map((step, index) => (
            <div key={step} className="flex gap-4 rounded-3xl border border-line bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist font-semibold text-ocean">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-600">{step}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-ink p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">
            Starting point
          </p>
          <p className="mt-2 text-2xl font-semibold">$199</p>
          <p className="mt-2 text-sm text-white/80">
            Configurable placeholder pricing for standard written review.
          </p>
        </div>
      </Card>
    </section>
  );
}
