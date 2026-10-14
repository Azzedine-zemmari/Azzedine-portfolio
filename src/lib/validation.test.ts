import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, sanitize, validateContact } from "./validation";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Full-stack role",
  message: "We are hiring for a Spring Boot position on my team.",
};

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("requires every field", () => {
    const errors = validateContact({ name: "", email: "", subject: "", message: "" });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.subject).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("rejects malformed emails", () => {
    expect(validateContact({ ...valid, email: "not-an-email" }).email).toContain(
      "valid email",
    );
  });

  it("enforces minimum lengths", () => {
    expect(validateContact({ ...valid, name: "ab" }).name).toContain("at least");
    expect(validateContact({ ...valid, message: "short" }).message).toContain(
      String(CONTACT_LIMITS.message.min),
    );
  });

  it("enforces maximum message length", () => {
    expect(
      validateContact({ ...valid, message: "x".repeat(1001) }).message,
    ).toContain("under");
  });
});

describe("sanitize", () => {
  it("escapes HTML-significant characters", () => {
    const dirty = `"><script>alert(1)</script>&'`;
    const clean = sanitize(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).toContain("&lt;script&gt;");
    expect(clean).toContain("&quot;");
    expect(clean).toContain("&#39;");
    expect(clean).toContain("&amp;");
  });
});
