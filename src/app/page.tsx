"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Plus,
  Search,
  FolderOpen,
  ArrowLeft,
  X,
  FileText,
  Trash2,
  Edit2,
  Settings,
  FolderMinus,
} from "lucide-react";
import { Folder, Note, COLOR_MAP } from "@/utils/zipHelper";
import { SplashScreen } from "@/components/SplashScreen";
import { Sidebar } from "@/components/Sidebar";
import { FolderModal } from "@/components/FolderModal";
import { NoteView } from "@/components/NoteView";
import { NoteEditor } from "@/components/NoteEditor";
import { SettingsScreen } from "@/components/SettingsScreen";
import { AboutScreen } from "@/components/AboutScreen";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import confetti from "canvas-confetti";

export default function App() {
  const [mounted, setMounted] = useState(false);
  
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("apptency_splash_shown") !== "true";
    }
    return true;
  });

  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [currentScreen, setCurrentScreen] = useState<
    "home" | "notes_list" | "note_view" | "note_editor" | "settings" | "about"
  >("home");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");

  const [theme, setTheme] = useState<"light" | "dark" | "amoled">("dark");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  const [searchFolderQuery, setSearchFolderQuery] = useState("");
  const [searchNoteQuery, setSearchNoteQuery] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    cancelText: "No",
    confirmText: "Yes",
  });

  const currentScreenRef = useRef(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  const triggerCustomConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeCustomConfirm();
      },
      cancelText: "No",
      confirmText: "Yes",
    });
  };

  const triggerCustomAlert = (title: string, message: string) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: closeCustomConfirm,
      cancelText: "", 
      confirmText: "Ok",
    });
  };

  const closeCustomConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const navigateTo = (
    screen: "home" | "notes_list" | "note_view" | "note_editor" | "settings" | "about",
    folderId: string | null = selectedFolderId,
    noteId: string | null = selectedNoteId,
    editMode: "create" | "edit" = editorMode
  ) => {
    const finalFolderId = screen === "home" ? null : folderId;
    const finalNoteId = (screen === "home" || screen === "notes_list") ? null : noteId;

    const currentNextState = (typeof window !== "undefined" && window.history.state) || {};

    window.history.pushState(
      {
        ...currentNextState,
        screen,
        folderId: finalFolderId,
        noteId: finalNoteId,
        editorMode: editMode,
      },
      "",
      window.location.pathname
    );

    setCurrentScreen(screen);
    setSelectedFolderId(finalFolderId);
    setSelectedNoteId(finalNoteId);
    setEditorMode(editMode);
  };

  useEffect(() => {
    setMounted(true);

    const initialNextState = (typeof window !== "undefined" && window.history.state) || {};

    window.history.replaceState(
      { 
        ...initialNextState, 
        screen: "home", 
        folderId: null, 
        noteId: null, 
        editorMode: "create" 
      }, 
      "", 
      window.location.pathname
    );

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        setCurrentScreen(state.screen || "home");
        setSelectedFolderId(state.folderId !== undefined ? state.folderId : null);
        setSelectedNoteId(state.noteId !== undefined ? state.noteId : null);
        if (state.editorMode) setEditorMode(state.editorMode);
      } else {
        setCurrentScreen("home");
        setSelectedFolderId(null);
        setSelectedNoteId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    let backButtonListener: any = null;
    const isCapacitor = typeof window !== "undefined" && (window as any).Capacitor !== undefined;

    if (isCapacitor) {
      import("@capacitor/app").then(({ App }) => {
        App.addListener("backButton", () => {
          if (currentScreenRef.current !== "home") {
            window.history.back();
          } else {
            App.exitApp();
          }
        }).then((listener) => {
          backButtonListener = listener;
        });
      });
    }

    const localFolders = localStorage.getItem("apptency_folders");
    const localNotes = localStorage.getItem("apptency_notes");
    const localTheme = localStorage.getItem("apptency_theme") as "light" | "dark" | "amoled" | null;
    const localFontSize = localStorage.getItem("apptency_font_size") as "sm" | "base" | "lg" | "xl" | null;

    if (localFolders && localNotes) {
      setFolders(JSON.parse(localFolders));
      setNotes(JSON.parse(localNotes));
    } else {
      setFolders([]);
      setNotes([]);
      localStorage.setItem("apptency_folders", JSON.stringify([]));
      localStorage.setItem("apptency_notes", JSON.stringify([]));
    }

    if (localTheme) {
      setTheme(localTheme);
    } else {
      setTheme("dark");
    }

    if (localFontSize) {
      setFontSize(localFontSize);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.style.backgroundColor = "#f4f4f5";
    } else if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#09090b";
    } else if (theme === "amoled") {
      root.classList.add("dark");
      root.style.backgroundColor = "#000000";
    }
    localStorage.setItem("apptency_theme", theme);
  }, [theme, mounted]);

  const saveFoldersToLocalStorage = (updatedFolders: Folder[]) => {
    setFolders(updatedFolders);
    localStorage.setItem("apptency_folders", JSON.stringify(updatedFolders));
  };

  const saveNotesToLocalStorage = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("apptency_notes", JSON.stringify(updatedNotes));
  };

  const handleChangeFontSize = (size: "sm" | "base" | "lg" | "xl") => {
    setFontSize(size);
    localStorage.setItem("apptency_font_size", size);
  };

  const handleSaveFolder = (name: string, color: string) => {
    if (editingFolder) {
      const updated = folders.map((f) =>
        f.id === editingFolder.id ? { ...f, name, color } : f
      );
      saveFoldersToLocalStorage(updated);
      setEditingFolder(null);
      confetti({ particleCount: 35, spread: 40 });
    } else {
      const newFolder: Folder = {
        id: `folder_${Math.random().toString(36).substr(2, 9)}`,
        name,
        color,
        createdAt: Date.now(),
      };
      saveFoldersToLocalStorage([newFolder, ...folders]);
      confetti({ particleCount: 50, spread: 50 });
    }
  };

  const handleDeleteFolder = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const folder = folders.find((f) => f.id === id);
    if (!folder) return;

    triggerCustomConfirm(
      "Delete Folder?",
      `Are you sure you want to delete "${folder.name}" and all its notes from local storage? This action cannot be undone!`,
      () => {
        const remainingFolders = folders.filter((f) => f.id !== id);
        const remainingNotes = notes.filter((n) => n.folderId !== id);
        saveFoldersToLocalStorage(remainingFolders);
        saveNotesToLocalStorage(remainingNotes);

        if (selectedFolderId === id) {
          navigateTo("home");
        }
      }
    );
  };

  const handleEditFolderTrigger = (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(folder);
    setFolderModalOpen(true);
  };

  const handleSaveNote = (title: string, content: string, tags: string[]) => {
    if (!selectedFolderId) return;

    if (editorMode === "edit" && selectedNoteId) {
      const updated = notes.map((n) =>
        n.id === selectedNoteId
          ? { ...n, title, content, tags, updatedAt: Date.now() }
          : n
      );
      saveNotesToLocalStorage(updated);
      window.history.back();
      confetti({ particleCount: 40, spread: 30 });
    } else {
      const newNote: Note = {
        id: `note_${Math.random().toString(36).substr(2, 9)}`,
        folderId: selectedFolderId,
        title,
        content,
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveNotesToLocalStorage([newNote, ...notes]);
      
      window.history.replaceState({
        screen: "note_view",
        folderId: selectedFolderId,
        noteId: newNote.id,
        editorMode: "create",
      }, "", window.location.pathname);
      
      setSelectedNoteId(newNote.id);
      setCurrentScreen("note_view");
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    triggerCustomConfirm(
      "Delete Note?",
      `Are you sure you want to permanently delete "${note?.title || "this note"}"?`,
      () => {
        const remainingNotes = notes.filter((n) => n.id !== noteId);
        saveNotesToLocalStorage(remainingNotes);
        window.history.back();
      }
    );
  };

  const handleUpdateNoteContentDirectly = (newContent: string) => {
    if (!selectedNoteId) return;
    const updated = notes.map((n) =>
      n.id === selectedNoteId ? { ...n, content: newContent, updatedAt: Date.now() } : n
    );
    saveNotesToLocalStorage(updated);
  };

  const handleImportedData = (importedFolders: Folder[], importedNotes: Note[], count: number) => {
    setFolders(importedFolders);
    setNotes(importedNotes);
    localStorage.setItem("apptency_folders", JSON.stringify(importedFolders));
    localStorage.setItem("apptency_notes", JSON.stringify(importedNotes));
    triggerCustomAlert("Import Successful", `A total of ${count} notes have been successfully imported from the ZIP backup! 🥳`);
  };

  const handleClearAllData = () => {
    setFolders([]);
    setNotes([]);
    localStorage.removeItem("apptency_folders");
    localStorage.removeItem("apptency_notes");
  };

  const getFontSizeClass = () => {
    if (fontSize === "sm") return "text-sm";
    if (fontSize === "lg") return "text-lg";
    if (fontSize === "xl") return "text-xl";
    return "text-base";
  };

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchFolderQuery.toLowerCase())
  )
    .sort((a, b) => b.createdAt - a.createdAt);

  const activeFolder = folders.find((f) => f.id === selectedFolderId);
  const activeNote = notes.find((n) => n.id === selectedNoteId) || null;

  const getThemeClass = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-black text-white",
        card: "bg-[#0a0a0c] border border-zinc-900",
        header: "bg-black border-b border-zinc-900 text-white",
        input: "bg-zinc-950 border-zinc-900 text-zinc-200 placeholder-zinc-500",
        fab: "bg-indigo-600 text-white hover:bg-indigo-700",
        subtext: "text-zinc-500",
      };
    } else if (theme === "dark") {
      return {
        bg: "bg-zinc-950 text-zinc-100",
        card: "bg-zinc-900 border border-zinc-800",
        header: "bg-zinc-950 border-b border-zinc-800 text-zinc-100",
        input: "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500",
        fab: "bg-indigo-600 text-white hover:bg-indigo-700",
        subtext: "text-zinc-400",
      };
    } else {
      return {
        bg: "bg-zinc-50 text-zinc-800",
        card: "bg-white border border-zinc-200/80 shadow-xs hover:border-zinc-300",
        header: "bg-white border-b border-zinc-200 text-zinc-800",
        input: "bg-zinc-100 border-zinc-200 text-zinc-850 placeholder-zinc-400",
        fab: "bg-indigo-600 text-white hover:bg-indigo-700",
        subtext: "text-zinc-500",
      };
    }
  };

  const appStyles = getThemeClass();

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.setItem("apptency_splash_shown", "true");
          setShowSplash(false);
        }}
      />
    );
  }

  const renderMobileScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <div className="flex flex-col h-full relative">
            {/* Top Navigation Bar */}
            <div className={`p-4 flex items-center justify-between sticky top-0 z-20 ${appStyles.header}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                  aria-label="Open Sidebar"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center font-black text-xs">AT</span>
                  <h1 className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">Apptency</h1>
                </div>
              </div>
              <button
                onClick={() => navigateTo("settings")}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title="Settings Screen"
              >
                <Settings size={18} className="text-zinc-400 hover:text-indigo-500" />
              </button>
            </div>

            {/* Scrollable Directory list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Search bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchFolderQuery}
                  onChange={(e) => setSearchFolderQuery(e.target.value)}
                  placeholder="Search folder name..."
                  className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-xs border outline-none font-medium transition-all ${appStyles.input}`}
                />
                {searchFolderQuery && (
                  <button
                    onClick={() => setSearchFolderQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Folders collection block */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <FolderOpen size={12} className="text-indigo-500" /> My Folders ({filteredFolders.length})
                  </span>
                </div>

                {filteredFolders.length === 0 ? (
                  <div className={`p-8 text-center rounded-2xl ${appStyles.card} flex flex-col items-center justify-center`}>
                    <FolderMinus size={36} className="text-zinc-600 mb-2 animate-pulse" />
                    <p className="text-xs font-bold text-zinc-400">Folder not found!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredFolders.map((folder) => {
                      const noteCount = notes.filter((n) => n.folderId === folder.id).length;
                      const colorTheme = COLOR_MAP[folder.color] || COLOR_MAP.blue;

                      return (
                        <div
                          key={folder.id}
                          onClick={() => {
                            navigateTo("notes_list", folder.id, null);
                            setSearchNoteQuery("");
                          }}
                          className={`p-3 rounded-2xl cursor-pointer relative group transition-all transform active:scale-97 hover:scale-[1.01] ${appStyles.card} ${colorTheme.bg} ${colorTheme.border} border-l-4`}
                        >
                          <div className="flex items-start justify-between">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${colorTheme.text}`}>
                              📁
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-85">
                              <button
                                onClick={(e) => handleEditFolderTrigger(folder, e)}
                                className={`p-1 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 cursor-pointer ${colorTheme.text}`}
                              >
                                <Edit2 size={11} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteFolder(folder.id, e)}
                                className="p-1 rounded-md hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h3 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-100 truncate leading-tight">
                              {folder.name}
                            </h3>
                            <span className="text-[10px] text-zinc-500 font-semibold mt-0.5 block">
                              {noteCount} {noteCount === 1 ? "note" : "notes"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Folder Plus action button */}
            <button
              onClick={() => {
                setEditingFolder(null);
                setFolderModalOpen(true);
              }}
              className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer z-20 ${appStyles.fab}`}
              title="Create New Folder"
            >
              <Plus size={26} />
            </button>
          </div>
        );

      case "notes_list":
        if (!activeFolder) {
          setCurrentScreen("home");
          return null;
        }

        const folderNotes = notes.filter((n) => n.folderId === activeFolder.id)
          .sort((a, b) => b.createdAt - a.createdAt);
        const filteredNotes = folderNotes.filter((n) => {
          if (!searchNoteQuery) return true;
          const q = searchNoteQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
          );
        });

        const col1 = filteredNotes.filter((_, idx) => idx % 2 === 0);
        const col2 = filteredNotes.filter((_, idx) => idx % 2 !== 0);
        const folderColor = COLOR_MAP[activeFolder.color] || COLOR_MAP.blue;

        return (
          <div className="flex flex-col h-full relative">
            <div className={`p-4 flex items-center justify-between sticky top-0 z-20 ${appStyles.header}`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.history.back()}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${folderColor.bg}`} style={{ backgroundColor: folderColor.hex }} />
                  <h2 className="font-extrabold text-sm truncate max-w-[140px] text-zinc-900 dark:text-zinc-100">{activeFolder.name}</h2>
                </div>
              </div>

              <div className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 py-0.5 px-2 rounded-full">
                {folderNotes.length} notes
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchNoteQuery}
                  onChange={(e) => setSearchNoteQuery(e.target.value)}
                  placeholder="Search in folder..."
                  className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-xs border outline-none font-medium transition-all ${appStyles.input}`}
                />
                {searchNoteQuery && (
                  <button
                    onClick={() => setSearchNoteQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {filteredNotes.length === 0 ? (
                <div className={`p-10 text-center rounded-2xl ${appStyles.card} flex flex-col items-center justify-center`}>
                  <FileText size={40} className="text-zinc-600 mb-2" />
                  <h3 className="text-xs font-bold text-zinc-400">Empty List</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 items-start select-none">
                  <div className="flex flex-col gap-3">
                    {col1.map((note) => (
                      <NoteGridCard
                        key={note.id}
                        note={note}
                        onClick={() => {
                          navigateTo("note_view", selectedFolderId, note.id);
                        }}
                        cardStyle={appStyles.card}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {col2.map((note) => (
                      <NoteGridCard
                        key={note.id}
                        note={note}
                        onClick={() => {
                          navigateTo("note_view", selectedFolderId, note.id);
                        }}
                        cardStyle={appStyles.card}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigateTo("note_editor", selectedFolderId, null, "create");
              }}
              className="absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer z-20 hover:scale-105"
              style={{ backgroundColor: folderColor.hex, color: "#fff" }}
            >
              <Plus size={26} />
            </button>
          </div>
        );

      case "note_view":
        if (!activeNote || !activeFolder) {
          setCurrentScreen("home");
          return null;
        }
        return (
          <NoteView
            note={activeNote}
            folder={activeFolder}
            onBack={() => window.history.back()}
            onEdit={() => {
              navigateTo("note_editor", selectedFolderId, selectedNoteId, "edit");
            }}
            onDelete={() => handleDeleteNote(activeNote.id)}
            onChangeContent={handleUpdateNoteContentDirectly}
            theme={theme}
            fontSizeClass={getFontSizeClass()}
          />
        );

      case "note_editor":
        if (!activeFolder) {
          setCurrentScreen("home");
          return null;
        }
        return (
          <NoteEditor
            note={editorMode === "edit" ? activeNote : null}
            folderName={activeFolder.name}
            onCancel={() => window.history.back()}
            onSave={handleSaveNote}
            theme={theme}
            fontSizeClass={getFontSizeClass()}
            triggerCustomAlert={triggerCustomAlert} 
          />
        );

      case "settings":
        return (
          <SettingsScreen
            folders={folders}
            notes={notes}
            theme={theme}
            onChangeTheme={setTheme}
            fontSize={fontSize}
            onChangeFontSize={handleChangeFontSize}
            onDataImport={handleImportedData}
            onClearAll={handleClearAllData}
            onBack={() => window.history.back()}
            onOpenAbout={() => navigateTo("about")}
            triggerCustomConfirm={triggerCustomConfirm}
            triggerCustomAlert={triggerCustomAlert} 
          />
        );

        case "about":
  return (
    <AboutScreen
      folders={folders}
      notes={notes}
      theme={theme}
      onBack={() => window.history.back()}
    />
  );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-start md:justify-center font-sans antialiased text-sm select-none p-0 md:p-6 md:py-10">
      {/* High-performance background grid pattern with solid rendering lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

      {/* 100% Mobile Full Screen Layout Wrapper: covers the entire viewport on phone, simulated mockup on desktop */}
      <div className="relative w-full h-[100dvh] md:max-w-[410px] md:h-[830px] bg-white dark:bg-black rounded-none md:rounded-[42px] md:shadow-2xl overflow-hidden flex flex-col border-0 md:border-[10px] border-zinc-800 dark:border-zinc-900 z-10 transition-all">
        
        {/* Scrollable Active Screen Container */}
        <div className={`flex-1 relative ${appStyles.bg}`}>
          {renderMobileScreen()}
        </div>

        {/* Bottom indicator hidden on native mobile browsers */}
        <div className="hidden md:flex bg-white dark:bg-black py-2.5 items-center justify-center shrink-0 z-30">
          <div 
            className="w-28 h-1 bg-zinc-400 dark:bg-zinc-700 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors" 
            onClick={() => navigateTo("home")} 
          />
        </div>
      </div>

      {/* Settings Drawer Slide Panel */}
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        folders={folders}
        notes={notes}
        theme={theme}
        onOpenSettings={() => navigateTo("settings")}
        onSelectFolder={(folderId) => navigateTo("notes_list", folderId, null)} 
      />

      <FolderModal
        isOpen={folderModalOpen}
        folder={editingFolder}
        onClose={() => {
          setFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onSave={handleSaveFolder}
        theme={theme}
        triggerCustomAlert={triggerCustomAlert} 
      />

      {/* Premium Custom confirmation modal instance */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeCustomConfirm}
        theme={theme}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
      />
    </main>
  );
}

function NoteGridCard({
  note,
  onClick,
  cardStyle,
}: {
  note: Note;
  onClick: () => void;
  cardStyle: string;
}) {
  const truncateSnippet = (text: string) => {
    const plainText = text
      .replace(/^#+ .*/g, "")
      .replace(/---|\*\*\*/g, "")
      .replace(/[`*_~#\-+[\]|]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (plainText.length <= 150) return plainText || "Empty Note";
    return plainText.substring(0, 150) + "...";
  };

  const formatShortDate = (timestamp: number) => {
    const dt = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[dt.getMonth()];
    const day = dt.getDate();
    return `${day} ${month}`;
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-2xl cursor-pointer select-none relative transition-all duration-200 hover:scale-[1.01] active:scale-97 text-left flex flex-col gap-2 ${cardStyle}`}
    >
      <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
        {note.title || "Untitled Note"}
      </h4>

      <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-4">
        {truncateSnippet(note.content)}
      </p>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {note.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[8px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 py-0.5 px-1.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-zinc-100/50 dark:border-zinc-800/30 flex items-center justify-between text-[9px] font-bold text-zinc-400 font-mono">
        <span>{formatShortDate(note.createdAt)}</span>
      </div>
    </div>
  );
}
