import { v4 as uuid } from "uuid";

import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "./models/token.model";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuid();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    //check if there is already a token associated with the email
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
    console.log(error.message);
    throw error.message;
  }
};
