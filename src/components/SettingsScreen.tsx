"use client";

import React, { useRef, useState } from "react";
import {
  Info,
  ArrowLeft,
  ArrowRight,
  Layers,
  FileText,
  Trash2,
  Download,
  Upload,
  Sun,
  Moon,
  Smartphone,
  Type,
  PieChart,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { Folder, Note, exportNotesToZip, importNotesFromZip } from "@/utils/zipHelper";
import confetti from "canvas-confetti";

interface SettingsScreenProps {
  folders: Folder[];
  notes: Note[];
  theme: "light" | "dark" | "amoled";
  onChangeTheme: (theme: "light" | "dark" | "amoled") => void;
  fontSize: "sm" | "base" | "lg" | "xl";
  onChangeFontSize: (size: "sm" | "base" | "lg" | "xl") => void;
  onDataImport: (importedFolders: Folder[], importedNotes: Note[], count: number) => void;
  onClearAll: () => void;
  onBack: () => void;
  onOpenAbout: () => void;
  triggerCustomConfirm: (title: string, message: string, onConfirm: () => void) => void;
  triggerCustomAlert?: (title: string, message: string) => void; 
}

export function SettingsScreen({
  folders,
  notes,
  theme,
  onChangeTheme,
  fontSize,
  onChangeFontSize,
  onDataImport,
  onClearAll,
  onBack,
  onOpenAbout,
  triggerCustomConfirm,
  triggerCustomAlert,
}: SettingsScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const totalFolders = folders.length;
  const totalNotes = notes.length;

  let totalTasks = 0;
  let completedTasks = 0;
  notes.forEach((note) => {
    const lines = note.content.split("\n");
    lines.forEach((line) => {
      if (line.match(/^\s*[-*+]\s+\[([ xX])\]/)) {
        totalTasks++;
        if (line.match(/^\s*[-*+]\s+\[([xX])\]/)) {
          completedTasks++;
        }
      }
    });
  });

  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleExportZip = async () => {
    if (totalFolders === 0) {
      if (triggerCustomAlert) {
        triggerCustomAlert("No Data to Export", "There are no folders or notes in your library to export as a backup!");
      } else {
        alert("There are no folders or notes in your library to export as a backup!");
      }
      return;
    }
    try {
      setExporting(true);
      const zipBlob = await exportNotesToZip(folders, notes);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Apptency_Backup_${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      confetti({ particleCount: 50, spread: 40 });
    } catch (error) {
      console.error(error);
      if (triggerCustomAlert) {
        triggerCustomAlert("Export Error", "An error occurred while creating the backup export.");
      } else {
        alert("An error occurred while creating the backup export.");
      }
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const result = await importNotesFromZip(file, folders, notes);
      onDataImport(result.folders, result.notes, result.importedCount);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      if (triggerCustomAlert) {
        triggerCustomAlert("Invalid Backup File", "Invalid file format! Please select a valid Apptency '.zip' backup.");
      } else {
        alert("Invalid file format! Please select a valid Apptency '.zip' backup.");
      }
    } finally {
      setImporting(false);
    }
  };

  const getThemeStyles = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-black text-white",
        header: "bg-black border-b border-zinc-900 text-white",
        card: "bg-zinc-950 border border-zinc-900",
        controlBg: "bg-zinc-950 border border-zinc-900",
        btnActive: "bg-zinc-900 text-indigo-400 border border-zinc-800",
        textLabel: "text-zinc-400",
        subCard: "bg-zinc-950 border border-zinc-900 text-zinc-100",
      };
    } else if (theme === "dark") {
      return {
        bg: "bg-zinc-950 text-zinc-100",
        header: "bg-zinc-950 border-b border-zinc-800 text-zinc-100",
        card: "bg-zinc-900 border border-zinc-800",
        controlBg: "bg-zinc-900 border border-zinc-800",
        btnActive: "bg-indigo-600 text-white",
        textLabel: "text-zinc-400",
        subCard: "bg-zinc-950 border border-zinc-800 text-zinc-100",
      };
    } else {
      return {
        bg: "bg-zinc-50 text-zinc-800",
        header: "bg-white border-b border-zinc-200 text-zinc-800",
        card: "bg-white border border-zinc-200 shadow-xs",
        controlBg: "bg-zinc-100 border border-zinc-200/60",
        btnActive: "bg-indigo-600 text-white",
        textLabel: "text-zinc-500",
        subCard: "bg-zinc-100/70 border border-zinc-250 text-zinc-800",
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`flex flex-col h-full overflow-hidden ${styles.bg}`}>
      {/* Settings Header */}
      <div className={`p-4 flex items-center gap-3 shrink-0 ${styles.header}`}>
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="Back to Home"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-extrabold text-sm md:text-base leading-tight">Settings</h2>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Customize & Manage</span>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 1. Statistics Overview */}
        <div className={`rounded-xl p-3.5 ${styles.card}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-3">
            <PieChart size={14} />
            Statistics Overview
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Folders count card */}
            <div className={`p-2.5 rounded-lg flex flex-col ${styles.subCard}`}>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wide">Folders</span>
              <span className="text-base font-black flex items-center gap-1.5 mt-1">
                <Layers size={14} className="text-indigo-500 shrink-0" />
                <span>{totalFolders}</span>
              </span>
            </div>
            {/* Notes count card */}
            <div className={`p-2.5 rounded-lg flex flex-col ${styles.subCard}`}>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wide">Notes</span>
              <span className="text-base font-black flex items-center gap-1.5 mt-1">
                <FileText size={14} className="text-emerald-500 shrink-0" />
                <span>{totalNotes}</span>
              </span>
            </div>
          </div>

          {totalTasks > 0 && (
            <div className={`p-2.5 rounded-lg border ${styles.subCard}`}>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Checklist Status
                </span>
                <span className="font-extrabold text-indigo-500">{taskCompletionRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                {completedTasks} of {totalTasks} checklist items completed
              </span>
            </div>
          )}
        </div>

        {/* 2. Screen Theme Mode */}
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${styles.textLabel}`}>
            <Sun size={14} /> Screen Theme Mode
          </h3>
          <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl ${styles.controlBg}`}>
            <button
              onClick={() => onChangeTheme("light")}
              className={`py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                theme === "light"
                  ? "bg-white text-indigo-600 shadow-xs scale-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Sun size={14} />
              <span>Light</span>
            </button>
            <button
              onClick={() => onChangeTheme("dark")}
              className={`py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                theme === "dark"
                  ? styles.btnActive
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Moon size={14} />
              <span>Dark</span>
            </button>
            <button
              onClick={() => onChangeTheme("amoled")}
              className={`py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                theme === "amoled"
                  ? styles.btnActive
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Smartphone size={14} />
              <span>AMOLED</span>
            </button>
          </div>
        </div>

        {/* 3. Note Font Size */}
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${styles.textLabel}`}>
            <Type size={14} /> Note Font Size
          </h3>
          <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl ${styles.controlBg} text-xs`}>
            {(["sm", "base", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                onClick={() => onChangeFontSize(size)}
                className={`py-2 px-1 rounded-lg font-bold capitalize cursor-pointer transition-all ${
                  fontSize === size
                    ? "bg-indigo-500 text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <span className={size === "sm" ? "text-xs" : size === "base" ? "text-sm" : size === "lg" ? "text-base" : "text-lg"}>
                  {size === "base" ? "Normal" : size}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* About */}

<div className={styles.card + " rounded-3xl p-4"}>

  <button
    onClick={onOpenAbout}
    className="w-full flex items-center justify-between"
  >

    <div className="flex items-center gap-3">

      <Info size={20} />

      <div className="text-left">

        <p className="font-semibold">
          About Apptency
        </p>

        <p className={`text-xs ${styles.textLabel}`}>
          Version • Credits • Privacy • Updates
        </p>

      </div>

    </div>

    <ArrowRight size={18} />

  </button>

</div>

        {/* 4. Import & Export */}
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${styles.textLabel}`}>
            <Layers size={14} /> Import & Export
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleExportZip}
              disabled={exporting}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <Download size={15} />
                {exporting ? "Creating ZIP..." : "Export Backup (.ZIP)"}
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 py-0.5 px-1.5 rounded font-mono">
                Markdown
              </span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".zip"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              disabled={importing}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <Upload size={15} />
                {importing ? "Importing..." : "Import Backup (.ZIP)"}
              </span>
              <span className="text-[9px] bg-blue-500/20 text-blue-700 dark:text-blue-300 py-0.5 px-1.5 rounded font-mono">
                Choose Zip
              </span>
            </button>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5">
            <Flame size={14} /> Danger Zone
          </h3>
          
          <button
            onClick={() => {
              triggerCustomConfirm(
                "Reset All Data?",
                "Are you sure you want to delete all local data? All your folders and notes will be permanently removed from your browser storage. This action cannot be undone!",
                () => {
                  onClearAll();
                  onBack();
                }
              );
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 size={15} />
            Delete All Folders & Notes
          </button>
        </div>
      </div>

      {/* Settings Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-900 text-center shrink-0">
        <p className="text-[10px] text-zinc-500 font-semibold font-mono">Apptency Secure Client Storage</p>
      </div>
    </div>
  );
              }
