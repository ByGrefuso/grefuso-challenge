import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: "https://grefusochallenge.com/sitemap.xml",
});

export default robots;
