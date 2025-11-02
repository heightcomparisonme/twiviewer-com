import { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/i18n/locale";
import { getPostsByLocale } from "@/models/post";

const FALLBACK_BASE_URL = "https://mondkalender.app";
const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL ?? FALLBACK_BASE_URL).replace(
  /\/+$/,
  ""
);

const localizedStaticPaths = [
  "",
  "pricing",
  "posts",
  "showcase",
  "ai-workstation",
  "comingsoon",
  "discord",
  "glossary",
  "weather",
  "docs",
  "tools",
  "tools/example",
  "tools/auf-untergang",
  "tools/haare-farben-mondkalender",
  "tools/kochen",
  "tools/mond-heute",
  "tools/mondaufgang-heute",
  "tools/mondkalender-2026",
  "tools/mondkalender-2026-zum-ausdrucken",
  "tools/mondkalender-haare-schneiden",
  "tools/mondkalender-online",
  "tools/moon",
  "tools/moon-sign-calculator",
];

const legalPaths = ["privacy-policy", "terms-of-service"];

const MAX_POSTS = 500;

const now = new Date();

function buildUrl(locale: string, path: string) {
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const localePrefix = locale === defaultLocale ? "" : locale;
  const joined = [localePrefix, cleanPath].filter(Boolean).join("/");
  return joined ? `${baseUrl}/${joined}` : baseUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of localizedStaticPaths) {
      const url = buildUrl(locale, path);
      if (entries.some((entry) => entry.url === url)) {
        continue;
      }

      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    const posts = await getPostsByLocale(locale, 1, MAX_POSTS);

    for (const post of posts ?? []) {
      if (!post.slug) {
        continue;
      }

      entries.push({
        url: buildUrl(locale, `posts/${post.slug}`),
        lastModified: post.updated_at ?? post.created_at ?? now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const path of legalPaths) {
    const url = `${baseUrl}/${path}`;
    if (entries.some((entry) => entry.url === url)) {
      continue;
    }

    entries.push({
      url,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  return entries;
}
