import React from "react";
import { Separator } from "@/components/ui/separator"; // keep this if you have a separator component
import { Label } from "@/components/ui/label"; // keep this if you have a Label component

function FieldSet({ className = "", ...props }) {
  return (
    <fieldset
      data-slot="field-set"
      className={`flex flex-col gap-6 ${className}`}
      {...props}
    />
  );
}

function FieldLegend({ className = "", variant = "legend", ...props }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={`mb-3 font-medium ${
        variant === "legend" ? "text-base" : "text-sm"
      } ${className}`}
      {...props}
    />
  );
}

function FieldGroup({ className = "", ...props }) {
  return (
    <div
      data-slot="field-group"
      className={`flex w-full flex-col gap-7 ${className}`}
      {...props}
    />
  );
}

function Field({ className = "", orientation = "vertical", ...props }) {
  const orientationClasses =
    orientation === "horizontal"
      ? "flex-row items-center"
      : "flex-col w-full";

  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={`flex gap-3 ${orientationClasses} ${className}`}
      {...props}
    />
  );
}

function FieldContent({ className = "", ...props }) {
  return (
    <div
      data-slot="field-content"
      className={`flex flex-1 flex-col gap-1.5 leading-snug ${className}`}
      {...props}
    />
  );
}

function FieldLabel({ className = "", ...props }) {
  return (
    <Label
      data-slot="field-label"
      className={`flex w-fit gap-2 leading-snug ${className}`}
      {...props}
    />
  );
}

function FieldTitle({ className = "", ...props }) {
  return (
    <div
      data-slot="field-label"
      className={`flex w-fit items-center gap-2 text-sm font-medium leading-snug ${className}`}
      {...props}
    />
  );
}

function FieldDescription({ className = "", ...props }) {
  return (
    <p
      data-slot="field-description"
      className={`text-muted-foreground text-sm font-normal leading-normal ${className}`}
      {...props}
    />
  );
}

function FieldSeparator({ children, className = "", ...props }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={`relative -my-2 h-5 text-sm ${className}`}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({ className = "", children, errors, ...props }) {
  let content = children;

  if (!content && errors?.length) {
    if (errors.length === 1 && errors[0]?.message) {
      content = errors[0].message;
    } else {
      content = (
        <ul className="ml-4 flex list-disc flex-col gap-1">
          {errors.map(
            (error, idx) => error?.message && <li key={idx}>{error.message}</li>
          )}
        </ul>
      );
    }
  }

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={`text-destructive text-sm font-normal ${className}`}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
