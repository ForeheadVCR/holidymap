"use client";

import { useEffect, useState } from "react";

interface ToastAction {
  label: string;
  onClick: () => void;
  className?: string;
}

interface ToastProps {
  message: string;
  action?: ToastAction;
  duration?: number;
  onDismiss: () => void;
}

export default function Toast({
  message,
  action,
  duration = 4000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out before unmounting
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[2000] -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-amber-900/30 bg-gray-900/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm text-amber-200/90">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className={
              action.className ??
              "whitespace-nowrap rounded-lg bg-[#5865F2] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4752C4]"
            }
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
