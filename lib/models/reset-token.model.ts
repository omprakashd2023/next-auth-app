import prisma from "@/lib/prisma";

type TokenProps = {
  email: string;
  token: string;
  expiresAt: Date;
};

export const createResetToken = async ({
  email,
  token,
  expiresAt,
}: TokenProps) => {
  try {
    const resetToken = await prisma.resetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    return resetToken;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const getResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await prisma.resetToken.findUnique({
      where: {
        token,
      },
    });

    return resetToken;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const getResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        email,
      },
    });

    return resetToken;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const deleteResetToken = async (id: string) => {
  try {
    await prisma.resetToken.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};
