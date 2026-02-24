import { useState, useCallback } from "react";

export function useVote(pinId: string, initialScore: number, initialUserVote: number | null | undefined) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number | null>(initialUserVote ?? null);
  const [isVoting, setIsVoting] = useState(false);

  const vote = useCallback(
    async (value: 1 | -1) => {
      if (isVoting) return;
      setIsVoting(true);

      const newValue = userVote === value ? null : value;

      // Optimistic update
      const scoreDiff =
        (newValue ?? 0) - (userVote ?? 0);
      setScore((prev) => prev + scoreDiff);
      setUserVote(newValue);

      try {
        let res: Response;
        if (newValue === null) {
          res = await fetch(`/api/pins/${pinId}/vote`, { method: "DELETE" });
        } else {
          res = await fetch(`/api/pins/${pinId}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: newValue }),
          });
        }

        if (res.ok) {
          const data = await res.json();
          // Use the server's authoritative score (accounts for vote weight)
          setScore(data.voteScore);
        } else {
          // Revert on error
          setScore(initialScore);
          setUserVote(initialUserVote ?? null);
        }
      } catch {
        // Revert on error
        setScore(initialScore);
        setUserVote(initialUserVote ?? null);
      } finally {
        setIsVoting(false);
      }
    },
    [pinId, userVote, isVoting, initialScore, initialUserVote]
  );

  return { score, userVote, vote, isVoting };
}
