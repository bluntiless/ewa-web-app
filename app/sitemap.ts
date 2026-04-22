import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ewatracker.co.uk",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://ewatracker.co.uk/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://ewatracker.co.uk/services",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://ewatracker.co.uk/ewa-assessment",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://ewatracker.co.uk/ecs-gold-card-route",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // SEO Landing Pages
    {
      url: "https://ewatracker.co.uk/eal-5982-experienced-worker",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://ewatracker.co.uk/ecs-gold-card-experienced-worker",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://ewatracker.co.uk/ewa-electrician-uk",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    
    {
      url: "https://ewatracker.co.uk/ewa-cost",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Guides Section
    {
      url: "https://ewatracker.co.uk/guides",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://ewatracker.co.uk/guides/what-is-eal-5982-experienced-worker-qualification",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ewatracker.co.uk/guides/do-i-need-am2-for-ecs-gold-card",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ewatracker.co.uk/guides/ewa-vs-apprenticeship-which-route",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // EWA Entry Test Mock
    {
      url: "https://ewatracker.co.uk/ewa-entry-test",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Skills Scan & Candidate Pages
    {
      url: "https://ewatracker.co.uk/skills-scan",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://ewatracker.co.uk/candidate-check",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ewatracker.co.uk/candidate-background",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ewatracker.co.uk/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://ewatracker.co.uk/policies",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
