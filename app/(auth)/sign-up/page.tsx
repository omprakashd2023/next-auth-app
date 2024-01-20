"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import {
  GitHubLogoIcon,
  ReloadIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
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

import { signup } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { SignUpSchema, SignUpSchemaType } from "@/lib/validation/user";

import { DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN } from "@/routes";

const SignUp = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN,
    });
  };

  const onSubmit = (data: SignUpSchemaType) => {
    startTransition(async () => {
      try {
        const response = await signup(data);
        if (response.success)
          toast({
            title: "Success",
            description: response.message,
            variant: "success",
          });
        else throw new Error("Internal Server Error");
      } catch (error: any) {
        toast({
          title: "Error",
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          to continue to{" "}
          <span className="gradient-text-red-orange">AuthApp</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center gap-4 mb-2">
          <Button
            onClick={() => onClick("github")}
            variant={"outline"}
            size={"icon"}
            className="w-1/2"
          >
            <GitHubLogoIcon height={22} width={22} />
            <span className="ml-1">Github</span>
          </Button>
          <Button
            onClick={() => onClick("google")}
            variant={"outline"}
            size={"icon"}
            className="w-1/2"
          >
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                <FormItem className={cn("pb-2 relative")}>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  {showPassword ? (
                    <Button
                      className="absolute top-6 right-0"
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <EyeOpenIcon />
                    </Button>
                  ) : (
                    <Button
                      className="absolute top-6 right-0"
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <EyeClosedIcon />
                    </Button>
                  )}
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
                  <span className="ml-1">Registering...</span>
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex text-sm">
        <span>
          Already have an account?
          <Link
            href="/sign-in"
            className="ml-1 gradient-text-red-orange hover:underline underline-offset-2 dark:decoration-neutral-50 decoration-neutral-950"
          >
            Login
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
