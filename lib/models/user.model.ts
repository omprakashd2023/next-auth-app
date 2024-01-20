import prisma from "@/lib/prisma";

import { SignUpSchemaType } from "../validation/user";

export const createUser = async (data: SignUpSchemaType) => {
  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
};

export const setEmailVerification = async (id: string) => {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        emailVerified: new Date(),
      },
    });
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
};
