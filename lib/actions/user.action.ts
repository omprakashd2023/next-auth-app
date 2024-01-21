"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { sendEmail } from "@/lib/email";
import { hashPassword, verifyPassword } from "@/lib/utils";
import {
  createUser,
  getUserByEmail,
  updateUser,
  setEmailVerification,
} from "@/lib/models/user.model";
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "@/lib/models/verification-token.model";
import {
  deleteResetToken,
  getResetTokenByToken,
} from "@/lib/models/reset-token.model";
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/lib/models/two-factor-token.model";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmation,
} from "@/lib/models/two-factor-confirmation.model";
import {
  SignInSchema,
  SignUpSchema,
  SignInSchemaType,
  SignUpSchemaType,
  NewPasswordSchema,
  NewPasswordSchemaType,
} from "@/lib/validation/user";

import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";

import { DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN } from "@/routes";

export const signin = async (data: SignInSchemaType) => {
  const validateFields = SignInSchema.safeParse(data);
  if (!validateFields.success) throw new Error(validateFields.error.message);

  const { email, password, code } = validateFields.data;

  const user = await getUserByEmail(email);
  if (!user || !user.email || !user.password)
    throw new Error("Email does not exist!!");

  if (!verifyPassword(password, user.password))
    throw new Error("Invalid credentials");

  if (!user.emailVerified) {
    const token = await generateVerificationToken(email);

    await sendEmail({
      email: token.email,
      name: user.name!,
      token: token.token,
      path: "/verify-email",
      subject: "Verify your email",
      body: "You need to verify your email, to login. Please click the below button to verify your email.",
      btnTitle: "Verify Email",
    });

    return {
      success: true,
      message: "Verification email has been sent to your email address",
    };
  }

  if (user.is2FAEnabled && user.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

      if (!twoFactorToken || twoFactorToken.token !== code)
        throw new Error("Invalid two factor authentication code");

      const hasExpired = twoFactorToken.expiresAt < new Date();
      if (hasExpired)
        throw new Error("Two factor authentication code has expired");

      await deleteTwoFactorToken(twoFactorToken.id);
      const existingConfirmation = await getTwoFactorConfirmation(user.id);

      if (existingConfirmation) await deleteTwoFactorConfirmation(user.id);

      await createTwoFactorConfirmation(user.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(user.email);
      await sendEmail({
        email: user.email,
        name: user.name!,
        subject: "Two Factor Authentication Code",
        body: "Here is your two factor authentication token.",
        btnTitle: twoFactorToken.token,
      });
      return {
        success: true,
        showTwoFactorInput: true,
        message: "Two factor authentication code has been sent to your email",
      };
    }
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      showTwoFactorInput: false,
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
    console.log(error);
    throw error.message;
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

    await sendEmail({
      email: token.email,
      name: name,
      token: token.token,
      path: "/verify-email",
      subject: "Verify your email",
      body: "You need to verify your email, to login. Please click the below button to verify your email.",
      btnTitle: "Verify Email",
    });

    return {
      success: true,
      message: "Verification email has been sent to your email address",
    };
  } catch (error: any) {
    throw error.message;
  }
};

export const updatePassword = async (
  data: NewPasswordSchemaType,
  token?: string | null
) => {
  try {
    if (!token) throw new Error("Missing Reset Token");

    const validateFields = NewPasswordSchema.safeParse(data);
    if (!validateFields.success) throw new Error(validateFields.error.message);

    const { password: newPassword } = validateFields.data;

    const resetToken = await getResetTokenByToken(token);
    if (!resetToken) throw new Error("Token does not exists!!");

    const hasExpired = new Date() > new Date(resetToken.expiresAt);
    if (hasExpired) throw new Error("Token has expired!!");

    const user = await getUserByEmail(resetToken.email);
    if (!user) throw new Error("User does not exists!!");

    const hashedPassword = await hashPassword(newPassword);

    await updateUser(user.id, { password: hashedPassword });
    await deleteResetToken(resetToken.id);

    return {
      success: true,
      message: "Password has been updated successfully!!",
    };
  } catch (error: any) {
    throw error.message;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const verificationToken = await getVerificationTokenByToken(token);
    if (!verificationToken) throw new Error("Token does not exists!!");

    const hasExpired = new Date() > new Date(verificationToken.expiresAt);
    if (hasExpired) throw new Error("Token has expired!!");

    const user = await getUserByEmail(verificationToken.email);
    if (!user) throw new Error("Email does not exists!!");

    await setEmailVerification(user.id);
    await deleteVerificationToken(verificationToken.id);

    return {
      success: true,
      message: "Email has been verified successfully!!",
    };
  } catch (error: any) {
    throw error.message;
  }
};
