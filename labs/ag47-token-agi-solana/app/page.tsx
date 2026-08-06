import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { NetworkMetrics } from "@/components/sections/NetworkMetrics";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TokenUtility } from "@/components/sections/TokenUtility";
import { Tokenomics } from "@/components/sections/Tokenomics";
import { Differentiators } from "@/components/sections/Differentiators";
import { Roadmap } from "@/components/sections/Roadmap";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <Hero />
        <NetworkMetrics />
        <Problem />
        <Solution />
        <HowItWorks />
        <TokenUtility />
        <Tokenomics />
        <Differentiators />
        <Roadmap />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
