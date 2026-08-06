"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  theme: "light" | "dark" | "amoled";
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  theme,
  confirmText = "Yes",
  cancelText = "No",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getThemeStyles = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-[#0a0a0c] border border-zinc-900",
        title: "text-white",
        message: "text-zinc-400",
        btnCancel: "bg-zinc-900 hover:bg-zinc-850 text-zinc-300",
        btnConfirm: "bg-rose-600 hover:bg-rose-700 text-white",
      };
    } else if (theme === "dark") {
      return {
        bg: "bg-zinc-950 border border-zinc-800",
        title: "text-zinc-100",
        message: "text-zinc-400",
        btnCancel: "bg-zinc-900 hover:bg-zinc-800 text-zinc-300",
        btnConfirm: "bg-rose-600 hover:bg-rose-700 text-white",
      };
    } else {
      return {
        bg: "bg-white border border-zinc-200 shadow-xl",
        title: "text-zinc-800",
        message: "text-zinc-500",
        btnCancel: "bg-zinc-100 hover:bg-zinc-200 text-zinc-600",
        btnConfirm: "bg-rose-600 hover:bg-rose-700 text-white",
      };
    }
  };

  const styles = getThemeStyles();
  
  const showCancelButton = cancelText !== "" && onCancel;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog Container */}
      <div
        className={`relative w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 overflow-hidden transition-all duration-300 transform translate-y-0 ${styles.bg}`}
      >
        {/* Mobile Swipe/Drag Indicator */}
        <div className="w-12 h-1 bg-zinc-800/40 dark:bg-zinc-700/40 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Alarm Icon & Alert Text */}
        <div className="flex flex-col items-center text-center space-y-3 mt-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className={`text-base font-extrabold tracking-tight ${styles.title}`}>
            {title}
          </h3>
          <p className={`text-xs leading-relaxed ${styles.message}`}>
            {message}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 mt-6">
          {showCancelButton && (
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${styles.btnCancel}`}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`py-3 rounded-xl text-xs font-bold shadow-md shadow-rose-600/10 transition-all cursor-pointer ${styles.btnConfirm} ${
              showCancelButton ? "flex-1" : "w-full flex-none"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
