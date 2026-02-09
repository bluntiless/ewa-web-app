import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ewatracker.co.uk",
      lastModified: new Date(),
      changeFrequency: "yearly",
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
      priority: 0.8,
    },
    {
      url: "https://ewatracker.co.uk/ewa-assessment",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // Higher priority for key service page
    },
    {
      url: "https://ewatracker.co.uk/nvq-level-3-electrical",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // Higher priority for key service page
    },
    {
      url: "https://ewatracker.co.uk/ecs-gold-card-route",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // Higher priority for key service page
    },
    {
      url: "https://ewatracker.co.uk/candidate-check", // New page
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
  ]
}
