import {
  about,
  journey,
  projects,
  site,
  skills,
  socials,
  suggestions,
} from "../data/portfolio";

export interface AssistantLink {
  label: string;
  href: string;
}

export interface AssistantAnswer {
  text: string;
  links: AssistantLink[];
  followUps: string[];
}

const SECTION_LINKS: AssistantLink[] = [
  { label: "#projects", href: "#projects" },
  { label: "#skills", href: "#skills" },
  { label: "#experience", href: "#experience" },
  { label: "#contact", href: "#contact" },
];

const TECH_LIST = (names: string[]) => names.join(", ");

function normalize(input: string): string {
  return ` ${input.toLowerCase().replace(/[^\p{L}\p{N}+#/ -]/gu, " ").replace(/\s+/g, " ").trim()} `;
}

interface Intent {
  id: string;
  keywords: string[];
  weight?: number;
}

const INTENTS: Intent[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "salam", "salut", "good morning", "good evening", "good afternoon", "yo"],
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thx", "great", "awesome", "perfect", "cool"],
  },
  {
    id: "availability",
    keywords: [
      "available",
      "availability",
      "open to work",
      "hiring",
      "hire",
      "opportunity",
      "opportunities",
      "job offer",
      "freelance",
      "looking for",
      "recruit",
    ],
    weight: 1.15,
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email",
      "mail",
      "reach",
      "get in touch",
      "whatsapp",
      "phone",
      "call",
      "discord",
      "linkedin",
      "github link",
      "touch base",
    ],
  },
  {
    id: "cv",
    keywords: ["cv", "resume"],
  },
  {
    id: "backend",
    keywords: [
      "backend",
      "back-end",
      "back end",
      "server",
      "server-side",
      "spring",
      "spring boot",
      "spring security",
      "java",
      "hibernate",
      "jpa",
      "api",
      "rest",
      "laravel",
      "php",
      "express",
      "microservice",
      "endpoint",
    ],
  },
  {
    id: "frontend",
    keywords: [
      "frontend",
      "front-end",
      "front end",
      "client-side",
      "angular",
      "react",
      "vue",
      "html",
      "css",
      "tailwind",
      "bootstrap",
      "ui",
      "interface",
      "responsive",
      "design system",
    ],
  },
  {
    id: "databases",
    keywords: [
      "database",
      "databases",
      "sql",
      "postgres",
      "postgresql",
      "mysql",
      "mongo",
      "mongodb",
      "nosql",
      "db",
      "schema",
      "migration",
    ],
  },
  {
    id: "devops",
    keywords: [
      "docker",
      "kubernetes",
      "ci/cd",
      "cicd",
      "deploy",
      "deployment",
      "git",
      "github",
      "jira",
      "maven",
      "liquibase",
      "devops",
      "pipeline",
    ],
  },
  {
    id: "testing",
    keywords: ["test", "testing", "junit", "tdd", "unit test", "quality"],
  },
  {
    id: "fullstack",
    keywords: ["full-stack", "fullstack", "full stack", "end-to-end", "end to end", "whole stack"],
  },
  {
    id: "project",
    keywords: [
      "project",
      "projects",
      "portfolio",
      "built",
      "showcase",
      "work has he",
      "what has he",
      "best work",
      "case study",
      "github",
    ],
  },
  {
    id: "experience",
    keywords: [
      "experience",
      "work history",
      "worked",
      "professional",
      "career",
      "background",
      "job",
      "employment",
      "freelance",
    ],
  },
  {
    id: "education",
    keywords: [
      "education",
      "study",
      "studied",
      "school",
      "youcode",
      "diploma",
      "degree",
      "university",
      "training",
      "baccalaureate",
      "certification",
    ],
  },
  {
    id: "location",
    keywords: ["where", "located", "location", "based", "morocco", "casablanca", "remote", "timezone", "time zone"],
  },
  {
    id: "languages",
    keywords: ["language", "languages", "speak", "arabic", "french", "english", "fluent"],
  },
  {
    id: "stack",
    keywords: [
      "technolog",
      "tech stack",
      "stack",
      "tools",
      "skills",
      "what does he use",
      "what technologies",
      "frameworks",
      " libraries",
    ],
  },
  {
    id: "identity",
    keywords: [
      "who is",
      "who are you",
      "who is this",
      "about him",
      "about you",
      "introduce",
      "yourself",
      "tell me about",
      "developer",
      "profile",
    ],
  },
  {
    id: "role",
    keywords: ["what does he do", "what do you do", "role", "specializ", "specialis", "focus", "profession", "title"],
  },
];

/** Match a question to a specific project by title keywords. */
function matchProject(q: string): (typeof projects)[number] | null {
  const titleSignals: Record<string, string[]> = {
    "Healthcare Tele-Expertise Workflow System": ["tele-expertise", "tele expertise", "medical", "healthcare", "health", "doctor", "patient"],
    "Inventory & Supplier Orders Management System": ["tricol", "inventory", "supplier", "stock", "order", "cump", "warehouse"],
    "Online Store & Inventory Management Platform": ["power eco", "ecommerce", "e-commerce", "store", "shop", "online store", "invoice"],
    "Event Management Web Application": ["beatwave", "event", "music", "concert", "festival"],
  };
  let best: (typeof projects)[number] | null = null;
  let bestHits = 0;
  for (const project of projects) {
    const signals = titleSignals[project.title] ?? [];
    let hits = 0;
    for (const signal of signals) {
      if (q.includes(normalize(signal))) hits++;
    }
    const titleHit = q.includes(normalize(project.title)) ? 3 : 0;
    hits += titleHit;
    if (hits > bestHits) {
      bestHits = hits;
      best = project;
    }
  }
  return bestHits > 0 ? best : null;
}

function pick(primary: string | null, q: string): string {
  const scores = new Map<string, number>();
  const haystack = normalize(q);
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      // token keeps the surrounding spaces added by normalize()
      const token = normalize(kw);
      if (token.trim().length > 1 && haystack.includes(token)) {
        score += intent.weight ?? 1;
      }
    }
    if (score > 0) scores.set(intent.id, score);
  }
  if (primary && scores.has(primary)) return primary;
  if (!scores.size) return "fallback";
  let bestId = "fallback";
  let best = 0;
  for (const [id, score] of scores) {
    if (score > best) {
      best = score;
      bestId = id;
    }
  }
  return bestId;
}

const PROJECT_SIGNALS = [
  "tele-expertise",
  "tele expertise",
  "power eco",
  "beatwave",
  "tricol",
];

/** Answer a natural-language question grounded in the portfolio data. */
export function answerQuestion(question: string): AssistantAnswer {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      text: "Ask me something about this portfolio — for example: “Show me his best projects.”",
      links: SECTION_LINKS,
      followUps: suggestions.slice(0, 4),
    };
  }
  const haystack = normalize(trimmed);
  const primary = PROJECT_SIGNALS.some((signal) => haystack.includes(signal))
    ? "project"
    : null;
  return answerForIntent(pick(primary, trimmed), trimmed);
}

function stackListText(): string {
  return skills
    .map((cat) => `${cat.title}: ${TECH_LIST(cat.items.map((i) => i.name))}`)
    .join("\n");
}

function answerForIntent(id: string, q: string): AssistantAnswer {
  const matchedProject = matchProject(q);

  switch (id) {
    case "greeting":
      return {
        text: `Hello! I'm the portfolio assistant for ${site.name}. I can answer questions about his background, stack, projects, and how to reach him. What would you like to know?`,
        links: SECTION_LINKS,
        followUps: suggestions.slice(0, 3),
      };

    case "thanks":
      return {
        text: "You're welcome! Let me know if you have other questions about the portfolio.",
        links: [],
        followUps: suggestions.slice(3, 5),
      };

    case "cv":
      return {
        text: `Yes — ${site.name}'s CV (PDF) is available for download at /cv.pdf, and the full history is in the Experience section below.`,
        links: [
          { label: "Download CV (PDF)", href: "/cv.pdf" },
          { label: "#experience", href: "#experience" },
        ],
        followUps: [
          "Tell me about his professional experience.",
          "What technologies does he use?",
        ],
      };

    case "availability":
      return {
        text: `This portfolio doesn't publish current availability. ${site.name} is a full-stack developer (Spring Boot & Angular) based in ${site.location} and open to contact through email, LinkedIn, or GitHub — the fastest way to check availability and start a conversation. You can reach him at ${site.email}.`,
        links: [
          { label: `Email ${site.email}`, href: `mailto:${site.email}` },
          { label: "#contact", href: "#contact" },
        ],
        followUps: [
          "How can I contact him?",
          "Can he build a full-stack application?",
        ],
      };

    case "contact":
      return {
        text:
          `You can reach ${site.name} through:\n` +
          socials.map((s) => `• ${s.label}: ${s.href}`).join("\n") +
          `\nEmail: ${site.email}\nThere is also a contact form in the Contact section — it opens a pre-filled email draft via EmailJS.`,
        links: [
          { label: "#contact", href: "#contact" },
          { label: `mailto:${site.email}`, href: `mailto:${site.email}` },
        ],
        followUps: ["What technologies does he use?", "Show me his best projects."],
      };

    case "backend":
      return {
        text:
          `Backend focus:\n` +
          `• Java with Spring Boot, Spring Security, and Hibernate/JPA\n` +
          `• REST API design, layered architecture, authentication and role-based access control\n` +
          `• Also: Jakarta EE (Tomcat), Laravel/PHP, Express.js\n` +
          `• Databases: PostgreSQL, MySQL, MongoDB (SQL & NoSQL modeling)\n` +
          `• Tooling: Maven, Liquibase migrations, MapStruct, Swagger/OpenAPI, Postman`,
        links: [{ label: "#skills", href: "#skills" }],
        followUps: [
          "What frontend technologies does he use?",
          "Which databases does he work with?",
        ],
      };

    case "frontend":
      return {
        text:
          `Frontend work:\n` +
          `• Angular + TypeScript as the primary stack\n` +
          `• React and Vue.js depending on the project\n` +
          `• TailwindCSS, Bootstrap, semantic HTML5/CSS3\n` +
          `• Responsive layouts, accessible interactions, design handoff from Figma`,
        links: [{ label: "#skills", href: "#skills" }],
        followUps: [
          "What backend technologies does he use?",
          "Show me his best projects.",
        ],
      };

    case "databases":
      return {
        text:
          `He works with PostgreSQL and MySQL as primary relational databases, plus MongoDB for document storage. Data modeling, migrations (Liquibase), and Hibernate/JPA mapping are part of his day-to-day backend work.`,
        links: [{ label: "#skills", href: "#skills" }],
        followUps: ["What backend technologies does he use?", "Show me his best projects."],
      };

    case "devops":
      return {
        text:
          `Tooling and workflow: Git & GitHub, Docker, Maven, Liquibase (schema migrations), Swagger/OpenAPI docs, Postman for API testing, Jira for issue tracking, plus CI/CD fundamentals and cloud basics (AWS, Heroku).`,
        links: [{ label: "#skills", href: "#skills" }],
        followUps: ["What technologies does he use?", "Show me his best projects."],
      };

    case "testing":
      return {
        text:
          `Testing is part of his workflow: unit testing with JUnit, TDD practices, and systematic debugging. He cares about validating critical paths — business rules, authorization, and data integrity.`,
        links: [{ label: "#skills", href: "#skills" }],
        followUps: ["What backend technologies does he use?", "Show me his best projects."],
      };

    case "fullstack":
      return {
        text:
          `Yes. ${site.name} builds full-stack applications end to end:\n` +
          `• Backend: Java/Spring Boot (or Laravel/PHP) with REST APIs and Spring Security\n` +
          `• Frontend: Angular/TypeScript (also React, Vue.js)\n` +
          `• Data: PostgreSQL/MySQL + MongoDB, migrations, and DTO mapping\n` +
          `• Delivery: Git, Docker, CI/CD basics, API documentation with Swagger\n\n` +
          `See the Projects section for four full-stack systems he built this way.`,
        links: [
          { label: "#projects", href: "#projects" },
          { label: "#skills", href: "#skills" },
        ],
        followUps: ["Show me his best projects.", "What technologies does he use?"],
      };

    case "project":
      if (matchedProject) return projectAnswer(matchedProject);
      return {
        text:
          `Here are ${projects.length} projects — all with public source code on GitHub:\n` +
          projects
            .map((p, i) => `${i + 1}. ${p.title} (${p.stack.slice(0, 3).join(", ")}) — ${p.repo}`)
            .join("\n") +
          `\nFull details, highlights, and links are in the Projects section.`,
        links: [
          { label: "#projects", href: "#projects" },
          { label: "GitHub profile", href: "https://github.com/Azzedine-zemmari" },
        ],
        followUps: [
          "Tell me about the healthcare tele-expertise system.",
          "What technologies does he use?",
        ],
      };

    case "experience":
      return {
        text:
          `Professional path:\n` +
          journey
            .map((j) => `• ${j.period} — ${j.title}, ${j.org}: ${j.description}`)
            .join("\n\n"),
        links: [{ label: "#experience", href: "#experience" }],
        followUps: [
          "What is his educational background?",
          "What technologies does he use?",
        ],
      };

    case "education":
      return {
        text:
          `Education & training:\n` +
          journey
            .map((j) => `• ${j.period} — ${j.title} (${j.org})`)
            .join("\n") +
          `\nDetails for each stage are in the Experience section.`,
        links: [{ label: "#experience", href: "#experience" }],
        followUps: [
          "Tell me about his professional experience.",
          "Show me his best projects.",
        ],
      };

    case "location":
      return {
        text: `${site.name} is based in ${site.location}. The work itself is source-controlled on GitHub and suitable for remote collaboration.`,
        links: [
          { label: "#contact", href: "#contact" },
          { label: "GitHub", href: "https://github.com/Azzedine-zemmari" },
        ],
        followUps: ["How can I contact him?", "What technologies does he use?"],
      };

    case "languages":
      return {
        text: `Working languages: Arabic (native), French, and English — comfortable in written and spoken communication in a team setting.`,
        links: [],
        followUps: ["Who is this developer?", "What technologies does he use?"],
      };

    case "stack":
      return {
        text: `Full stack, grouped by area:\n${stackListText()}`,
        links: [{ label: "#skills", href: "#skills" }],
        followUps: [
          "What backend technologies does he use?",
          "What frontend technologies does he use?",
        ],
      };

    case "identity":
      return {
        text:
          `${site.name} is a ${site.role} based in ${site.location}, focused on ${site.focus}. ${about.summary} You can explore his projects, stack, and path in the sections below.`,
        links: [
          { label: "#about", href: "#about" },
          { label: "#projects", href: "#projects" },
        ],
        followUps: [
          "What technologies does he use?",
          "Show me his best projects.",
          "Tell me about his professional experience.",
        ],
      };

    case "role":
      return {
        text: `${site.name} works as a ${site.role}, specialised in ${site.focus}: secure Java/Spring Boot backends and Angular/TypeScript frontends, from database design to UI.`,
        links: [
          { label: "#about", href: "#about" },
          { label: "#skills", href: "#skills" },
        ],
        followUps: [
          "What technologies does he use?",
          "Can he build a full-stack application?",
        ],
      };

    default: {
      const project = matchProject(q);
      if (project) return projectAnswer(project);
      const techMatch = skills
        .flatMap((c) => c.items)
        .find((i) => q.includes(normalize(i.name).trim()) && i.name.length > 3);
      if (techMatch) {
        return {
          text: `Yes — ${techMatch.name} is part of his stack. Full list of technologies by area is in the Skills section.`,
          links: [{ label: "#skills", href: "#skills" }],
          followUps: ["What technologies does he use?", "Show me his best projects."],
        };
      }
      return {
        text:
          `I don't have a grounded answer for that one. I can only speak to what is in this portfolio: ${site.name}'s background, stack, projects, experience, and contact details.\nTry one of these:`,
        links: SECTION_LINKS,
        followUps: suggestions.slice(0, 4),
      };
    }
  }
}

function projectAnswer(project: (typeof projects)[number]): AssistantAnswer {
  return {
    text:
      `${project.title}${project.year ? ` (${project.year})` : ""}\n` +
      `${project.summary}\n\n` +
      `Stack: ${project.stack.join(", ")}\n` +
      `Key points:\n${project.highlights.map((h) => `• ${h}`).join("\n")}\n\n` +
      `Source: ${project.repo}`,
    links: [
      { label: "Repository", href: project.repo },
      { label: "#projects", href: "#projects" },
    ],
    followUps: [
      "Show me his best projects.",
      "What technologies does he use?",
    ],
  };
}

export const suggestedQuestions = suggestions;
