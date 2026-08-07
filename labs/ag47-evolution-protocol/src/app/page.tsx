import { ArchitectureGap } from "@/components/sections/ArchitectureGap";
import { Bootstrap } from "@/components/sections/Bootstrap";
import { Collaboration } from "@/components/sections/Collaboration";
import { Evidence } from "@/components/sections/Evidence";
import { Gates } from "@/components/sections/Gates";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { HumanActions } from "@/components/sections/HumanActions";
import { Hypothesis } from "@/components/sections/Hypothesis";
import { Pillars } from "@/components/sections/Pillars";
import { Problem } from "@/components/sections/Problem";
import { RepositoryStructure } from "@/components/sections/RepositoryStructure";
import { Roles } from "@/components/sections/Roles";
import { Skills } from "@/components/sections/Skills";
import { StateMachineSection } from "@/components/sections/StateMachineSection";
import { WhatItIs } from "@/components/sections/WhatItIs";
import { Workflows } from "@/components/sections/Workflows";

/**
 * Composição da landing page.
 *
 * Server Component: as seções são renderizadas no servidor e apenas os widgets
 * interativos internos atravessam a fronteira de cliente.
 *
 * As seções 19 a 24 do documento mestre entram no sprint 5.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Hypothesis />
      <WhatItIs />
      <Pillars />
      <HowItWorks />
      <Roles />
      <Skills />
      <Workflows />
      <StateMachineSection />
      <Collaboration />
      <HumanActions />
      <Bootstrap />
      <ArchitectureGap />
      <Evidence />
      <Gates />
      <RepositoryStructure />
    </>
  );
}
