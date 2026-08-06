import JSZip from "jszip";

export interface Folder {
  id: string;
  name: string;
  color: string; 
  createdAt: number;
}

export interface Note {
  id: string;
  folderId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export const COLOR_MAP: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
    hex: "#EF4444",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
    hex: "#10B981",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
    hex: "#3B82F6",
  },
  yellow: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
    hex: "#F59E0B",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900/50",
    hex: "#8B5CF6",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/20",
    text: "text-pink-700 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-900/50",
    hex: "#EC4899",
  },
};

function serializeNoteToMarkdown(note: Note, folderColor: string): string {
  const frontmatter = [
    "---",
    `title: ${note.title.replace(/"/g, '\\"')}`,
    `tags: ${note.tags.join(", ")}`,
    `createdAt: ${note.createdAt}`,
    `updatedAt: ${note.updatedAt}`,
    `folderColor: ${folderColor}`,
    "---",
    "",
    note.content,
  ].join("\n");

  return frontmatter;
}

interface ParsedNote {
  title: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  folderColor: string;
  content: string;
}

function parseMarkdownToNote(markdownText: string, fallbackTitle: string): ParsedNote {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = markdownText.match(frontmatterRegex);

  let title = fallbackTitle;
  let tags: string[] = [];
  let createdAt = Date.now();
  let updatedAt = Date.now();
  let folderColor = "blue";
  let content = markdownText;

  if (match) {
    const yamlContent = match[1];
    content = markdownText.substring(match[0].length);

    const yamlLines = yamlContent.split("\n");
    yamlLines.forEach((line) => {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.substring(0, idx).trim().toLowerCase();
        const val = line.substring(idx + 1).trim();

        if (key === "title") {
          title = val.replace(/^"|"$/g, "").trim();
        } else if (key === "tags") {
          tags = val
            ? val
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0)
            : [];
        } else if (key === "createdat") {
          const parsed = Number(val);
          if (!isNaN(parsed)) createdAt = parsed;
        } else if (key === "updatedat") {
          const parsed = Number(val);
          if (!isNaN(parsed)) updatedAt = parsed;
        } else if (key === "foldercolor") {
          folderColor = val;
        }
      }
    });
  }

  return { title, tags, createdAt, updatedAt, folderColor, content };
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_");
}

export async function exportNotesToZip(folders: Folder[], notes: Note[]): Promise<Blob> {
  const zip = new JSZip();

  folders.forEach((folder) => {
    const folderDirName = sanitizeFilename(folder.name);
    const folderNotes = notes.filter((note) => note.folderId === folder.id);

    folderNotes.forEach((note) => {
      const markdownContent = serializeNoteToMarkdown(note, folder.color);
      const noteFilename = `${sanitizeFilename(note.title) || "Untitled"}.md`;
      zip.file(`${folderDirName}/${noteFilename}`, markdownContent);
    });

    if (folderNotes.length === 0) {
      zip.file(`${folderDirName}/.keep`, "");
    }
  });

  return await zip.generateAsync({ type: "blob" });
}

export async function importNotesFromZip(
  file: File,
  currentFolders: Folder[],
  currentNotes: Note[]
): Promise<{ folders: Folder[]; notes: Note[]; importedCount: number }> {
  const zip = await JSZip.loadAsync(file);
  const updatedFolders = [...currentFolders];
  const updatedNotes = [...currentNotes];
  let importedCount = 0;

  const folderNameToId: Record<string, string> = {};
  updatedFolders.forEach((f) => {
    folderNameToId[f.name.toLowerCase()] = f.id;
  });

  const files = Object.keys(zip.files);

  for (const path of files) {
    const fileEntry = zip.files[path];
    
    if (fileEntry.dir || path.includes("__MACOSX") || path.endsWith(".keep") || path.endsWith(".DS_Store")) {
      continue;
    }

    if (path.endsWith(".md")) {
      const content = await fileEntry.async("string");

      const pathParts = path.split("/");
      let folderName = "Imported Notes";
      let filename = pathParts[pathParts.length - 1];

      if (pathParts.length > 1) {
        folderName = pathParts[pathParts.length - 2];
      }

      const fallbackTitle = filename.replace(/\.md$/, "");
      const parsed = parseMarkdownToNote(content, fallbackTitle);

      let folderId = folderNameToId[folderName.toLowerCase()];
      if (!folderId) {
        folderId = `folder_${Math.random().toString(36).substr(2, 9)}`;
        const validColors = ["red", "green", "blue", "yellow", "purple", "pink"];
        const selectedColor = validColors.includes(parsed.folderColor)
          ? parsed.folderColor
          : validColors[Math.floor(Math.random() * validColors.length)];

        const newFolder: Folder = {
          id: folderId,
          name: folderName,
          color: selectedColor,
          createdAt: Date.now(),
        };

        updatedFolders.push(newFolder);
        folderNameToId[folderName.toLowerCase()] = folderId;
      }

      const newNote: Note = {
        id: `note_${Math.random().toString(36).substr(2, 9)}`,
        folderId,
        title: parsed.title,
        content: parsed.content,
        tags: parsed.tags,
        createdAt: parsed.createdAt,
        updatedAt: parsed.updatedAt,
      };

      updatedNotes.push(newNote);
      importedCount++;
    }
  }

  return {
    folders: updatedFolders,
    notes: updatedNotes,
    importedCount,
  };
}
