import {
  about,
  journey,
  navSections,
  projects,
  site,
  skills,
  socials,
  suggestions,
} from "../data/portfolio";
import type {
  JourneyEntry,
  Project,
  SkillCategory,
  SocialLink,
} from "../data/portfolio";
import type { Locale } from "./locale";

/**
 * Localized portfolio content. The English layer reuses `data/portfolio.ts`
 * verbatim (no text is copied); French and Arabic translate the parts that
 * carry meaning while keeping technology names, URLs, emails and the person's
 * name identical across every locale.
 */

export interface SiteInfo {
  name: string;
  initials: string;
  role: string;
  focus: string;
  tagline: string;
  url: string;
  email: string;
  location: string;
  phoneDisplay: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface AboutContent {
  heading: string;
  summary: string;
  paragraphs: string[];
  facts: Fact[];
}

export interface CoreContent {
  site: SiteInfo;
  about: AboutContent;
  skills: SkillCategory[];
  projects: Project[];
  journey: JourneyEntry[];
  socials: SocialLink[];
  navSections: { id: string; label: string }[];
  suggestions: string[];
}

const en: CoreContent = {
  site: {
    name: site.name,
    initials: site.initials,
    role: site.role,
    focus: site.focus,
    tagline: site.tagline,
    url: site.url,
    email: site.email,
    location: site.location,
    phoneDisplay: site.phoneDisplay,
  },
  about: {
    heading: about.heading,
    summary: about.summary,
    paragraphs: [...about.paragraphs],
    facts: about.facts.map((fact) => ({ ...fact })),
  },
  skills: skills.map((category) => ({
    ...category,
    items: category.items.map((item) => ({ ...item })),
  })),
  projects: projects.map((project) => ({
    ...project,
    stack: [...project.stack],
    highlights: [...project.highlights],
  })),
  journey: journey.map((entry) => ({ ...entry })),
  socials: socials.map((social) => ({ ...social })),
  navSections: navSections.map((section) => ({
    id: section.id,
    label: section.label,
  })),
  suggestions: [...suggestions],
};

/* ------------------------------------------------------------------ */
/* Arabic                                                              */
/* ------------------------------------------------------------------ */

const AR_SKILL_TITLES: Record<string, string> = {
  languages: "اللغات",
  backend: "الخادم",
  frontend: "الواجهة",
  databases: "قواعد البيانات",
  devops: "العمليات والأدوات",
  testing: "الاختبارات والممارسات",
  design: "التصميم وأخرى",
};

const AR_SKILL_NOTES: Record<string, string> = {
  Kubernetes: "أساسيات",
};

const AR_PROJECTS: Array<Pick<Project, "title" | "summary" | "highlights">> = [
  {
    title: "نظام سير عمل الاستشارة الطبية عن بُعد",
    summary:
      "نظام متكامل للاستشارة الطبية عن بُعد يدير رحلة المريض كاملة: التسجيل، والاستشارات، وطلبات الخبرة بين الممرضين والأطباء العامين والمتخصصين، والجدولة، وتسليم الآراء الطبية. يتضمّن مصادقة آمنة ومنطق أعمال متقدّمًا.",
    highlights: [
      "سير عمل متعدد الأطراف: ممرضون، أطباء عامون، متخصصون",
      "طلب الخبرة والجدولة وتسليم الآراء الطبية",
      "مصادقة آمنة ووصول حسب الأدوار",
      "طبقة استمرارية بـ Hibernate فوق PostgreSQL",
    ],
  },
  {
    title: "نظام إدارة المخزون وطلبات المورّدين",
    summary:
      "تطبيق لإدارة طلبات المورّدين والمنتجات وحركات المخزون وتقييمه (CUMP — متوسط التكلفة المرجّح). مبني كخدمة Spring Boot طبقية مع ترحيلات تلقائية لقاعدة البيانات وتوثيق مُولَّد لواجهات API.",
    highlights: [
      "تتبّع طلبات المورّدين وحركات المخزون",
      "تقييم المخزون بمتوسط التكلفة المرجّح (CUMP)",
      "تغييرات مخطط مُحكمة الإصدار باستخدام Liquibase",
      "توثيق تفاعلي لواجهات API باستخدام Swagger/OpenAPI",
    ],
  },
  {
    title: "منصّة متجر إلكتروني وإدارة المخزون",
    summary:
      "منصّة تجارة إلكترونية متكاملة بـ Vue.js على الواجهة و Laravel على الخادم و PostgreSQL قاعدةً للبيانات. تغطّي المصادقة وسلة التسوق ومعالجة الطلبات والفوترة والوصول حسب الأدوار للمسؤولين وموظفي المبيعات ومسؤولي المنتجات.",
    highlights: [
      "مصادقة بالرموز المميزة باستخدام Laravel Sanctum",
      "وصول حسب الأدوار للمسؤولين والمبيعات ومسؤولي المنتجات",
      "استيراد المنتجات من Excel وتوليد فواتير PDF",
      "واجهة Vue.js مبنية على المكوّنات فوق خادم MVC منظّم",
    ],
  },
  {
    title: "تطبيق ويب لإدارة الفعاليات",
    summary:
      "منصّة ويب لإدارة الفعاليات الموسيقية تربط المنظمين والفنانين والحضور والمسؤولين. تدعم إنشاء وإدارة والمشاركة في الحفلات والمهرجانات والفعاليات الخاصة عبر واجهة حديثة.",
    highlights: [
      "إنشاء وإدارة الفعاليات للمنظمين",
      "مسارات مشاركة الفنانين والحضور",
      "لوحة تحكم إدارية",
      "واجهة متجاوبة مبنية بـ TailwindCSS",
    ],
  },
];

const AR_JOURNEY: Array<{
  title: string;
  description: string;
  org?: string;
}> = [
  {
    title: "تدريب مطوّر متكامل",
    description:
      "برنامج شامل في تطوير الويب وتقنيات الواجهة والخادم وحلّ المشكلات. عمل يومي قائم على المشاريع باستخدام Java و Spring Boot و Angular وقواعد البيانات والاختبارات والممارسات الأجِلة وأساسيات CI/CD.",
  },
  {
    title: "مطوّر مستقل",
    org: "تعلّم ذاتي ومشاريع مستقلة",
    description:
      "العمل على مشاريع واقعية لتقوية مهارات تطوير الويب والبرمجة: Vue.js و React و TypeScript و Node.js/Express و PostgreSQL و MongoDB والتصميم المتجاوب وأساسيات Docker والتواصل مع العملاء.",
  },
  {
    title: "دبلوم تقني متخصّص",
    description:
      "أساسيات البرمجة وتطوير الويب وإدارة قواعد البيانات: HTML/CSS و JavaScript و TailwindCSS و Bootstrap و PHP/Laravel و React و Node.js و Express و MySQL وواجهات REST و Git وأساسيات المنهجيات الأجِلة.",
  },
  {
    title: "الباكالوريا — علوم الحياة والأرض",
    description: "تخصّص في علوم الحياة والأرض. تخرّج بمرتبة الشرف.",
  },
];

const AR_NAV: Record<string, string> = {
  home: "الرئيسية",
  about: "نبذة",
  skills: "المهارات",
  engineering: "الهندسة",
  projects: "المشاريع",
  experience: "الخبرة",
  contact: "تواصل",
};

const ar: CoreContent = {
  site: {
    ...site,
    role: "مطوّر متكامل",
    focus: site.focus,
    tagline: "أبني تطبيقات ويب آمنة وقابلة للتوسّع من البداية إلى النهاية.",
    location: "الدار البيضاء، المغرب",
  },
  about: {
    heading: "نبذة",
    summary:
      "مطوّر متكامل متخصّص في خوادم Java (Spring Boot) وواجهات Angular. أعمل على كامل المنظومة: تصميم واجهات REST، والمصادقة والتفويض، ونمذجة قواعد البيانات، وواجهات نظيفة مبنية على المكوّنات.",
    paragraphs: [
      "تركيزي الأساسي هو بناء تطبيقات آمنة وقابلة للصيانة — من تصميم المخطط العلائقي ومنطق الأعمال على الخادم إلى واجهات متجاوبة وسهلة الوصول على العميل. معظم عملي الخلفي هو Java مع Spring Boot و Spring Security و Hibernate/JPA؛ وعلى الواجهة أعمل بـ Angular و TypeScript، إضافة إلى React و Vue.js حسب المشروع.",
      "أستمتع بالجوانب التي تُبقي الأنظمة موثوقة: كتابة عقود REST واضحة، وتنظيم الكود بحيث تظل الميزات سهلة التعديل، والتحقق من البيانات، واختبار المسارات الحرجة. كما بنيت منصّات متكاملة بـ Laravel و PHP، ما منحني أساسًا متينًا في معمارية MVC والتحكم في الوصول حسب الأدوار.",
      "أرتاح للعمل ضمن فريق باستخدام Git ومراجعة الكود والممارسات الأجِلة، وأواصل صقل مهاراتي عبر مشاريع تطبيقية وتعلّم مستمر.",
    ],
    facts: [
      { label: "التخصص", value: "تطوير ويب متكامل" },
      { label: "الخادم", value: "Java · Spring Boot · واجهات REST" },
      { label: "الواجهة", value: "Angular · TypeScript · React" },
      { label: "الموقع", value: "الدار البيضاء، المغرب" },
      { label: "اللغات", value: "العربية، الفرنسية، الإنجليزية" },
    ],
  },
  skills: skills.map((category) => ({
    ...category,
    title: AR_SKILL_TITLES[category.id] ?? category.title,
    items: category.items.map((item) =>
      item.note
        ? { ...item, note: AR_SKILL_NOTES[item.name] ?? item.note }
        : { ...item },
    ),
  })),
  projects: projects.map((project, i) => ({ ...project, ...AR_PROJECTS[i] })),
  journey: journey.map((entry, i) => ({ ...entry, ...AR_JOURNEY[i] })),
  socials: socials.map((social) => ({ ...social })),
  navSections: navSections.map((section) => ({
    id: section.id,
    label: AR_NAV[section.id] ?? section.label,
  })),
  suggestions: [
    "من هو هذا المطوّر؟",
    "ما التقنيات التي يستخدمها؟",
    "أرني أفضل مشاريعه.",
    "حدّثني عن خبرته المهنية.",
    "ما تقنيات الخادم والواجهة التي يعمل بها؟",
    "هل يستطيع بناء تطبيق متكامل؟",
    "كيف أتواصل معه؟",
  ],
};

export const CONTENT: Record<Locale, CoreContent> = { en, ar };
