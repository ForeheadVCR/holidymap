"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useVote } from "@/hooks/useVote";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  pinId: string;
  initialScore: number;
  initialUserVote?: number | null;
}

export default function VoteButtons({
  pinId,
  initialScore,
  initialUserVote,
}: VoteButtonsProps) {
  const { data: session } = useSession();
  const { score, userVote, vote, isVoting } = useVote(
    pinId,
    initialScore,
    initialUserVote
  );

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => vote(1)}
        disabled={!session || isVoting}
        className={cn(
          "rounded-md p-1 transition-all hover:bg-dune-dark-800 hover:scale-110 disabled:opacity-40 disabled:hover:scale-100",
          userVote === 1 ? "text-green-400" : "text-gray-500 hover:text-gray-400"
        )}
        title={session ? "Upvote" : "Sign in to vote"}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <span
        className={cn(
          "min-w-[24px] text-center font-mono text-sm font-medium tabular-nums",
          score > 0 && "text-green-400",
          score < 0 && "text-red-400",
          score === 0 && "text-gray-500"
        )}
        style={score > 0 ? { textShadow: "0 0 8px rgba(74, 222, 128, 0.3)" } : score < 0 ? { textShadow: "0 0 8px rgba(248, 113, 113, 0.3)" } : undefined}
      >
        {score}
      </span>
      <button
        onClick={() => vote(-1)}
        disabled={!session || isVoting}
        className={cn(
          "rounded-md p-1 transition-all hover:bg-dune-dark-800 hover:scale-110 disabled:opacity-40 disabled:hover:scale-100",
          userVote === -1 ? "text-red-400" : "text-gray-500 hover:text-gray-400"
        )}
        title={session ? "Downvote" : "Sign in to vote"}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}
