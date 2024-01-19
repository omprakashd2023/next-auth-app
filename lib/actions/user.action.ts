"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/email";
import { hashPassword, verifyPassword } from "@/lib/utils";
import { createUser, getUserByEmail } from "@/lib/models/user.model";
import { generateVerificationToken } from "@/lib/token";
import {
  SignInSchema,
  SignUpSchema,
  SignInSchemaType,
  SignUpSchemaType,
} from "@/lib/validation/user";
import { DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN } from "@/routes";

export const signin = async (data: SignInSchemaType) => {
  const validateFields = SignInSchema.safeParse(data);
  if (!validateFields.success) throw new Error(validateFields.error.message);

  const { email, password } = validateFields.data;

  const user = await getUserByEmail(email);
  if (!user || !user.email || !user.password)
    throw new Error("User does not exist!!");

  if (!verifyPassword(password, user.password))
    throw new Error("Invalid credentials");

  if (!user.emailVerified) {
    const token = await generateVerificationToken(email);

    await sendVerificationEmail(token.email, user.name!, token.token);

    return {
      success: true,
      message: "Verification email has been sent to your email address",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      redirect: DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN,
    };
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new Error("Invalid credentials");
        default:
          throw new Error("Something went wrong");
      }
    }
    throw error;
  }
};

export const signup = async (data: SignUpSchemaType) => {
  try {
    const validateFields = SignUpSchema.safeParse(data);
    if (!validateFields.success) throw new Error(validateFields.error.message);

    const { name, email, password } = validateFields.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await hashPassword(password);

    await createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = await generateVerificationToken(email);

    await sendVerificationEmail(token.email, name, token.token);

    return {
      success: true,
      message: "Verification email has been sent to your email address",
    };
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
};
