import React from "react";

function InputGroup({ children, className = "", ...props }) {
  return (
    <div
      role="group"
      className={`flex w-full items-center rounded-md border bg-white p-1 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function InputGroupAddon({ children, align = "start", ...props }) {
  const style = {
    display: "flex",
    alignItems: "center",
    padding: "0 0.5rem",
    cursor: "text",
    order: align === "end" ? 1 : 0,
  };

  const handleClick = (e) => {
    if (e.target.closest("button")) return;
    const input = e.currentTarget.parentElement.querySelector("input, textarea");
    input?.focus();
  };

  return (
    <div style={style} onClick={handleClick} {...props}>
      {children}
    </div>
  );
}

function InputGroupButton({ children, type = "button", onClick, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "0.25rem 0.5rem",
        border: "none",
        background: "#eee",
        borderRadius: "0.25rem",
        cursor: "pointer",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function InputGroupText({ children, ...props }) {
  return (
    <span style={{ margin: "0 0.25rem", color: "#555" }} {...props}>
      {children}
    </span>
  );
}

function InputGroupInput(props) {
  return (
    <input
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        padding: "0.25rem 0.5rem",
      }}
      {...props}
    />
  );
}

function InputGroupTextarea(props) {
  return (
    <textarea
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        padding: "0.25rem 0.5rem",
        resize: "none",
      }}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
