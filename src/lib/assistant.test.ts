import { describe, expect, it } from "vitest";
import { answerQuestion } from "./assistant";

describe("assistant", () => {
  it("answers identity questions with real profile data", () => {
    const reply = answerQuestion("Who is this developer?");
    expect(reply.text).toContain("Zemmari Azzedine");
    expect(reply.text).toContain("Full-Stack Developer");
    expect(reply.links.some((l) => l.href === "#about")).toBe(true);
  });

  it("lists real projects with repository links", () => {
    const reply = answerQuestion("Show me his best projects.");
    expect(reply.text).toContain("Healthcare Tele-Expertise Workflow System");
    expect(reply.text).toContain("github.com/Azzedine-zemmari");
    expect(reply.links.some((l) => l.href === "#projects")).toBe(true);
  });

  it("recognises a specific project by signal word", () => {
    const reply = answerQuestion("Tell me about the tricol project");
    expect(reply.text).toContain("Inventory & Supplier Orders Management System");
    expect(reply.links.some((l) => l.href.includes("/Tricol"))).toBe(true);
  });

  it("describes backend stack", () => {
    const reply = answerQuestion("What backend technologies does he work with?");
    expect(reply.text).toContain("Spring Boot");
    expect(reply.text).toContain("Hibernate");
  });

  it("describes frontend stack", () => {
    const reply = answerQuestion("What frontend stack does he use?");
    expect(reply.text).toContain("Angular");
  });

  it("answers contact intent with real channels", () => {
    const reply = answerQuestion("How can I contact him?");
    expect(reply.text).toContain("azzedinezemmari@gmail.com");
    expect(reply.text).toContain("wa.me/212767228591");
  });

  it("does not fabricate availability — states the portfolio doesn't publish it", () => {
    const reply = answerQuestion("Is he available for opportunities?");
    expect(reply.text.toLowerCase()).toContain("availability");
    expect(reply.text).toContain("azzedinezemmari@gmail.com");
  });

  it("answers full-stack capability grounded in the projects", () => {
    const reply = answerQuestion("Can he build a full-stack application?");
    expect(reply.text).toContain("Spring Boot");
    expect(reply.text).toContain("Angular");
    expect(reply.text).toContain("Projects");
  });

  it("returns experience timeline from real data", () => {
    const reply = answerQuestion("Tell me about his professional experience.");
    expect(reply.text).toContain("Youcode");
    expect(reply.text).toContain("Freelance");
  });

  it("is honest when it does not know", () => {
    const reply = answerQuestion("What is his favourite pizza topping?");
    expect(reply.text.toLowerCase()).toContain("don't have a grounded answer");
    expect(reply.followUps.length).toBeGreaterThan(0);
  });

  it("always offers follow-up suggestions", () => {
    const reply = answerQuestion("What technologies does he use?");
    expect(reply.text).toContain("PostgreSQL");
    expect(reply.followUps.length).toBeGreaterThan(0);
  });
});
