"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { hashPassword } from "@/lib/utils";
import { createUser, getUserByEmail } from "@/lib/models/user.model";
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

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: "Verification email has been sent to your email address",
    };
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
};
