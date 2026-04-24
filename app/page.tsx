import { FAQ } from "@/components/marketing/faq";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";
import { Workflow } from "@/components/marketing/workflow";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Hero />
      <Workflow />
      <FeatureGrid />
      <FAQ />
    </div>
  );
}
