import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { isAdmin } from "./admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Look up Discord account to get the Discord user ID
        const account = await prisma.account.findFirst({
          where: { userId: user.id, provider: "discord" },
          select: { providerAccountId: true },
        });
        const discordId = account?.providerAccountId ?? undefined;
        session.user.discordId = discordId;
        session.user.isAdmin = isAdmin(discordId);
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
