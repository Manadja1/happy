"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-happy-ink-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card / Bottom Sheet on mobile */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all duration-200 animate-fadeIn border border-happy-ink-100",
          className
        )}
      >
        <div className="flex items-start justify-between pb-3">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-happy-ink-900 font-display">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-happy-ink-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-happy-sand-100 text-happy-ink-500 hover:bg-happy-sand-200 hover:text-happy-ink-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
