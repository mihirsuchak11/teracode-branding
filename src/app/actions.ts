"use server";

export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

/** Honeypot fields mirroring the original Framer form's spam trap. */
const HONEYPOTS = ["website", "company-hp", "subject-hp"];

function isBot(formData: FormData): boolean {
  return HONEYPOTS.some((name) => {
    const v = formData.get(name);
    return typeof v === "string" && v.length > 0;
  });
}

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success" }; // silently drop bots
  const email = formData.get("email");
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email." };
  }
  // TODO: wire to a real backend (Resend, ConvertKit, CRM, ...)
  console.log("[newsletter] subscribe:", email);
  return { status: "success" };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };
  const name = formData.get("name");
  const email = formData.get("email");
  const company = formData.get("company");
  const topic = formData.get("topic");
  const consent = formData.get("consent");

  if (typeof name !== "string" || name.trim().length < 2) {
    return { status: "error", message: "Enter your full name." };
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid work email." };
  }
  if (typeof topic !== "string" || topic.trim().length < 5) {
    return { status: "error", message: "Tell us a bit about your topic." };
  }
  if (consent !== "on") {
    return { status: "error", message: "Please accept the privacy policy." };
  }
  // TODO: wire to a real backend (Resend, Formspree, CRM, ...)
  console.log("[contact] submission:", { name, email, company, topic });
  return { status: "success" };
}
