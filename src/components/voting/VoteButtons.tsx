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
          "rounded p-0.5 transition-colors hover:bg-dune-dark-800 disabled:opacity-40",
          userVote === 1 ? "text-green-400" : "text-gray-500"
        )}
        title={session ? "Upvote" : "Sign in to vote"}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <span
        className={cn(
          "min-w-[24px] text-center font-mono text-sm tabular-nums",
          score > 0 && "text-green-400",
          score < 0 && "text-red-400",
          score === 0 && "text-gray-500"
        )}
      >
        {score}
      </span>
      <button
        onClick={() => vote(-1)}
        disabled={!session || isVoting}
        className={cn(
          "rounded p-0.5 transition-colors hover:bg-dune-dark-800 disabled:opacity-40",
          userVote === -1 ? "text-red-400" : "text-gray-500"
        )}
        title={session ? "Downvote" : "Sign in to vote"}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}
