/**
 * Single source of truth for every piece of portfolio content.
 *
 * Everything the UI, the terminal, the assistant, and the structured data
 * render comes from this file. Only real, verified information lives here —
 * no invented metrics, clients, or experience.
 */

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface SkillItem {
  name: string;
  /** Optional note, e.g. level of familiarity. Kept factual. */
  note?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  items: SkillItem[];
}

export interface Project {
  title: string;
  summary: string;
  stack: string[];
  year?: string;
  repo: string;
  demo?: string;
  highlights: string[];
}

export interface JourneyEntry {
  period: string;
  title: string;
  org: string;
  description: string;
  stack: string[];
  highlights: string[];
  current?: boolean;
}

export const site = {
  name: "Zemmari Azzedine",
  initials: "ZA",
  role: "Full-Stack Developer",
  focus: "Spring Boot & Angular",
  tagline: "I build secure, scalable web applications end to end.",
  url: "https://azzedine-portfolio.vercel.app",
  email: "azzedinezemmari@gmail.com",
  location: "Casablanca, Morocco",
  phoneDisplay: "+212 767 228 591",
} as const;

export const about = {
  heading: "About",
  summary:
    "Full-stack developer focused on Java (Spring Boot) backends and Angular frontends. I work across the whole stack: REST API design, authentication and authorization, database modeling, and clean component-based UIs.",
  paragraphs: [
    "My main focus is building secure, maintainable applications — from relational schema design and business logic on the server to responsive, accessible interfaces on the client. Most of my backend work is Java with Spring Boot, Spring Security, and Hibernate/JPA; on the frontend I work with Angular and TypeScript, plus React and Vue.js depending on the project.",
    "I enjoy the parts of the job that keep systems reliable: writing clear REST contracts, structuring code so features stay easy to change, validating data, and testing critical paths. I have also built full-stack platforms with Laravel and PHP, which gave me a solid grounding in MVC architecture and role-based access control.",
    "I am comfortable working in a team with Git, code review, and agile practices, and I keep sharpening my skills through hands-on projects and continuous learning.",
  ],
  facts: [
    { label: "Focus", value: "Full-stack web development" },
    { label: "Backend", value: "Java · Spring Boot · REST APIs" },
    { label: "Frontend", value: "Angular · TypeScript · React" },
    { label: "Location", value: site.location },
    { label: "Languages", value: "Arabic, French, English" },
  ],
};

export const skills: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    items: [
      { name: "Java" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "SQL" },
      { name: "PHP" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      { name: "Spring Boot" },
      { name: "Spring Security" },
      { name: "Spring Data JPA / Hibernate" },
      { name: "Jakarta EE" },
      { name: "Laravel" },
      { name: "Express.js" },
      { name: "REST API design" },
      { name: "Layered architecture" },
      { name: "Microservices fundamentals" },
      { name: "Authentication & RBAC" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    items: [
      { name: "Angular" },
      { name: "React" },
      { name: "Vue.js" },
      { name: "TypeScript" },
      { name: "TailwindCSS" },
      { name: "Bootstrap" },
      { name: "HTML5 & CSS3" },
      { name: "Responsive design" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    items: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "SQL & NoSQL data modeling" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tooling",
    items: [
      { name: "Git & GitHub" },
      { name: "Docker" },
      { name: "Kubernetes", note: "basics" },
      { name: "Maven" },
      { name: "Liquibase" },
      { name: "MapStruct" },
      { name: "Swagger / OpenAPI" },
      { name: "Postman" },
      { name: "Jira" },
      { name: "CI/CD fundamentals" },
      { name: "Cloud basics (AWS, Heroku)" },
    ],
  },
  {
    id: "testing",
    title: "Testing & Practices",
    items: [
      { name: "JUnit" },
      { name: "Unit testing / TDD" },
      { name: "Agile workflow" },
      { name: "Code review" },
      { name: "Debugging" },
    ],
  },
  {
    id: "design",
    title: "Design & Other",
    items: [
      { name: "Figma" },
      { name: "UI prototyping" },
      { name: "Technical documentation" },
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Healthcare Tele-Expertise Workflow System",
    summary:
      "A complete medical tele-expertise system that manages the full patient journey: onboarding, consultations, expertise requests between nurses, general practitioners and specialists, scheduling, and delivery of medical opinions. Includes secure authentication and advanced business logic.",
    stack: ["Jakarta EE", "Tomcat", "PostgreSQL", "Hibernate", "Maven"],
    year: "2025",
    repo: "https://github.com/Azzedine-zemmari/tele-expertise-medicale",
    highlights: [
      "Multi-actor workflow: nurses, general practitioners, specialists",
      "Expertise request, scheduling and medical opinion delivery",
      "Secure authentication and role-based access",
      "Persistence layer with Hibernate over PostgreSQL",
    ],
  },
  {
    title: "Inventory & Supplier Orders Management System",
    summary:
      "Application for managing supplier orders, products, stock movements, and inventory valuation (CUMP — coût unitaire moyen pondéré). Built as a layered Spring Boot service with automatic database migrations and generated API documentation.",
    stack: [
      "Spring Boot",
      "Spring Data JPA",
      "MapStruct",
      "Liquibase",
      "Swagger",
      "MySQL",
    ],
    repo: "https://github.com/Azzedine-zemmari/Tricol",
    highlights: [
      "Supplier order and stock movement tracking",
      "Weighted average cost (CUMP) inventory valuation",
      "Version-controlled schema changes with Liquibase",
      "Interactive API docs with Swagger/OpenAPI",
    ],
  },
  {
    title: "Online Store & Inventory Management Platform",
    summary:
      "Full-stack e-commerce platform with Vue.js on the frontend, Laravel on the backend, and PostgreSQL as the database. Covers authentication, shopping cart, order processing, invoicing, and role-based access for administrators, sales staff, and product managers.",
    stack: ["Vue.js", "Laravel", "PostgreSQL", "Laravel Sanctum"],
    repo: "https://github.com/Azzedine-zemmari/Power_Eco",
    highlights: [
      "Token authentication with Laravel Sanctum",
      "Role-based access for admins, sales and product managers",
      "Excel product import and PDF invoice generation",
      "Component-based Vue.js frontend over a structured MVC backend",
    ],
  },
  {
    title: "Event Management Web Application",
    summary:
      "A web platform for music event management connecting organizers, artists, attendees and administrators. Supports creating, managing, and participating in concerts, festivals, and private events through a modern interface.",
    stack: ["Laravel", "TailwindCSS", "PostgreSQL", "JavaScript"],
    repo: "https://github.com/Azzedine-zemmari/THE_Beatwave",
    highlights: [
      "Event creation and management for organizers",
      "Artist and attendee participation flows",
      "Administration dashboard",
      "Responsive UI built with TailwindCSS",
    ],
  },
];

export const journey: JourneyEntry[] = [
  {
    period: "May 2026 — Present",
    title: "Full-Stack Developer (Intern)",
    org: "Eurofive",
    description:
      "Full-stack development on an enterprise project-management platform for the banking sector, used by large clients such as BMCE.",
    stack: ["Java 17", "Spring Boot", "JPA/Hibernate", "Angular", "SCSS", "PostgreSQL", "Keycloak", "Podman","OpenShift"],
    highlights: [
      "Active contribution to an enterprise project-management platform for the banking sector, used by large clients such as BMCE.",
      "Full-stack development with Spring Boot and Angular: REST APIs and PostgreSQL integration.",
      "Testing, access security with Keycloak, containerization with Podman, and deployments.",
    ],
    current: true,
  },
  {
    period: "May 2025 — Jul 2025",
    title: "Full-Stack Developer (Intern)",
    org: "Atrait Technologies",
    description:
      "Contributed to an e-commerce platform for electrical products and renewable energy.",
    stack: ["Laravel", "Vue.js", "PostgreSQL", "Docker", "Tailwind CSS","Git & GitHub", "REST APIs" ],
    highlights: [
      "Contributed to an e-commerce platform dedicated to electrical products and renewable energy.",
      "Backend development, business logic and frontend interfaces with Laravel, PostgreSQL, Vue.js and Tailwind CSS.",
    ],
  },
  {
    period: "Mar 2023 — Apr 2023",
    title: "Frontend Developer (Intern)",
    org: "Salvia",
    description:
      "Built React.js interfaces and integrated REST APIs for an ERP platform.",
    stack: ["React.js", "Tailwind CSS","HTML","TypeScript","REST APIs" , "Agile workflow" , "Git & GitHub"],
    highlights: [
      "Built React.js interfaces and integrated REST APIs in an Agile team for an ERP platform.",
    ],
  },
];

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Azzedine-zemmari",
    handle: "@Azzedine-zemmari",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zemmari-azzedine-039a23210/",
    handle: "in/zemmari-azzedine",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/212767228591",
    handle: "+212 767 228 591",
  },
  {
    label: "Discord",
    href: "https://discord.com/users/950346993706864650",
    handle: "950346993706864650",
  },
];

export const navSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "engineering", label: "Engineering" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const suggestions = [
  "Who is this developer?",
  "What technologies does he use?",
  "Show me his best projects.",
  "Tell me about his professional experience.",
  "What backend and frontend technologies does he work with?",
  "Can he build a full-stack application?",
  "How can I contact him?",
];

export const allTechNames: string[] = skills.flatMap((c) =>
  c.items.map((i) => i.name),
);
