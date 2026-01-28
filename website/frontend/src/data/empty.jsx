import React from "react";

function Empty({ className = "", ...props }) {
  return (
    <div
      data-slot="empty"
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12 ${className}`}
      {...props}
    />
  );
}

function EmptyHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-header"
      className={`flex max-w-sm flex-col items-center gap-2 text-center ${className}`}
      {...props}
    />
  );
}

function EmptyMedia({ className = "", variant = "default", ...props }) {
  const baseClasses =
    "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0";
  const variantClasses =
    variant === "icon"
      ? "bg-muted text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:h-6 [&_svg:not([class*='size-'])]:w-6"
      : "bg-transparent";

  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
}

function EmptyTitle({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-title"
      className={`text-lg font-medium tracking-tight ${className}`}
      {...props}
    />
  );
}

function EmptyDescription({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-description"
      className={`text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4 ${className}`}
      {...props}
    />
  );
}

function EmptyContent({ className = "", ...props }) {
  return (
    <div
      data-slot="empty-content"
      className={`flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm ${className}`}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};
