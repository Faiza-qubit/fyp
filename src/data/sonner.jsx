import React, { useState } from "react";

function Toaster({ position = "top-right" }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 3000); // auto-dismiss after 3s
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className={`fixed ${position} z-50 flex flex-col gap-2 p-2`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white text-black border border-gray-300 shadow-lg rounded-md p-2 flex justify-between items-center"
        >
          <span>{toast.message}</span>
          <button
            className="ml-2 text-sm font-bold"
            onClick={() => removeToast(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}

      {/* Example button to test the toaster */}
      <button
        onClick={() => addToast("This is a toast message!")}
        className="mt-2 rounded bg-blue-500 px-2 py-1 text-white"
      >
        Show Toast
      </button>
    </div>
  );
}

export { Toaster };
