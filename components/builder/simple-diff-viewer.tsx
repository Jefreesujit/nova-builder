"use client";

import { useMemo } from "react";
import * as Diff from "diff";

interface SimpleDiffViewerProps {
  oldCode: string;
  newCode: string;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber?: number;
}

export function SimpleDiffViewer({ oldCode, newCode }: SimpleDiffViewerProps) {
  const lines = useMemo(() => {
    const changes = Diff.diffLines(oldCode, newCode);
    const result: DiffLine[] = [];

    let leftLineNumber = 1;
    let rightLineNumber = 1;

    changes.forEach((part) => {
      const partLines = part.value.split('\n');
      if (partLines[partLines.length - 1] === '') partLines.pop();

      partLines.forEach((line) => {
        if (part.added) {
          result.push({ type: "added", content: line, lineNumber: rightLineNumber++ });
        } else if (part.removed) {
          result.push({ type: "removed", content: line, lineNumber: leftLineNumber++ });
        } else {
          result.push({ type: "unchanged", content: line, lineNumber: rightLineNumber++ });
          leftLineNumber++;
        }
      });
    });

    return result;
  }, [oldCode, newCode]);

  return (
    <div className="flex flex-col text-[11px] font-mono h-full bg-[#1d1f21] text-gray-300 overflow-auto custom-scrollbar">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`flex min-h-[1.5rem] w-full border-l-2 ${line.type === 'removed'
              ? 'bg-red-500/10 border-red-500/50 text-red-200/80'
              : line.type === 'added'
                ? 'bg-green-500/10 border-green-500/50 text-green-200/80'
                : 'border-transparent hover:bg-white/5'
            }`}
        >
          {/* Gutter / Line Numbers */}
          <div className="flex w-12 flex-shrink-0 select-none opacity-40 text-right pr-3 border-r border-white/5 bg-[#1d1f21]">
            <span className="w-full">
              {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : line.lineNumber}
            </span>
          </div>

          {/* Line Content */}
          <div className="flex-1 px-4 whitespace-pre overflow-visible">
            {line.content || " "}
          </div>
        </div>
      ))}
    </div>
  );
}
