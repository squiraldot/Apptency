"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importNotesFromZip = exports.exportNotesToZip = exports.COLOR_MAP = void 0;
var jszip_1 = require("jszip");
exports.COLOR_MAP = {
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
function serializeNoteToMarkdown(note, folderColor) {
    var frontmatter = [
        "---",
        "title: ".concat(note.title.replace(/"/g, '\\"')),
        "tags: ".concat(note.tags.join(", ")),
        "createdAt: ".concat(note.createdAt),
        "updatedAt: ".concat(note.updatedAt),
        "folderColor: ".concat(folderColor),
        "---",
        "",
        note.content,
    ].join("\n");
    return frontmatter;
}
function parseMarkdownToNote(markdownText, fallbackTitle) {
    var frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    var match = markdownText.match(frontmatterRegex);
    var title = fallbackTitle;
    var tags = [];
    var createdAt = Date.now();
    var updatedAt = Date.now();
    var folderColor = "blue";
    var content = markdownText;
    if (match) {
        var yamlContent = match[1];
        content = markdownText.substring(match[0].length);
        var yamlLines = yamlContent.split("\n");
        yamlLines.forEach(function (line) {
            var idx = line.indexOf(":");
            if (idx !== -1) {
                var key = line.substring(0, idx).trim().toLowerCase();
                var val = line.substring(idx + 1).trim();
                if (key === "title") {
                    title = val.replace(/^"|"$/g, "").trim();
                }
                else if (key === "tags") {
                    tags = val
                        ? val
                            .split(",")
                            .map(function (t) { return t.trim(); })
                            .filter(function (t) { return t.length > 0; })
                        : [];
                }
                else if (key === "createdat") {
                    var parsed = Number(val);
                    if (!isNaN(parsed))
                        createdAt = parsed;
                }
                else if (key === "updatedat") {
                    var parsed = Number(val);
                    if (!isNaN(parsed))
                        updatedAt = parsed;
                }
                else if (key === "foldercolor") {
                    folderColor = val;
                }
            }
        });
    }
    return { title: title, tags: tags, createdAt: createdAt, updatedAt: updatedAt, folderColor: folderColor, content: content };
}
function sanitizeFilename(name) {
    return name.replace(/[\\/:*?"<>|]/g, "_");
}
function exportNotesToZip(folders, notes) {
    return __awaiter(this, void 0, Promise, function () {
        var zip;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zip = new jszip_1.default();
                    folders.forEach(function (folder) {
                        var folderDirName = sanitizeFilename(folder.name);
                        var folderNotes = notes.filter(function (note) { return note.folderId === folder.id; });
                        folderNotes.forEach(function (note) {
                            var markdownContent = serializeNoteToMarkdown(note, folder.color);
                            var noteFilename = "".concat(sanitizeFilename(note.title) || "Untitled", ".md");
                            zip.file("".concat(folderDirName, "/").concat(noteFilename), markdownContent);
                        });
                        if (folderNotes.length === 0) {
                            zip.file("".concat(folderDirName, "/.keep"), "");
                        }
                    });
                    return [4 /*yield*/, zip.generateAsync({ type: "blob" })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.exportNotesToZip = exportNotesToZip;
function importNotesFromZip(file, currentFolders, currentNotes) {
    return __awaiter(this, void 0, Promise, function () {
        var zip, updatedFolders, updatedNotes, importedCount, folderNameToId, files, _i, files_1, path, fileEntry, content, pathParts, folderName, filename, fallbackTitle, parsed, folderId, validColors, selectedColor, newFolder, newNote;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jszip_1.default.loadAsync(file)];
                case 1:
                    zip = _a.sent();
                    updatedFolders = __spreadArray([], currentFolders, true);
                    updatedNotes = __spreadArray([], currentNotes, true);
                    importedCount = 0;
                    folderNameToId = {};
                    updatedFolders.forEach(function (f) {
                        folderNameToId[f.name.toLowerCase()] = f.id;
                    });
                    files = Object.keys(zip.files);
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    path = files_1[_i];
                    fileEntry = zip.files[path];
                    if (fileEntry.dir || path.includes("__MACOSX") || path.endsWith(".keep") || path.endsWith(".DS_Store")) {
                        return [3 /*break*/, 4];
                    }
                    if (!path.endsWith(".md")) return [3 /*break*/, 4];
                    return [4 /*yield*/, fileEntry.async("string")];
                case 3:
                    content = _a.sent();
                    pathParts = path.split("/");
                    folderName = "Imported Notes";
                    filename = pathParts[pathParts.length - 1];
                    if (pathParts.length > 1) {
                        folderName = pathParts[pathParts.length - 2];
                    }
                    fallbackTitle = filename.replace(/\.md$/, "");
                    parsed = parseMarkdownToNote(content, fallbackTitle);
                    folderId = folderNameToId[folderName.toLowerCase()];
                    if (!folderId) {
                        folderId = "folder_".concat(Math.random().toString(36).substr(2, 9));
                        validColors = ["red", "green", "blue", "yellow", "purple", "pink"];
                        selectedColor = validColors.includes(parsed.folderColor)
                            ? parsed.folderColor
                            : validColors[Math.floor(Math.random() * validColors.length)];
                        newFolder = {
                            id: folderId,
                            name: folderName,
                            color: selectedColor,
                            createdAt: Date.now(),
                        };
                        updatedFolders.push(newFolder);
                        folderNameToId[folderName.toLowerCase()] = folderId;
                    }
                    newNote = {
                        id: "note_".concat(Math.random().toString(36).substr(2, 9)),
                        folderId: folderId,
                        title: parsed.title,
                        content: parsed.content,
                        tags: parsed.tags,
                        createdAt: parsed.createdAt,
                        updatedAt: parsed.updatedAt,
                    };
                    updatedNotes.push(newNote);
                    importedCount++;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        folders: updatedFolders,
                        notes: updatedNotes,
                        importedCount: importedCount,
                    }];
            }
        });
    });
}
exports.importNotesFromZip = importNotesFromZip;
