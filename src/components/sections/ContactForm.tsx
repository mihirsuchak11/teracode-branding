"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions";
import { Check } from "@/components/ui/icons";

const initial: FormState = { status: "idle" };

const inputCls =
  "w-full rounded-btn border border-border-strong/50 bg-bg-deep px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-border-strong focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium leading-5 text-fg-muted">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 bg-surface p-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Check width={18} height={18} />
        </span>
        <h3 className="text-xl font-semibold text-fg">Message sent.</h3>
        <p className="text-sm leading-5 text-fg-muted">
          Thanks for reaching out — the right team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="bg-surface p-6 md:p-8">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
        <Field label="Full name" htmlFor="contact-name">
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            placeholder="Full name"
            className={inputCls}
          />
        </Field>
        <Field label="Work email" htmlFor="contact-email">
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            placeholder="john@website.com"
            className={inputCls}
          />
        </Field>
        <Field label="Company name" htmlFor="contact-company" className="md:col-span-2">
          <input
            id="contact-company"
            type="text"
            name="company"
            placeholder="Company name"
            className={inputCls}
          />
        </Field>
        <Field label="What can we help with?" htmlFor="contact-topic" className="md:col-span-2">
          <textarea
            id="contact-topic"
            name="topic"
            required
            rows={4}
            placeholder="A few sentences is enough."
            className={`${inputCls} h-[116px] resize-none`}
          />
        </Field>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2.5 text-sm text-fg-muted">
          <input
            type="checkbox"
            name="consent"
            required
            className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-border-strong bg-bg-deep checked:border-brand checked:bg-brand"
          />
          <span>
            I have read and agree to the{" "}
            <Link
              href="/privacy-policy"
              className="text-fg underline underline-offset-2 hover:text-fg-soft"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-8 cursor-pointer items-center justify-center rounded-btn bg-fg-soft px-4 text-sm font-medium text-surface-2 transition-colors hover:bg-fg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit"}
        </button>
      </div>
      {state.status === "error" && (
        <p className="mt-3 text-xs text-danger">{state.message}</p>
      )}
    </form>
  );
}
