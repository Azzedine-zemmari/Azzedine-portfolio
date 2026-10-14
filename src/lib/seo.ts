import {
  about,
  journey,
  projects,
  site,
  skills,
  socials,
} from "../data/portfolio";

const ALL_TECH = skills.flatMap((c) => c.items.map((i) => i.name));
const ORG_LINKS = socials.map((s) => s.href);

const EDUCATION_ORGS = [
  "Youcode (UM6P)",
  "NTIC Training Center",
  "Ibn Khaldoun High School",
];

/** JSON-LD @graph — only accurate, verifiable properties from portfolio data. */
export function buildStructuredData(): Record<string, unknown> {
  const personId = `${site.url}/#person`;
  const websiteId = `${site.url}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: "Azzedine Zemmari",
        url: site.url,
        jobTitle: site.role,
        description: about.summary,
        email: `mailto:${site.email}`,
        image: `${site.url}/profile.jpg`,
        telephone: "+212767228591",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
        alumniOf: EDUCATION_ORGS.map((name) => ({
          "@type": "EducationalOrganization",
          name,
        })),
        knowsAbout: ALL_TECH,
        knowsLanguage: ["ar", "fr", "en"],
        sameAs: ORG_LINKS,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: `${site.name} — ${site.role}`,
        description: about.summary,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profilepage`,
        url: site.url,
        name: `${site.name} — ${site.role} (${site.focus})`,
        description: about.summary,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        significantLink: socials.map((s) => ({
          "@type": "WebPage",
          url: s.href,
          name: s.label,
        })),
      },
      {
        "@type": "ItemList",
        name: `${site.name} — Featured projects`,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: project.title,
            description: project.summary,
            programmingLanguage: project.stack,
            codeRepository: project.repo,
            author: { "@id": personId },
            ...(project.year ? { dateCreated: project.year } : {}),
          },
        })),
      },
      {
        "@type": "ItemList",
        name: `${site.name} — Professional journey`,
        itemListElement: journey.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Organization",
            name: entry.org,
            description: `${entry.title} (${entry.period}) — ${entry.description}`,
          },
        })),
      },
    ],
  };
}

export function structuredDataScript(): string {
  return JSON.stringify(buildStructuredData(), null, 2);
}
