import prisma from "@/lib/prisma";

type TokenProps = {
  email: string;
  token: string;
  expiresAt: Date;
};

export const createVerificationToken = async ({
  email,
  token,
  expiresAt,
}: TokenProps) => {
  try {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    return verificationToken;
  } catch (error: any) {
    throw new Error(`Error creating verification token: ${error.message}`);
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error: any) {
    throw new Error(`Error getting verification token: ${error.message}`);
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error: any) {
    throw new Error(`Error getting verification token: ${error.message}`);
  }
};

export const deleteVerificationToken = async (id: string) => {
  try {
    await prisma.verificationToken.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error(`Error deleting verification token: ${error.message}`);
  }
};
