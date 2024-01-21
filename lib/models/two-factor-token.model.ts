import prisma from "@/lib/prisma";

type TokenProps = {
  email: string;
  token: string;
  expiresAt: Date;
};

export const createTwoFactorToken = async ({
  email,
  token,
  expiresAt,
}: TokenProps) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    return twoFactorToken;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return twoFactorToken;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const deleteTwoFactorToken = async (id: string) => {
  try {
    await prisma.twoFactorToken.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};
