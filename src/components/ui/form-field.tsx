export function FormField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  rows,
  as,
  children,
}: {
  label: string;
  name?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  as?: "input" | "textarea";
  children?: React.ReactNode;
}) {
  const className =
    "mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none placeholder:text-ns-muted/60 focus:border-ns-gold";

  return (
    <div className="block">
      <label className="text-xs uppercase tracking-widest text-ns-muted">{label}</label>
      {children ??
        (as === "textarea" ? (
          <textarea
            name={name}
            required={required}
            placeholder={placeholder}
            rows={rows ?? 3}
            className={className}
          />
        ) : (
          <input
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            className={className}
          />
        ))}
    </div>
  );
}

export const inputClassName =
  "mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none placeholder:text-ns-muted/60 focus:border-ns-gold";