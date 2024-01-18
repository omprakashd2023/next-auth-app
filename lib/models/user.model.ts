import prisma from "@/lib/prisma";

import { SignUpSchemaType } from "../validation/user";

export const createUser = async (data: SignUpSchemaType) => {
  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};
