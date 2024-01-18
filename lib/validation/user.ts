import * as z from "zod";

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Invalid email address!!",
  }),
  password: z.string().min(1, { message: "Password is required!!" }),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(3, { message: "Name is required!!" }),
  email: z.string().email({
    message: "Invalid email address!!",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!!" }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
