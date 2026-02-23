"use client";

import { signIn } from "next-auth/react";
import { MessageCircle } from "lucide-react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("discord")}
      className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752c4]"
    >
      <MessageCircle className="h-4 w-4" />
      Sign in with Discord
    </button>
  );
}
