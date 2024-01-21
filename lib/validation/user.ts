import * as z from "zod";

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address!!",
  }),
});

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const NewPasswordSchema = z
  .object({
    password: z.string().min(1, { message: "Password is required!!" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required!!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Invalid email address!!",
  }),
  password: z.string().min(1, { message: "Password is required!!" }),
  code: z.string().optional(),
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
