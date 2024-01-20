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
    throw new Error("Internal Server Error");
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
    throw new Error("Internal Server Error");
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
    throw new Error("Internal Server Error");
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
    throw new Error("Internal Server Error");
  }
};
