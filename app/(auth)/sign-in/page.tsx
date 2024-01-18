"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";
import { FaGoogle } from "react-icons/fa";

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

import { SignInSchema, SignInSchemaType } from "@/lib/validation/user";
import { cn } from "@/lib/utils";
import { signin } from "@/lib/actions/user.action";

const SignUp = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInSchemaType) => {
    startTransition(async () => {
      try {
        const response = await signin(data);
        if (response.success) {
          toast({
            title: "Success",
            description: "You have successfully logged in!!",
            variant: "success",
          });
          router.push(response.redirect);
        } else throw new Error("Internal Server Error");
      } catch (error: any) {
        console.log(error);
        toast({
          title: "Error",
          description: `Failed to login user: ${error.message}`,
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
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          to continue to{" "}
          <span className="gradient-text-red-orange">AuthApp</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center gap-4 mb-2">
          <Button variant={"outline"} size={"icon"} className="w-1/2">
            <GitHubLogoIcon height={22} width={22} />
            <span className="ml-1">Github</span>
          </Button>
          <Button variant={"outline"} size={"icon"} className="w-1/2">
            <FaGoogle size={20} />
            <span className="ml-1">Google</span>
          </Button>
        </div>
        <div className="flex items-center mt-4 mb-2">
          <div className="flex-1 h-[0.5px] bg-black/50 dark:bg-violet-200/30"></div>
          <h4 className="mx-2 gradient-text-red-orange">or</h4>
          <div className="flex-1 h-[0.5px] bg-black/50 dark:bg-violet-200/30"></div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="pb-2">
                  <FormLabel>Password</FormLabel>
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
                <div className="flex items-center">
                  <ReloadIcon className="size-4 animate-spin" />
                  <span className="ml-1">Logging...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex text-sm">
        Don't have an account?
        <Link
          href="/sign-up"
          className="ml-1 gradient-text-red-orange hover:underline underline-offset-2 dark:decoration-neutral-50 decoration-neutral-950"
        >
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
