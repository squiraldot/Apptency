"use client";

import React, { useEffect, useState } from "react";
import { X, Check, FolderHeart, FolderEdit } from "lucide-react";
import { COLOR_MAP } from "@/utils/zipHelper";

interface FolderModalProps {
  isOpen: boolean;
  folder: { id: string; name: string; color: string } | null; 
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  theme: "light" | "dark" | "amoled";
  triggerCustomAlert?: (title: string, message: string) => void; 
}

export function FolderModal({ isOpen, folder, onClose, onSave, theme, triggerCustomAlert }: FolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const colorsList = ["red", "green", "blue", "yellow", "purple", "pink"];

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
      setSelectedColor(folder.color);
    } else {
      setFolderName("");
      setSelectedColor("blue");
    }
  }, [folder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      if (triggerCustomAlert) {
        triggerCustomAlert("Folder Name Required", "A folder name is required to create a new folder!");
      } else {
        alert("A folder name is required!");
      }
      return;
    }
    onSave(folderName.trim(), selectedColor);
    onClose();
  };

  const getThemeStyles = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-[#0a0a0c] border border-zinc-900",
        text: "text-white",
        input: "bg-black border-zinc-800 focus:border-indigo-500 text-white",
        label: "text-zinc-400",
        btnCancel: "bg-zinc-900 hover:bg-zinc-850 text-zinc-300",
      };
    } else if (theme === "dark") {
      return {
        bg: "bg-zinc-950 border border-zinc-800",
        text: "text-zinc-100",
        input: "bg-zinc-900 border-zinc-800 focus:border-indigo-500 text-zinc-100",
        label: "text-zinc-400",
        btnCancel: "bg-zinc-900 hover:bg-zinc-800 text-zinc-300",
      };
    } else {
      return {
        bg: "bg-white border border-zinc-200 shadow-xl",
        text: "text-zinc-800",
        input: "bg-zinc-50 border-zinc-200 focus:border-indigo-500 text-zinc-800",
        label: "text-zinc-500",
        btnCancel: "bg-zinc-100 hover:bg-zinc-200 text-zinc-600",
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Modal backdrop with fade animation */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal dialog box */}
      <div
        className={`relative w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 overflow-hidden transition-all duration-300 transform translate-y-0 ${styles.bg}`}
      >
        {/* Decorative drag handle on mobile */}
        <div className="w-12 h-1 bg-zinc-800/40 dark:bg-zinc-700/40 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${COLOR_MAP[selectedColor].bg} ${COLOR_MAP[selectedColor].text}`}>
              {folder ? <FolderEdit size={18} /> : <FolderHeart size={18} />}
            </div>
            <h3 className={`text-lg font-extrabold tracking-tight ${styles.text}`}>
              {folder ? "Edit Folder" : "Create New Folder"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X size={18} className={styles.text} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.label}`}>
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value.substring(0, 24))}
              placeholder="e.g. 📝 Daily Diary, 💡 Tech Ideas..."
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/25 outline-none font-medium text-sm transition-all ${styles.input}`}
              autoFocus
              required
            />
            <div className="flex justify-between mt-1 text-[10px] text-zinc-500 font-medium">
              <span>Short & clean name keeps it beautiful</span>
              <span>{folderName.length}/24 chars</span>
            </div>
          </div>

          {/* Color options selection */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${styles.label}`}>
              Choose Accent Color
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40">
              {colorsList.map((colorKey) => {
                const colorInfo = COLOR_MAP[colorKey];
                const isSelected = selectedColor === colorKey;

                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setSelectedColor(colorKey)}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    style={{ backgroundColor: colorInfo.hex }}
                  >
                    {/* Ring for selection */}
                    {isSelected && (
                      <div className="absolute -inset-1.5 rounded-full border-2 border-indigo-500 dark:border-indigo-400 animate-pulse" />
                    )}
                    {isSelected ? (
                      <Check size={16} className="text-white font-bold drop-shadow-md" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${styles.btnCancel}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Check size={14} />
              {folder ? "Keep it saved" : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
