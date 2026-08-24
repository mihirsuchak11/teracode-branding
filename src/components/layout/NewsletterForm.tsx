"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial: FormState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);

  if (state.status === "success") {
    return <p className="text-sm text-brand">Thanks — you&apos;re subscribed.</p>;
  }

  return (
    <form action={action} className="flex items-center gap-3">
      <Input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex h-11 w-full max-w-xs items-center rounded-full border border-border-strong/60 bg-bg-deep pl-4 pr-1">
        <Input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          disabled={pending}
          size="sm"
          className="h-9 shrink-0 rounded-full"
        >
          Subscribe
        </Button>
      </div>
      {state.status === "error" && <p className="text-xs text-danger">{state.message}</p>}
    </form>
  );
}
