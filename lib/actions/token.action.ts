"use server";

import { getUserByEmail } from "@/lib/models/user.model";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/lib/validation/user";

import { sendEmail } from "@/lib/email";
import { generateResetToken } from "@/lib/token";

export const sendResetPasswordEmail = async (data: ResetPasswordSchemaType) => {
  try {
    const validateFields = ResetPasswordSchema.safeParse(data);
    if (!validateFields.success) throw new Error(validateFields.error.message);

    const { email } = validateFields.data;
    const user = await getUserByEmail(email);
    if (!user) throw new Error("Email does not exists!!");

    const resetToken = await generateResetToken(email);

    await sendEmail({
      email: resetToken.email,
      name: user.name!,
      token: resetToken.token,
      path: "/new-password",
      subject: "Reset your password",
      body: "Please click the below button to reset your password.",
      btnTitle: "Reset Password",
    });

    return {
      success: true,
      message: "Reset password email has been sent successfully!!",
    };
  } catch (error: any) {
    throw error.message;
  }
};
