import { v4 as uuid } from "uuid";

import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "@/lib/models/verification-token.model";
import {
  createResetToken,
  deleteResetToken,
  getResetTokenByEmail,
} from "@/lib/models/reset-token.model";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuid();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    //check if there is already a verification token associated with the email
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      await deleteVerificationToken(existingToken.id);
    }

    const verificationToken = await createVerificationToken({
      email,
      token,
      expiresAt,
    });

    return verificationToken;
  } catch (error: any) {
    throw error.message;
  }
};

export const generateResetToken = async (email: string) => {
  try {
    const token = uuid();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    //check if there is already a password reset token associated with the email
    const existingToken = await getResetTokenByEmail(email);
    if (existingToken) {
      await deleteResetToken(existingToken.id);
    }

    const resetToken = await createResetToken({
      email,
      token,
      expiresAt,
    });

    return resetToken;
  } catch (error: any) {
    throw error.message;
  }
};
