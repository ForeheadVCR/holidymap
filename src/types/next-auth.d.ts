import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId?: string;
      canEdit?: boolean;
      isAdmin?: boolean;
      voteWeight?: number;
    } & DefaultSession["user"];
  }
}
