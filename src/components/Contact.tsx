import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Github, Linkedin, MessageCircle, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useContent, useRich, useT } from "../i18n";
import type { UiKey } from "../i18n";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import {
  contactConfigReady,
  sanitize,
  validateContact,
} from "../lib/validation";
import type { ContactErrors, ContactMessages, ContactPayload } from "../lib/validation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function SocialLinks({ iconClass = "h-5 w-5" }: { iconClass?: string }) {
  const { socials } = useContent();
  const icons: Record<string, React.ReactNode> = {
    GitHub: <Github className={iconClass} aria-hidden="true" />,
    LinkedIn: <Linkedin className={iconClass} aria-hidden="true" />,
    WhatsApp: <MessageCircle className={iconClass} aria-hidden="true" />,
    Discord: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
  };
  return (
    <ul className="flex gap-2">
      {socials.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            aria-label={`${social.label}: ${social.handle}`}
            title={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded border border-line-2 text-mist transition-colors hover:border-neon hover:text-neon"
          >
            {icons[social.label]}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Contact() {
  const t = useT();
  const rich = useRich();
  const { site, socials } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    tl.fromTo(
      section.querySelectorAll(".contact-panel"),
      { y: 50, opacity: 0, rotationX: 10 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
      0
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="scroll-mt-20 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          kicker={t("contact.kicker")}
          title={rich(t("contact.title"))}
          lead={t("contact.lead")}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Reveal className="contact-panel">
            <div className="panel panel-hover flex h-full flex-col p-6 md:p-8">
              <a
                href={`mailto:${site.email}`}
                className="group font-mono text-lg text-chalk md:text-xl"
              >
                <span className="text-neon">$</span> {site.email}
                <span className="ms-2 text-dim transition-colors group-hover:text-neon">
                  ↗
                </span>
              </a>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {t("contact.chatNote")}
              </p>

              <div className="mt-6 grid gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel panel-hover flex items-center justify-between gap-4 px-4 py-3 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                    <span className="relative flex items-center gap-3">
                      <span className="text-neon" aria-hidden="true">
                        ›
                      </span>
                      <span className="font-mono text-sm text-chalk">
                        {social.label}
                      </span>
                    </span>
                    <span className="relative truncate font-mono text-xs text-dim">
                      {social.handle}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-8">
                <SocialLinks />
                <a className="btn" href="/cv.pdf" download="ZEMMARI_AZZEDINE_CV.pdf">
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("contact.cv")}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="contact-panel">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const EMPTY: ContactPayload = { name: "", email: "", subject: "", message: "" };

const ERROR_KEYS: Array<[keyof ContactMessages, UiKey]> = [
  ["nameRequired", "contact.err.nameRequired"],
  ["nameMin", "contact.err.nameMin"],
  ["nameMax", "contact.err.nameMax"],
  ["emailRequired", "contact.err.emailRequired"],
  ["emailInvalid", "contact.err.emailInvalid"],
  ["subjectRequired", "contact.err.subjectRequired"],
  ["subjectShort", "contact.err.subjectShort"],
  ["subjectMax", "contact.err.subjectMax"],
  ["messageRequired", "contact.err.messageRequired"],
  ["messageMin", "contact.err.messageMin"],
  ["messageMax", "contact.err.messageMax"],
];

function ContactForm() {
  const t = useT();
  const { site } = useContent();
  const [data, setData] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const configured = contactConfigReady();

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null);
    if (honeypot?.value.trim()) {
      setStatus("sent");
      return;
    }
    const messages = ERROR_KEYS.reduce(
      (acc, [field, key]) => {
        acc[field] = t(key);
        return acc;
      },
      {} as ContactMessages,
    );
    const validation = validateContact(data, messages);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    if (!configured) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: sanitize(data.name.trim()),
          email: sanitize(data.email.trim()),
          subject: sanitize(data.subject.trim()),
          message: sanitize(data.message.trim()),
        },
        publicKey,
      );
      setStatus("sent");
      setData(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="panel flex h-full flex-col gap-5 p-6 md:p-8" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="eyebrow mb-2 block text-mist">
            {t("contact.form.name")}
          </label>
          <input
            id="contact-name"
            name="name"
            className="field"
            placeholder={t("contact.form.namePlaceholder")}
            value={data.name}
            onChange={onChange}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          {errors.name && (
            <p id="err-name" className="mt-1.5 font-mono text-xs text-danger">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="eyebrow mb-2 block text-mist">
            {t("contact.form.email")}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="field"
            placeholder={t("contact.form.emailPlaceholder")}
            value={data.email}
            onChange={onChange}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {errors.email && (
            <p id="err-email" className="mt-1.5 font-mono text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="eyebrow mb-2 block text-mist">
          {t("contact.form.subject")}
        </label>
        <input
          id="contact-subject"
          name="subject"
          className="field"
          placeholder={t("contact.form.subjectPlaceholder")}
          value={data.subject}
          onChange={onChange}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "err-subject" : undefined}
        />
        {errors.subject && (
          <p id="err-subject" className="mt-1.5 font-mono text-xs text-danger">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="flex-1">
        <label htmlFor="contact-message" className="eyebrow mb-2 block text-mist">
          {t("contact.form.message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          className="field resize-y"
          placeholder={t("contact.form.messagePlaceholder")}
          value={data.message}
          onChange={onChange}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "err-message" : undefined}
        />
        {errors.message && (
          <p id="err-message" className="mt-1.5 font-mono text-xs text-danger">
            {errors.message}
          </p>
        )}
      </div>

      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            t("contact.sending")
          ) : (
            <>
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {t("contact.send")}
            </>
          )}
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`font-mono text-xs ${
            status === "error"
              ? "text-danger"
              : status === "sent"
                ? "text-neon"
                : "text-dim"
          }`}
        >
          {status === "sent" && t("contact.status.sent")}
          {status === "error" &&
            (configured
              ? t("contact.status.failed", { email: site.email })
              : t("contact.status.unconfigured", { email: site.email }))}
          {status === "idle" && t("contact.status.idle", { email: site.email })}
        </p>
      </div>
    </form>
  );
}