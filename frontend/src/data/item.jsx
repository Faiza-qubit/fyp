import React from "react";

// Item group wrapper
function ItemGroup({ className = "", ...props }) {
  return (
    <div role="list" className={`flex flex-col ${className}`} {...props} />
  );
}

// Item separator
function ItemSeparator({ className = "", ...props }) {
  return (
    <hr
      style={{ margin: 0 }}
      className={className}
      role="separator"
      {...props}
    />
  );
}

// Item component
function Item({ className = "", ...props }) {
  return (
    <div
      className={`flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 ${className}`}
      {...props}
    />
  );
}

// Item media (icon/image)
function ItemMedia({ className = "", ...props }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-2 ${className}`}
      {...props}
    />
  );
}

// Item content (text, etc.)
function ItemContent({ className = "", ...props }) {
  return (
    <div className={`flex flex-1 flex-col gap-1 ${className}`} {...props} />
  );
}

// Item title
function ItemTitle({ className = "", ...props }) {
  return (
    <div
      className={`flex w-fit items-center gap-2 text-sm font-medium leading-snug ${className}`}
      {...props}
    />
  );
}

// Item description
function ItemDescription({ className = "", ...props }) {
  return (
    <p
      className={`text-sm font-normal leading-normal text-gray-500 ${className}`}
      {...props}
    />
  );
}

// Item actions (buttons, icons)
function ItemActions({ className = "", ...props }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props} />
  );
}

// Item header
function ItemHeader({ className = "", ...props }) {
  return (
    <div className={`flex w-full items-center justify-between gap-2 ${className}`} {...props} />
  );
}

// Item footer
function ItemFooter({ className = "", ...props }) {
  return (
    <div className={`flex w-full items-center justify-between gap-2 ${className}`} {...props} />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
