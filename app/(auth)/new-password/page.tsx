"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  NewPasswordSchema,
  NewPasswordSchemaType,
} from "@/lib/validation/user";
import { cn } from "@/lib/utils";
import { updatePassword } from "@/lib/actions/user.action";

const NewPassword = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: NewPasswordSchemaType) => {
    startTransition(async () => {
      try {
        const response = await updatePassword(data, token);
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
        <CardTitle>
          Reset your <span className="gradient-text-red-orange">Password</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className={cn("pb-2")}>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="password" {...field} />
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
                "Reset Password"
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

export default NewPassword;
