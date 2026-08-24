"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitContact, type FormState } from "@/app/actions";
import { Check } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HiddenField } from "@/components/ui/hidden-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: FormState = { status: "idle" };

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
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [consent, setConsent] = useState(false);

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
      <Input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
        <Field label="Full name" htmlFor="contact-name">
          <Input
            id="contact-name"
            type="text"
            name="name"
            required
            placeholder="Full name"
          />
        </Field>
        <Field label="Work email" htmlFor="contact-email">
          <Input
            id="contact-email"
            type="email"
            name="email"
            required
            placeholder="john@website.com"
          />
        </Field>
        <Field label="Company name" htmlFor="contact-company" className="md:col-span-2">
          <Input
            id="contact-company"
            type="text"
            name="company"
            placeholder="Company name"
          />
        </Field>
        <Field label="What can we help with?" htmlFor="contact-topic" className="md:col-span-2">
          <Textarea
            id="contact-topic"
            name="topic"
            required
            rows={4}
            placeholder="A few sentences is enough."
            className="h-[116px] resize-none"
          />
        </Field>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <Label htmlFor="contact-consent" className="flex items-center gap-2.5 text-sm text-fg-muted">
          <Checkbox
            id="contact-consent"
            checked={consent}
            onCheckedChange={(value) => setConsent(value === true)}
            required
          />
          <HiddenField name="consent" value={consent ? "on" : ""} />
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
        </Label>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Submitting..." : "Submit"}
        </Button>
      </div>
      {state.status === "error" && (
        <p className="mt-3 text-xs text-danger">{state.message}</p>
      )}
    </form>
  );
}
