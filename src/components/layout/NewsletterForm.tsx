"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type FormState } from "@/app/actions";

const initial: FormState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);

  if (state.status === "success") {
    return <p className="text-sm text-brand">Thanks — you&apos;re subscribed.</p>;
  }

  return (
    <form action={action} className="flex items-center gap-3">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex h-11 w-full max-w-xs items-center rounded-full border border-border-strong/60 bg-bg-deep pl-4 pr-1">
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className="w-full bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-9 shrink-0 cursor-pointer rounded-full bg-fg-soft px-4 text-sm font-medium text-bg transition-colors hover:bg-fg disabled:opacity-50"
        >
          Subscribe
        </button>
      </div>
      {state.status === "error" && <p className="text-xs text-danger">{state.message}</p>}
    </form>
  );
}
