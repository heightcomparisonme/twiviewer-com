import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  ToolPageLayout,
  type FeatureItem,
  type Features2Item,
} from "@/components/blocks/tools/ToolPageLayout";
import ToolPlaceholder from "@/components/Tools/aiMoonAdvisor";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "tools",
  });

  return {
    title: t("example.metadata.title"),
    description: t("example.metadata.description"),
  };
}

export default async function AIMoonAdvisorPage({ params }: Props) {
  const { locale } = await params;

  const features: FeatureItem[] = [
    {
      icon: "sparkles",
      key: "insights",
      color: "text-purple-400",
    },
    {
      icon: "users",
      key: "personalization",
      color: "text-emerald-400",
    },
    {
      icon: "target",
      key: "recipes",
      color: "text-amber-400",
    },
    {
      icon: "shield",
      key: "credits",
      color: "text-sky-400",
    },
  ];

  const features2: Features2Item[] = [
    {
      icon: "sparkles",
      key: "insights",
      beforeImage: "/imgs/features/5.png",
      afterImage: "/imgs/features/6.png",
    },
    {
      icon: "zap",
      key: "recipes",
      beforeImage: "/imgs/features/3.png",
      afterImage: "/imgs/features/3-after.png",
    },
    {
      icon: "chart",
      key: "workflow",
      beforeImage: "/imgs/features/2.png",
      afterImage: "/imgs/features/2-after.png",
    },
  ];

  return (
    <ToolPageLayout
      toolKey="example"
      calculator={<ToolPlaceholder variant="gradient" />}
      features={features}
      features2={features2}
      containerClassName="bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]"
      calculatorWrapperClassName="max-w-6xl"
    />
  );
}
