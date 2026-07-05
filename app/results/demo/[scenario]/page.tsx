import { notFound } from "next/navigation";
import DemoReport from "@/components/demo/DemoReport";
import { demoScenarios, getDemoScenario } from "@/lib/demoScenarios";

interface DemoPageProps {
  params: { scenario: string };
}

export function generateStaticParams() {
  return demoScenarios.map((scenario) => ({ scenario: scenario.slug }));
}

export function generateMetadata({ params }: DemoPageProps) {
  const scenario = getDemoScenario(params.scenario);
  if (!scenario) return { title: "Demo report | Xi's" };
  return {
    title: `${scenario.title} — demo report | Xi's`,
    description: scenario.metaDescription,
  };
}

export default function DemoScenarioPage({ params }: DemoPageProps) {
  const scenario = getDemoScenario(params.scenario);
  if (!scenario) notFound();
  return <DemoReport scenario={scenario} />;
}
