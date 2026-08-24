import * as React from "react";

function HiddenField({
  name,
  value,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "value"> & {
  name: string;
  value: string | number | boolean | null | undefined;
}) {
  return (
    <input
      type="hidden"
      data-slot="hidden-field"
      name={name}
      value={value == null ? "" : String(value)}
      {...props}
    />
  );
}

export { HiddenField };
