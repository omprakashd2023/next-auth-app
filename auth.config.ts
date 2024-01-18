import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { getUserByEmail } from "@/lib/models/user.model";
import { verifyPassword } from "@/lib/utils";
import { SignInSchema } from "@/lib/validation/user";

export default {
  providers: [
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
