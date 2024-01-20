"use client";

import { useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/lib/validation/user";
import { cn } from "@/lib/utils";
import { sendResetPasswordEmail } from "@/lib/actions/token.action";

const ResetPassword = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ResetPasswordSchemaType) => {
    startTransition(async () => {
      try {
        const response = await sendResetPasswordEmail(data);
        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
            variant: "success",
          });
        }
      } catch (error: any) {
        toast({
          title: "Failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        form.reset();
      }
    });
  };
  return (
    <Card className="w-[400px] shadow-lg dark:border-violet-300/30">
      <CardHeader>
        <CardTitle>Forgot your password</CardTitle>
        <CardDescription>
          to login to <span className="gradient-text-red-orange">AuthApp</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={cn("pb-2")}>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={cn(
                "w-full bg-gradient-to-r from-red-500 to-orange-500 dark:text-white text-base"
              )}
              disabled={isPending}
            >
              {isPending ? (
                <ReloadIcon className="size-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-center text-sm">
        Back to login:{" "}
        <Link
          href="/sign-up"
          className="ml-1 gradient-text-red-orange hover:underline underline-offset-2 dark:decoration-neutral-50 decoration-neutral-950"
        >
          Click
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResetPassword;
