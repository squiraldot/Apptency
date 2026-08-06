import React, { useState } from "react";
import { CheckSquare, Square, Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  onChangeContent?: (newContent: string) => void;
  fontSizeClass?: string; 
}

export function MarkdownRenderer({ content, onChangeContent, fontSizeClass = "text-base" }: MarkdownRendererProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const lines = content.split("\n");

  const handleToggleCheckbox = (lineIndex: number) => {
    if (!onChangeContent) return;
    const newLines = [...lines];
    const targetLine = newLines[lineIndex];
    
    const matchUnordered = targetLine.match(/^(\s*[-*+]\s+\[)([ xX])(\]\s+.*)$/);
    if (matchUnordered) {
      const currentVal = matchUnordered[2];
      const newVal = currentVal === " " ? "x" : " ";
      newLines[lineIndex] = `${matchUnordered[1]}${newVal}${matchUnordered[3]}`;
      onChangeContent(newLines.join("\n"));
      return;
    }

    const matchOrdered = targetLine.match(/^(\s*\d+\.\s+\[)([ xX])(\]\s+.*)$/);
    if (matchOrdered) {
      const currentVal = matchOrdered[2];
      const newVal = currentVal === " " ? "x" : " ";
      newLines[lineIndex] = `${matchOrdered[1]}${newVal}${matchOrdered[3]}`;
      onChangeContent(newLines.join("\n"));
      return;
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const parseInlineElements = (text: string): React.ReactNode[] => {
    if (!text) return [];

    let parts: React.ReactNode[] = [];
    let currentText = text;
    let index = 0;

    while (currentText.length > 0) {
      const imgMatch = currentText.match(/^!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const src = imgMatch[2];
        parts.push(
          <img
            key={`img-${index++}`}
            src={src}
            alt={alt}
            className="rounded-lg max-w-full h-auto my-2 border border-zinc-200 dark:border-zinc-800 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80"; 
            }}
          />
        );
        currentText = currentText.substring(imgMatch[0].length);
        continue;
      }

      const linkMatch = currentText.match(/^\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const href = linkMatch[2];
        parts.push(
          <a
            key={`link-${index++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline inline-flex items-center gap-0.5 font-medium"
          >
            {linkText}
          </a>
        );
        currentText = currentText.substring(linkMatch[0].length);
        continue;
      }

      const boldMatch = currentText.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        parts.push(
          <strong key={`bold-${index++}`} className="font-extrabold text-zinc-900 dark:text-white">
            {boldMatch[2]}
          </strong>
        );
        currentText = currentText.substring(boldMatch[0].length);
        continue;
      }

      const italicMatch = currentText.match(/^(\*|_)(.*?)\1/);
      if (italicMatch) {
        parts.push(
          <em key={`italic-${index++}`} className="italic text-zinc-800 dark:text-zinc-200">
            {italicMatch[2]}
          </em>
        );
        currentText = currentText.substring(italicMatch[0].length);
        continue;
      }

      const strikeMatch = currentText.match(/^~~(.*?)~~/);
      if (strikeMatch) {
        parts.push(
          <del key={`strike-${index++}`} className="line-through text-zinc-400 dark:text-zinc-500">
            {strikeMatch[1]}
          </del>
        );
        currentText = currentText.substring(strikeMatch[0].length);
        continue;
      }

      const codeMatch = currentText.match(/^`(.*?)`/);
      if (codeMatch) {
        parts.push(
          <code
            key={`code-${index++}`}
            className="px-1.5 py-0.5 rounded font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-rose-500 border border-zinc-200 dark:border-zinc-700"
          >
            {codeMatch[1]}
          </code>
        );
        currentText = currentText.substring(codeMatch[0].length);
        continue;
      }

      const kbdMatch = currentText.match(/^<kbd>(.*?)<\/kbd>/i);
      if (kbdMatch) {
        parts.push(
          <kbd
            key={`kbd-${index++}`}
            className="px-2 py-1 text-xs font-semibold text-zinc-800 bg-zinc-100 border border-zinc-300 rounded shadow-sm dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 inline-block font-mono"
          >
            {kbdMatch[1]}
          </kbd>
        );
        currentText = currentText.substring(kbdMatch[0].length);
        continue;
      }

      const insMatch = currentText.match(/^<ins>(.*?)<\/ins>/i);
      if (insMatch) {
        parts.push(
          <ins key={`ins-${index++}`} className="underline decoration-indigo-400">
            {insMatch[1]}
          </ins>
        );
        currentText = currentText.substring(insMatch[0].length);
        continue;
      }

      const delMatch = currentText.match(/^<del>(.*?)<\/del>/i);
      if (delMatch) {
        parts.push(
          <del key={`del-${index++}`} className="line-through text-zinc-400">
            {delMatch[1]}
          </del>
        );
        currentText = currentText.substring(delMatch[0].length);
        continue;
      }

      const spanMatch = currentText.match(/^<span\s+style="color:\s*(.*?)"\s*>(.*?)<\/span>/i);
      if (spanMatch) {
        const colorVal = spanMatch[1];
        const innerText = spanMatch[2];
        parts.push(
          <span key={`span-${index++}`} style={{ color: colorVal }}>
            {innerText}
          </span>
        );
        currentText = currentText.substring(spanMatch[0].length);
        continue;
      }

      const brMatch = currentText.match(/^<br\s*\/?>/i);
      if (brMatch) {
        parts.push(<br key={`br-${index++}`} />);
        currentText = currentText.substring(brMatch[0].length);
        continue;
      }

      parts.push(currentText[0]);
      currentText = currentText.substring(1);
    }

    return parts;
  };

  const renderElements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace(/^```/, "").trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      const codeText = codeLines.join("\n");
      const blockId = `code-block-${i}`;
      renderElements.push(
        <div key={`codeblock-${i}`} className="my-4 rounded-xl overflow-hidden shadow-md font-mono text-sm border border-zinc-200 dark:border-zinc-800">
          <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
            <span className="uppercase font-semibold tracking-wider text-[10px]">{lang}</span>
            <button
              onClick={() => handleCopyCode(codeText, blockId)}
              className="flex items-center gap-1 hover:text-indigo-500 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              {copiedId === blockId ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-zinc-950 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed select-text font-mono text-xs md:text-sm">
            <code>{codeText}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      renderElements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-3 pl-4 py-2 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-zinc-700 dark:text-zinc-300 rounded-r-lg italic"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx}>{parseInlineElements(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && lines[i + 1].trim().includes("|")) {
      const tableHeaders = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      const nextLine = lines[i + 1].trim();
      const isSeparator = nextLine.split("|").every((cell, idx, arr) => {
        if (idx === 0 || idx === arr.length - 1) return true;
        const trimmed = cell.trim();
        return trimmed.startsWith(":") || trimmed.endsWith(":") || trimmed.match(/^-+$/);
      });

      if (isSeparator) {
        const tableRows: string[][] = [];
        i += 2; 
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          const cells = lines[i]
            .split("|")
            .map((cell) => cell.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          tableRows.push(cells);
          i++;
        }

        renderElements.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  {tableHeaders.map((hdr, hIdx) => (
                    <th key={hIdx} className="p-3 font-semibold text-zinc-700 dark:text-zinc-300">
                      {parseInlineElements(hdr)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    {tableHeaders.map((_, hIdx) => (
                      <td key={hIdx} className="p-3 text-zinc-600 dark:text-zinc-300">
                        {row[hIdx] ? parseInlineElements(row[hIdx]) : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    if (line.trim().toLowerCase().startsWith("<details>")) {
      let summaryText = "Details";
      const detailLines: string[] = [];
      i++;
      
      if (i < lines.length && lines[i].trim().toLowerCase().startsWith("<summary>")) {
        summaryText = lines[i].replace(/<\/?summary>/gi, "").trim();
        i++;
      }
      
      while (i < lines.length && !lines[i].trim().toLowerCase().includes("</details>")) {
        detailLines.push(lines[i]);
        i++;
      }
      
      renderElements.push(
        <details key={`details-${i}`} className="my-3 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900/40">
          <summary className="p-3 font-semibold text-sm cursor-pointer select-none border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            {summaryText}
          </summary>
          <div className="p-3 text-xs md:text-sm space-y-2 leading-relaxed">
            {detailLines.map((dl, dlIdx) => (
              <p key={dlIdx}>{parseInlineElements(dl)}</p>
            ))}
          </div>
        </details>
      );
      i++;
      continue;
    }

    const isUnorderedChecklist = line.match(/^(\s*[-*+]\s+\[)([ xX])(\]\s+)(.*)$/);
    const isOrderedChecklist = line.match(/^(\s*\d+\.\s+\[)([ xX])(\]\s+)(.*)$/);

    if (isUnorderedChecklist || isOrderedChecklist) {
      const match = isUnorderedChecklist || isOrderedChecklist;
      const checked = match![2].toLowerCase() === "x";
      const textPart = match![4];
      const currentLineIndex = i;

      renderElements.push(
        <div
          key={`checklist-${i}`}
          className="flex items-start gap-3 py-1 cursor-pointer group select-none hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10 rounded-md px-1 transition-colors"
          onClick={() => handleToggleCheckbox(currentLineIndex)}
        >
          <button className="mt-0.5 shrink-0 text-indigo-500 focus:outline-none" aria-label="Toggle task">
            {checked ? (
              <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400 fill-indigo-100 dark:fill-indigo-950" />
            ) : (
              <Square size={18} className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400" />
            )}
          </button>
          <span className={`text-sm leading-tight transition-all duration-200 ${checked ? "line-through text-zinc-400 dark:text-zinc-500 font-normal" : "text-zinc-800 dark:text-zinc-200 font-medium"}`}>
            {parseInlineElements(textPart)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    const headerMatch = line.match(/^(\s*)(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[2].length;
      const headerText = headerMatch[3];
      
      const baseHeaderStyles = "font-extrabold tracking-tight mt-4 mb-2 text-zinc-900 dark:text-white leading-tight";
      
      if (level === 1) {
        renderElements.push(
          <h1 key={`h1-${i}`} className={`${baseHeaderStyles} text-2xl border-b pb-2 border-zinc-200 dark:border-zinc-800`}>
            {parseInlineElements(headerText)}
          </h1>
        );
      } else if (level === 2) {
        renderElements.push(
          <h2 key={`h2-${i}`} className={`${baseHeaderStyles} text-xl border-b pb-1 border-zinc-100 dark:border-zinc-800/50`}>
            {parseInlineElements(headerText)}
          </h2>
        );
      } else if (level === 3) {
        renderElements.push(
          <h3 key={`h3-${i}`} className={`${baseHeaderStyles} text-lg font-bold`}>
            {parseInlineElements(headerText)}
          </h3>
        );
      } else {
        renderElements.push(
          <h4 key={`h4-${i}`} className={`${baseHeaderStyles} text-base font-semibold`}>
            {parseInlineElements(headerText)}
          </h4>
        );
      }
      i++;
      continue;
    }

    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      renderElements.push(
        <hr key={`hr-${i}`} className="my-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800" />
      );
      i++;
      continue;
    }

    const isUnorderedList = line.match(/^(\s*[-*+]\s+)(.*)$/);
    const isOrderedList = line.match(/^(\s*\d+\.\s+)(.*)$/);

    if (isUnorderedList) {
      const indent = isUnorderedList[1].replace(/[-*+]/, "").length;
      const contentText = isUnorderedList[2];
      renderElements.push(
        <div key={`ul-${i}`} style={{ paddingLeft: `${Math.max(12, indent * 8)}px` }} className="flex items-start gap-2 py-0.5">
          <span className="text-indigo-500 select-none mt-1.5 shrink-0 text-[10px]">•</span>
          <span className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            {parseInlineElements(contentText)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    if (isOrderedList) {
      const numPart = isOrderedList[1].trim();
      const contentText = isOrderedList[2];
      renderElements.push(
        <div key={`ol-${i}`} className="pl-3 flex items-start gap-2 py-0.5">
          <span className="text-indigo-500 font-mono text-xs select-none mt-0.5 shrink-0 font-bold">{numPart}</span>
          <span className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            {parseInlineElements(contentText)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      renderElements.push(<div key={`empty-${i}`} className="h-2" />);
    } else {
      renderElements.push(
        <p key={`p-${i}`} className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm my-1">
          {parseInlineElements(line)}
        </p>
      );
    }

    i++;
  }

  return (
    <div className={`prose dark:prose-invert max-w-none select-text ${fontSizeClass} space-y-1`}>
      {renderElements}
    </div>
  );
}
