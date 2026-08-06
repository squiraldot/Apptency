"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreVertical, Edit, Trash2, Calendar, Folder, Tag, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "@/utils/markdown";
import { COLOR_MAP, Folder as FolderType, Note } from "@/utils/zipHelper";

interface NoteViewProps {
  note: Note;
  folder: FolderType;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChangeContent: (newContent: string) => void;
  theme: "light" | "dark" | "amoled";
  fontSizeClass: string;
}

export function NoteView({
  note,
  folder,
  onBack,
  onEdit,
  onDelete,
  onChangeContent,
  theme,
  fontSizeClass,
}: NoteViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatDateTime = (timestamp: number) => {
    const dt = new Date(timestamp);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = dt.getDate().toString().padStart(2, "0");
    const month = months[dt.getMonth()];
    const year = dt.getFullYear();
    let hours = dt.getHours();
    const minutes = dt.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedHours = hours.toString().padStart(2, "0");

    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getThemeStyles = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-black text-white",
        cardBg: "bg-[#0d0d0d] border border-zinc-900",
        textMuted: "text-zinc-400",
        border: "border-zinc-900",
        menuBg: "bg-[#0d0d0d] border border-zinc-800 text-white",
        menuHover: "hover:bg-zinc-900",
      };
    } else if (theme === "dark") {
      return {
        bg: "bg-zinc-950 text-zinc-100",
        cardBg: "bg-zinc-900 border border-zinc-800",
        textMuted: "text-zinc-400",
        border: "border-zinc-800",
        menuBg: "bg-zinc-900 border border-zinc-800 text-zinc-100",
        menuHover: "hover:bg-zinc-800",
      };
    } else {
      return {
        bg: "bg-zinc-50 text-zinc-800",
        cardBg: "bg-white border border-zinc-200 shadow-sm",
        textMuted: "text-zinc-500",
        border: "border-zinc-200",
        menuBg: "bg-white border border-zinc-200 shadow-lg text-zinc-800",
        menuHover: "hover:bg-zinc-100",
      };
    }
  };

  const styles = getThemeStyles();
  const folderColor = COLOR_MAP[folder.color] || COLOR_MAP.blue;

  return (
    <div className={`flex flex-col h-full ${styles.bg}`}>
      {/* Top Navbar */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black shrink-0 relative">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Category Header Badge */}
        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80">
          <span className={`w-2 h-2 rounded-full ${folderColor.bg}`} style={{ backgroundColor: folderColor.hex }} />
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 truncate max-w-[100px]">
            {folder.name}
          </span>
        </div>

        {/* 3-Dot Action Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <MoreVertical size={18} />
          </button>

          {/* Menu Dropdown */}
          {menuOpen && (
            <div className={`absolute right-0 mt-1 w-44 rounded-xl shadow-lg z-30 py-1 border overflow-hidden ${styles.menuBg} animate-fadeIn`}>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-xs font-semibold cursor-pointer ${styles.menuHover}`}
              >
                <Edit size={14} className="text-indigo-500" />
                <span>Edit Note</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-xs font-semibold cursor-pointer text-rose-500 hover:bg-rose-500/10`}
              >
                <Trash2 size={14} className="text-rose-500" />
                <span>Delete Note</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Note View Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Header Block with Meta Details */}
        <div className="space-y-3">
          {/* Note Title */}
          <h1 className="text-2xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 select-text">
            {note.title}
          </h1>

          {/* Creation Date and Folders list details */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-zinc-400" />
              <span>Created: {formatDateTime(note.createdAt)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Folder size={13} className="text-zinc-400" />
              <span className="font-bold underline decoration-indigo-400 underline-offset-2">{folder.name}</span>
            </span>
          </div>

          {/* Tag labels */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40"
                >
                  <Tag size={9} />
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider bar */}
        <hr className={`border-t ${styles.border}`} />

        {/* Render Markdown context inside customized editor with font size mapping */}
        <div className={`select-text pb-16 ${styles.textMuted}`}>
          <MarkdownRenderer
            content={note.content}
            onChangeContent={onChangeContent}
            fontSizeClass={fontSizeClass}
          />
        </div>
      </div>
    </div>
  );
}
