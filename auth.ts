import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import prisma from "@/lib/prisma";
import { getUserById, setEmailVerification } from "./lib/models/user.model";

import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmation,
} from "@/lib/models/two-factor-confirmation.model";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/sign-in",
    // error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await setEmailVerification(user.id!);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;

      if (existingUser.is2FAEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmation(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }

      return true;
    },

    // @ts-ignore
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await getUserById(token.sub);
      if (!user) return token;
      token.role = user.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
