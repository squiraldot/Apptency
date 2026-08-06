"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  HelpCircle,
  Search,
  RefreshCw,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Terminal,
  Quote,
  Table,
  Link,
  Image,
  Tag,
  BookOpen,
  X,
  RotateCcw, 
  RotateCw,  
} from "lucide-react";
import { MarkdownRenderer } from "@/utils/markdown";

interface NoteEditorProps {
  note: { id: string; title: string; content: string; tags: string[] } | null; 
  folderName: string;
  onCancel: () => void;
  onSave: (title: string, content: string, tags: string[]) => void;
  theme: "light" | "dark" | "amoled";
  fontSizeClass: string;
  triggerCustomAlert?: (title: string, message: string) => void; 
}

export function NoteEditor({ note, folderName, onCancel, onSave, theme, fontSizeClass, triggerCustomAlert }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
      setTagInput("");
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
    }
    setUndoStack([]);
    setRedoStack([]);
  }, [note]);

  const handleContentChange = (newValue: string) => {
    setUndoStack((prev) => {
      const updated = [...prev, content];
      if (updated.length > 50) updated.shift();
      return updated;
    });
    setRedoStack([]);
    setContent(newValue);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, content]);
    setContent(previous);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextVal = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, content]);
    setContent(nextVal);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().replace(/#/g, "").toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const getMetrics = () => {
    const chars = content.length;
    const words = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
    const lines = content === "" ? 0 : content.split("\n").length;
    return { chars, words, lines };
  };

  const injectSyntax = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    let cursorOffset = 0;

    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case "h1":
        replacement = `\n# ${selectedText || "Heading 1"}\n`;
        cursorOffset = replacement.length;
        break;
      case "h2":
        replacement = `\n## ${selectedText || "Heading 2"}\n`;
        cursorOffset = replacement.length;
        break;
      case "h3":
        replacement = `\n### ${selectedText || "Heading 3"}\n`;
        cursorOffset = replacement.length;
        break;
      case "bullet":
        replacement = `\n- ${selectedText || "item"}`;
        cursorOffset = replacement.length;
        break;
      case "number":
        replacement = `\n1. ${selectedText || "item"}`;
        cursorOffset = replacement.length;
        break;
      case "todo":
        replacement = `\n- [ ] ${selectedText || "task description"}`;
        cursorOffset = replacement.length;
        break;
      case "code":
        replacement = `\n\`\`\`javascript\n${selectedText || "console.log('Apptency GFM Editor');"}\n\`\`\`\n`;
        cursorOffset = replacement.length;
        break;
      case "inline-code":
        replacement = `\`${selectedText || "code"}\``;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case "quote":
        replacement = `\n> ${selectedText || "important quote"}`;
        cursorOffset = replacement.length;
        break;
      case "table":
        replacement = `\n| Column 1 | Column 2 |\n| :--- | :--- |\n| ${selectedText || "Data 1"} | Data 2 |\n`;
        cursorOffset = replacement.length;
        break;
      case "link":
        replacement = `[${selectedText || "Apptency"}](${selectedText ? "https://" : "https://github.com"})`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case "image":
        replacement = `![${selectedText || "Photo Alt"}](https://images.unsplash.com/photo-1517842645767-c639042777db?w=600)`;
        cursorOffset = replacement.length;
        break;
      case "kbd":
        replacement = `<kbd>${selectedText || "Enter"}</kbd>`;
        cursorOffset = replacement.length;
        break;
      case "details":
        replacement = `\n<details>\n<summary>${selectedText || "Collapsible Header"}</summary>\nAdd secret details here...\n</details>\n`;
        cursorOffset = replacement.length;
        break;
      case "color":
        replacement = `<span style="color: red">${selectedText || "colored text"}</span>`;
        cursorOffset = replacement.length;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 50);
  };

  const handleFindNext = () => {
    if (!searchQuery) return;
    const text = content;
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx !== -1) {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(idx, idx + searchQuery.length);
    } else {
      if (triggerCustomAlert) {
        triggerCustomAlert("Word Not Found", `"${searchQuery}" Not found in any notes.`);
      } else {
        alert(`"${searchQuery}" Not found in any notes.`);
      }
    }
  };

  const handleReplace = () => {
    if (!searchQuery) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText.toLowerCase() === searchQuery.toLowerCase()) {
      const newContent = content.substring(0, start) + replaceQuery + content.substring(end);
      handleContentChange(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + replaceQuery.length);
      }, 50);
    } else {
      handleFindNext();
    }
  };

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const occurrences = (content.match(new RegExp(searchQuery, "gi")) || []).length;
    if (occurrences === 0) {
      if (triggerCustomAlert) {
        triggerCustomAlert("No Occurrences", `"${searchQuery}" No occurrences found.`);
      } else {
        alert(`"${searchQuery}" No occurrences found.`);
      }
      return;
    }
    const regex = new RegExp(searchQuery, "gi");
    const newContent = content.replace(regex, replaceQuery);
    handleContentChange(newContent);
    if (triggerCustomAlert) {
      triggerCustomAlert("Replace All Successful", `Total ${occurrences} Occurrences have been replaced!`);
    } else {
      alert(`Total ${occurrences} Occurrences have been replaced!`);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      if (triggerCustomAlert) {
        triggerCustomAlert("Title Required", "A 'title' is required to save the note!");
      } else {
        alert("A 'title' is required to save the note!");
      }
      return;
    }
    onSave(title.trim(), content, tags);
  };

  const getThemeStyles = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-black text-white",
        cardBg: "bg-[#0d0d0d] border border-zinc-900",
        toolbarBg: "bg-zinc-950 border-y border-zinc-900",
        toolbarBtn: "hover:bg-zinc-900 text-zinc-400 hover:text-white",
        input: "bg-black border-zinc-900 text-white focus:border-indigo-500",
        chip: "bg-zinc-900 text-zinc-300 border border-zinc-800",
      };
    } else if (theme === "dark") {
      return {
        bg: "bg-zinc-950 text-zinc-100",
        cardBg: "bg-zinc-900 border border-zinc-800",
        toolbarBg: "bg-zinc-900 border-y border-zinc-800",
        toolbarBtn: "hover:bg-zinc-800 text-zinc-400 hover:text-white",
        input: "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500",
        chip: "bg-zinc-800 text-zinc-300 border border-zinc-700",
      };
    } else {
      return {
        bg: "bg-zinc-50 text-zinc-800",
        cardBg: "bg-white border border-zinc-200 shadow-xs",
        toolbarBg: "bg-zinc-100 border-y border-zinc-200",
        toolbarBtn: "hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950",
        input: "bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500",
        chip: "bg-zinc-100 text-zinc-700 border border-zinc-200",
      };
    }
  };

  const styles = getThemeStyles();
  const metrics = getMetrics();

  return (
    <div className={`flex flex-col h-full ${styles.bg}`}>
      {/* Editor Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 shrink-0 bg-white dark:bg-black">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-extrabold text-sm md:text-base leading-tight">
              {note ? "Edit Note" : "Create New Note"}
            </h2>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Folder: {folderName}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCheatSheet(true)}
            className="p-2 rounded-full text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
            title="Markdown Cheat Sheet"
          >
            <HelpCircle size={18} />
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm shadow-indigo-600/20"
          >
            <Save size={13} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Write / Preview Tab Switcher */}
      <div className="grid grid-cols-2 text-center border-b border-zinc-200 dark:border-zinc-900 shrink-0 bg-white dark:bg-black">
        <button
          onClick={() => setActiveTab("write")}
          className={`py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "write"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/10"
              : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Edit3 size={14} />
          <span>Write / Editor</span>
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "preview"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/10"
              : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Eye size={14} />
          <span>Real-time Preview</span>
        </button>
      </div>

      {/* Editor Body Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {activeTab === "write" ? (
          <>
            {/* Metadata Fields (Title and Tags) */}
            <div className="p-4 space-y-3 shrink-0 bg-white/50 dark:bg-black/20 border-b border-zinc-200/50 dark:border-zinc-900/50">
              {/* Title field */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.substring(0, 100))}
                placeholder="Enter an awesome note title..."
                className="w-full text-lg font-black bg-transparent border-b border-transparent focus:border-zinc-200 dark:focus:border-zinc-800 focus:outline-none pb-1 placeholder-zinc-400 text-zinc-900 dark:text-zinc-50"
              />

              {/* Tags Field with Form & interactive Chips */}
              <div className="space-y-1.5">
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value.substring(0, 20))}
                      placeholder="Add tag (e.g. startup, diary) and hit enter"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/60 focus:outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100 cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                {/* Displaying tag chips */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-full p-0.5"
                        >
                          <ArrowLeft size={10} className="rotate-45" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Markdown Toolbar Helper */}
            <div className={`p-1.5 flex items-center gap-1 overflow-x-auto whitespace-nowrap shrink-0 sticky top-0 z-10 ${styles.toolbarBg}`}>
              {/* Undo / Redo */}
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn} disabled:opacity-30 disabled:pointer-events-none`}
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn} disabled:opacity-30 disabled:pointer-events-none`}
                title="Redo (Ctrl+Y)"
              >
                <RotateCw size={14} />
              </button>
              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-1" />

              {/* Core formatting */}
              <button onClick={() => injectSyntax("bold")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Bold">
                <Bold size={14} />
              </button>
              <button onClick={() => injectSyntax("italic")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Italic">
                <Italic size={14} />
              </button>
              <button onClick={() => injectSyntax("h2")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Heading">
                <Heading1 size={14} />
              </button>
              <button onClick={() => injectSyntax("h3")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Sub-Heading">
                <Heading2 size={14} />
              </button>
              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-1" />

              {/* Lists and Quotes */}
              <button onClick={() => injectSyntax("todo")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Task List">
                <CheckSquare size={14} className="text-indigo-500" />
              </button>
              <button onClick={() => injectSyntax("bullet")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Bullet List">
                <List size={14} />
              </button>
              <button onClick={() => injectSyntax("number")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Numbered List">
                <ListOrdered size={14} />
              </button>
              <button onClick={() => injectSyntax("quote")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Blockquote">
                <Quote size={14} />
              </button>
              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-1" />

              {/* Objects and links */}
              <button onClick={() => injectSyntax("code")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Code Block">
                <Terminal size={14} />
              </button>
              <button onClick={() => injectSyntax("inline-code")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Inline Code">
                <Code size={14} />
              </button>
              <button onClick={() => injectSyntax("table")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Add GFM Table">
                <Table size={14} />
              </button>
              <button onClick={() => injectSyntax("link")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Add Link">
                <Link size={14} />
              </button>
              <button onClick={() => injectSyntax("image")} className={`p-1.5 rounded cursor-pointer ${styles.toolbarBtn}`} title="Add Image">
                <Image size={14} />
              </button>
              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-1" />

              {/* Rich HTML utilities */}
              <button onClick={() => injectSyntax("kbd")} className={`p-1 py-0.5 rounded text-[10px] font-bold font-mono border cursor-pointer border-zinc-300 dark:border-zinc-800 ${styles.toolbarBtn}`} title="Inline keyboard badge">
                KBD
              </button>
              <button onClick={() => injectSyntax("details")} className={`p-1 py-0.5 rounded text-[10px] font-bold font-mono border cursor-pointer border-zinc-300 dark:border-zinc-800 ${styles.toolbarBtn}`} title="Collapsible details list">
                TGL
              </button>
              <button onClick={() => injectSyntax("color")} className={`p-1 py-0.5 rounded text-[10px] font-bold font-mono border cursor-pointer border-zinc-300 dark:border-zinc-800 ${styles.toolbarBtn}`} title="Colored Text tag">
                RGB
              </button>

              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-1" />
              {/* VS Code Search & Replace trigger */}
              <button
                onClick={() => setShowSearchReplace(!showSearchReplace)}
                className={`p-1.5 rounded cursor-pointer ${showSearchReplace ? "bg-indigo-500 text-white" : styles.toolbarBtn}`}
                title="Search and Replace (Ctrl+F)"
              >
                <Search size={14} />
              </button>
            </div>

            {/* VS Code style Search & Replace Panel */}
            {showSearchReplace && (
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 space-y-2.5 text-xs animate-slideDown">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-black border border-zinc-200/ dark:border-zinc-800 rounded-lg px-2 py-1">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Find:</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search term..."
                      className="bg-transparent border-none outline-none flex-1 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Replace:</span>
                    <input
                      type="text"
                      value={replaceQuery}
                      onChange={(e) => setReplaceQuery(e.target.value)}
                      placeholder="Replace with..."
                      className="bg-transparent border-none outline-none flex-1 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleFindNext}
                    className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold hover:bg-zinc-300 cursor-pointer"
                  >
                    Find Next
                  </button>
                  <button
                    onClick={handleReplace}
                    className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100 cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    onClick={handleReplaceAll}
                    className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw size={10} />
                    Replace All
                  </button>
                </div>
              </div>
            )}

            {/* Line numbers + Textarea Grid */}
            <div className="flex-1 flex relative font-mono text-sm leading-relaxed">
              {/* Line numbers sidebar (VS Code feel) */}
              <div className="w-10 select-none py-4 text-right pr-2 text-zinc-400 dark:text-zinc-600 bg-zinc-100/30 dark:bg-black/10 border-r border-zinc-200/40 dark:border-zinc-900/40 font-mono text-xs text-semibold flex flex-col">
                {Array.from({ length: metrics.lines || 1 }).map((_, idx) => (
                  <div key={idx} className="h-5 leading-relaxed">
                    {idx + 1}
                  </div>
                ))}
              </div>

              {/* Markdown Editor Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your ideas in Markdown... Standard HTML and GitHub Flavored Markdown elements are supported!"
                className="flex-1 p-4 resize-none focus:outline-none bg-transparent h-full leading-relaxed select-text font-mono text-xs md:text-sm"
                style={{ minHeight: "250px" }}
              />
            </div>

            {/* Word details bar */}
            <div className="p-2 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400 font-mono font-bold bg-white dark:bg-black shrink-0">
              <span className="flex items-center gap-2">
                <span>CHARS: {metrics.chars}</span>
                <span>•</span>
                <span>WORDS: {metrics.words}</span>
                <span>•</span>
                <span>LINES: {metrics.lines}</span>
              </span>
              <span>Markdown (.md) format</span>
            </div>
          </>
        ) : (
          /* Live GFM Preview Tab */
          <div className="p-5 overflow-y-auto leading-relaxed select-text bg-white dark:bg-black h-full">
            {content.trim() === "" ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
                <BookOpen size={40} className="mb-3 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <p className="text-xs font-semibold">Start typing to see a live preview here!</p>
                <p className="text-[10px] mt-1 text-zinc-500">See your beautifully styled Markdown here</p>
              </div>
            ) : (
              <>
                <div className="mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-0.5 px-2 rounded-full font-bold border border-emerald-500/15">
                    Live Render Mode
                  </span>
                </div>
                <MarkdownRenderer
                  content={content}
                  onChangeContent={(newContent) => handleContentChange(newContent)}
                  fontSizeClass={fontSizeClass}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Markdown Cheat Sheet Drawer Overlay */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowCheatSheet(false)} />
          <div className={`relative w-full max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto ${styles.cardBg}`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-extrabold text-sm md:text-base flex items-center gap-1.5">
                <BookOpen size={16} className="text-indigo-500" />
                <span>Markdown Cheat Sheet 📝</span>
              </h3>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="leading-relaxed text-zinc-500">
                In Apptency, you can use the GitHub Flavored Markdown and HTML shortcuts below to create beautifully formatted notes:
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 font-mono">
                  <span className="font-bold text-indigo-500 font-sans block mb-1">Heading (Heading 1 to 3)</span>
                  # Big Heading <br />
                  ## Medium Heading <br />
                  ### Small Heading
                </div>

                <div className="p-2.5 rounded bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 font-mono">
                  <span className="font-bold text-indigo-500 font-sans block mb-1">Inline Emphasis</span>
                  **Bold** : <code className="text-rose-500">**text**</code><br />
                  *Italic* : <code className="text-rose-500">*text*</code><br />
                  ~~Strike~~ : <code className="text-rose-500">~~text~~</code>
                </div>

                <div className="p-2.5 rounded bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 font-mono">
                  <span className="font-bold text-indigo-500 font-sans block mb-1">Task Checklist (Interactive!)</span>
                  - [ ] First Task <br />
                  - [x] Complete Task <br />
                  <span className="text-[10px] text-zinc-500 font-sans block mt-1">
                    *Tip: You can click a checkbox directly in the preview to check or uncheck it!
                  </span>
                </div>

                <div className="p-2.5 rounded bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 font-mono">
                  <span className="font-bold text-indigo-500 font-sans block mb-1">Lists & Quotes</span>
                  - Point 1 <br />
                  1. Order Point 1 <br />
                  &gt; Important Blockquote message
                </div>

                <div className="p-2.5 rounded bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 font-mono">
                  <span className="font-bold text-indigo-500 font-sans block mb-1">Codes & Tables</span>
                  `inline code` <br />
                  ```js<br />
                  // code block<br />
                  ```<br />
                  | H1 | H2 | (Format grid directly)
                </div>

                <div className="p-2.5 rounded bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 font-mono">
                  <span className="font-bold text-indigo-500 font-sans block mb-1">Safe HTML Extras</span>
                  &lt;kbd&gt;Ctrl&lt;/kbd&gt; : Key label <br />
                  &lt;details&gt; collapsible sections <br />
                  &lt;span style="color:red"&gt; colorized texts
                </div>
              </div>

              <button
                onClick={() => setShowCheatSheet(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 text-center cursor-pointer mt-2"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
