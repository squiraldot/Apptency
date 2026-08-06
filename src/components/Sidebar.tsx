"use client";

import React from "react";
import { X, Layers, Settings, BookOpen } from "lucide-react";
import { Folder, Note, COLOR_MAP } from "@/utils/zipHelper";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  notes: Note[];
  theme: "light" | "dark" | "amoled";
  onOpenSettings?: () => void;
  onSelectFolder?: (folderId: string) => void; 
}

export function Sidebar({
  isOpen,
  onClose,
  folders,
  notes,
  theme,
  onOpenSettings,
  onSelectFolder,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } bg-black/60 backdrop-blur-xs`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] z-45 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          theme === "amoled"
            ? "bg-black border-r border-zinc-900 text-white"
            : theme === "dark"
            ? "bg-zinc-950 border-r border-zinc-800 text-zinc-100"
            : "bg-white border-r border-zinc-200 text-zinc-800"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AT
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight leading-tight">Apptency Navigation</h2>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Local Library</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Settings Screen Shortcut Trigger */}
          <div className="p-1">
            <button
              onClick={() => {
                onClose();
                if (onOpenSettings) onOpenSettings();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Settings size={15} />
                <span>Open App Settings</span>
              </span>
              <span className="text-[10px] bg-indigo-500 py-0.5 px-2 rounded-full">Configure</span>
            </button>
          </div>

          {/* Quick Folders Overview List */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers size={13} className="text-indigo-500" /> Folder Quick Directory
            </h3>
            {folders.length === 0 ? (
              <p className="text-xs text-zinc-500 italic px-2">No folders available</p>
            ) : (
              <div className="space-y-1.5">
                {folders.map((folder) => {
                  const noteCount = notes.filter((n) => n.folderId === folder.id).length;
                  const colors = COLOR_MAP[folder.color] || COLOR_MAP.blue;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        onClose();
                        if (onSelectFolder) onSelectFolder(folder.id);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold text-left cursor-pointer transition-all active:scale-98 ${
                        theme === "light"
                          ? "bg-zinc-100/50 border-zinc-200/50 hover:bg-zinc-100/50 text-zinc-800"
                          : "bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/40 text-zinc-200"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate font-medium">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.hex }} />
                        <span className="truncate">{folder.name}</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold shrink-0">
                        {noteCount} {noteCount === 1 ? "note" : "notes"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Core Tip Card */}
          <div className={`p-3.5 rounded-xl border ${
            theme === "light" 
              ? "bg-zinc-100/50 border-zinc-200/50 text-zinc-700" 
              : "bg-zinc-900/40 border-zinc-800/40 text-zinc-300"
          }`}>
            <h4 className="text-xs font-bold text-indigo-500 flex items-center gap-1 mb-1">
              <BookOpen size={12} />
              Markdown Support
            </h4>
            <p className="text-[10px] leading-relaxed opacity-80">
              Checklists support direct interactions: write <code className="font-mono bg-zinc-200/80 dark:bg-zinc-800 px-1 rounded text-red-400">- [ ] Task</code> and click on the check boxes directly in the Note Preview!
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-900 text-center shrink-0">
          <p className="text-[10px] text-zinc-500 font-semibold font-mono">Made with Love❤️</p>
        </div>
      </div>
    </>
  );
                          }
