import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

import { getUserByEmail } from "@/lib/models/user.model";
import { verifyPassword } from "@/lib/utils";
import { SignInSchema } from "@/lib/validation/user";

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validateFields = SignInSchema.safeParse(credentials);

        if (!validateFields.success) return null;

        const { email, password } = validateFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const isValid = await verifyPassword(password, user.password);

        if (isValid) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
