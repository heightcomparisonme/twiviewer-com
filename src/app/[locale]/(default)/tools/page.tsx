import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { TOOLS_CONFIG } from "@/lib/tools-config";
import ToolsPageClient from "@/components/blocks/tools/ToolsPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.tools"
  });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

interface Tool {
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;

  // Dynamically load all tools from config and translations
  const allTools: Tool[] = await Promise.all(
    TOOLS_CONFIG.map(async (config) => {
      try {
        const t = await getTranslations({
          locale,
          namespace: `tools.${config.slug}`,
        });

        // Use translationKey if provided (nested structure), otherwise flat structure
        const title = config.translationKey
          ? t(`${config.translationKey}.metadata.title`)
          : t("metadata.title");

        const description = config.translationKey
          ? t(`${config.translationKey}.metadata.description`)
          : t("metadata.description");

        return {
          title,
          description,
          url: `/tools/${config.slug}`,
          icon: config.icon,
          color: config.color,
          category: config.category,
          tags: config.tags,
        };
      } catch (error) {
        // Fallback if translation is missing
        console.warn(`Missing translations for tool: ${config.slug}`);
        return {
          title: config.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          description: `Discover ${config.slug}`,
          url: `/tools/${config.slug}`,
          icon: config.icon,
          color: config.color,
          category: config.category,
          tags: config.tags,
        };
      }
    })
  );

  // Trending tools for sidebar (top 5 based on popularity)
  const trendingTools = [
    { title: allTools[0]?.title || "Mondkalender Haare Schneiden", url: "/tools/mondkalender-haare-schneiden", icon: "Scissors", usageCount: 15420 },
    { title: allTools[2]?.title || "Mond Heute", url: "/tools/mond-heute", icon: "Moon", usageCount: 12350 },
    { title: allTools[1]?.title || "Haare Färben Mondkalender", url: "/tools/haare-farben-mondkalender", icon: "Palette", usageCount: 9870 },
    { title: allTools[3]?.title || "Mondaufgang", url: "/tools/auf-untergang", icon: "Sunrise", usageCount: 8540 },
    { title: allTools[4]?.title || "Kochen nach Mondkalender", url: "/tools/kochen", icon: "ChefHat", usageCount: 7230 }
  ];

  return (
    <ToolsPageClient
      allTools={allTools}
      trendingTools={trendingTools}
    />
  );
}
