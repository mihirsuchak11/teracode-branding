import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-btn border border-border-strong/50 bg-bg-deep px-3 py-2.5 text-sm text-fg transition-colors outline-none placeholder:text-fg-faint disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-fg/20",
        "aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
