import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/* ------------------------------------------------------------------ layout */

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const width = {
    narrow: "max-w-3xl",
    default: "max-w-7xl",
    wide: "max-w-[88rem]",
  }[size];
  return <div className={`mx-auto w-full ${width} px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

/* --------------------------------------------------------------- typography */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-taxi-500/15 px-3.5 py-1.5 text-xs font-bold tracking-[0.16em] text-night-700 uppercase">
      <span className="inline-block size-1.5 rounded-full bg-taxi-600" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const alignment = align === "center" ? "text-center mx-auto items-center" : "items-start";
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-extrabold text-night-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {lead && (
        <p className="text-base leading-relaxed text-night-500 sm:text-lg">{lead}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ buttons */

type ButtonVariant = "primary" | "dark" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-taxi-500 text-night-900 hover:bg-taxi-400 shadow-[0_10px_30px_-10px_rgba(255,196,0,0.7)]",
  dark: "bg-night-900 text-taxi-400 hover:bg-night-800 hover:text-taxi-300 shadow-lift",
  outline:
    "border-2 border-night-900 text-night-900 hover:bg-night-900 hover:text-taxi-400",
  ghost: "text-night-700 hover:bg-night-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  extra = ""
) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55",
    variantClasses[variant],
    sizeClasses[size],
    extra,
  ].join(" ");
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
}) {
  const cls = buttonClass(variant, size, className);
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------- cards */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-night-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-taxi-500/60 hover:shadow-lift ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "yellow",
}: {
  children: ReactNode;
  tone?: "yellow" | "blue" | "dark" | "green" | "grey" | "red";
}) {
  const tones = {
    yellow: "bg-taxi-500/20 text-taxi-800",
    blue: "bg-access-500/15 text-access-700",
    dark: "bg-night-900 text-taxi-400",
    green: "bg-emerald-500/15 text-emerald-700",
    grey: "bg-night-200 text-night-600",
    red: "bg-red-500/15 text-red-700",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${tones}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- alerts */

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "error" | "warning";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-access-500/40 bg-access-500/10 text-access-700",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800",
    error: "border-red-500/40 bg-red-500/10 text-red-800",
    warning: "border-taxi-600/40 bg-taxi-500/15 text-taxi-900",
  }[tone];
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones}`} role={tone === "error" ? "alert" : "status"}>
      {title && <p className="font-bold">{title}</p>}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
