"use client";

import { useActivityLog } from "@/hooks/useActivityLog";
import { ScrollText } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ActivityLogProps {
  activeRegion: string;
}

function formatAction(action: string, details: Record<string, unknown>): string {
  const category = (details.category as string) || "pin";
  const gridCell = (details.gridCell as string) || "";
  const location = gridCell ? ` at ${gridCell}` : "";

  switch (action) {
    case "pin_created":
      return `placed ${category}${location}`;
    case "pin_edited":
      return `edited ${category}${location}`;
    case "pin_deleted":
      return `deleted ${category}${location}`;
    case "vote_cast": {
      const value = details.value as number;
      const direction = value > 0 ? "upvoted" : "downvoted";
      return `${direction} (${value > 0 ? "+" : ""}${value}) ${category}${location}`;
    }
    case "vote_removed":
      return `removed vote on ${category}${location}`;
    default:
      return action;
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ActivityLog({ activeRegion }: ActivityLogProps) {
  const { logs, isLoading } = useActivityLog(activeRegion);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-t border-dune-dark-700/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-dune-sand-400 transition-colors hover:text-dune-sand-300"
      >
        <ScrollText className="h-3.5 w-3.5" />
        <span>Activity Log</span>
        <span className="ml-auto text-[10px] text-dune-sand-500/60">
          {expanded ? "▼" : "▶"}
        </span>
      </button>

      {expanded && (
        <div className="max-h-64 overflow-y-auto px-2 pb-2">
          {isLoading && (
            <p className="px-2 py-3 text-center text-xs text-gray-500">
              Loading...
            </p>
          )}

          {!isLoading && (!logs || logs.length === 0) && (
            <p className="px-2 py-3 text-center text-xs text-gray-500">
              No activity yet
            </p>
          )}

          {logs?.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-dune-dark-800/50"
            >
              {log.user.image ? (
                <Image
                  src={log.user.image}
                  alt=""
                  width={18}
                  height={18}
                  className="mt-0.5 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="mt-0.5 h-[18px] w-[18px] rounded-full bg-dune-dark-700 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug text-gray-300">
                  <span className="font-medium text-gray-200">
                    {log.user.name || "Unknown"}
                  </span>{" "}
                  {formatAction(log.action, log.details)}
                </p>
                {typeof log.details.note === "string" && log.details.note && (
                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                    &quot;{log.details.note}&quot;
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 text-[10px] text-gray-600">
                {timeAgo(log.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
