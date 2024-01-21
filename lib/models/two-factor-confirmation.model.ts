import prisma from "@/lib/prisma";

export const createTwoFactorConfirmation = async (userId: string) => {
  try {
    const createTwoFactorConfirmation =
      await prisma.twoFactorConfirmation.create({
        data: {
          userId,
        },
      });

    return createTwoFactorConfirmation;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const getTwoFactorConfirmation = async (userId: string) => {
  try {
    const getTwoFactorConfirmation =
      await prisma.twoFactorConfirmation.findUnique({
        where: {
          userId,
        },
      });

    return getTwoFactorConfirmation;
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};

export const deleteTwoFactorConfirmation = async (id: string) => {
  try {
    await prisma.twoFactorConfirmation.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};
