import React from "react";

// Simple className join function
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Main ButtonGroup container
function ButtonGroup({ className, orientation = "horizontal", children, ...props }) {
  const orientationClass =
    orientation === "horizontal"
      ? "flex w-fit items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none"
      : "flex flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none";

  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn("flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2", orientationClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Text element inside ButtonGroup
function ButtonGroupText({ className, asChild = false, children, ...props }) {
  const Comp = asChild ? "span" : "div";

  return (
    <Comp
      className={cn(
        "bg-gray-200 shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Separator element
function ButtonGroupSeparator({ className, orientation = "vertical", ...props }) {
  const orientationClass = orientation === "vertical" ? "h-auto" : "w-auto";

  return (
    <div
      data-slot="button-group-separator"
      className={cn("bg-gray-300 relative !m-0 self-stretch", orientationClass, className)}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupText, ButtonGroupSeparator };
