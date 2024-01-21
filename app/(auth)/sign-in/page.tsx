"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  GitHubLogoIcon,
  ReloadIcon,
  ExclamationTriangleIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import { FaGoogle, FaX } from "react-icons/fa6";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

import { DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN } from "@/routes";

const SignUp = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isUrlError, setIsUrlError] = useState<boolean>(false);
  const [show2FA, setShow2FA] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error") === "OAuthAccountNotLinked";
    setIsUrlError(error);
  }, []);

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN,
    });
  };

  const onSubmit = (data: SignInSchemaType) => {
    startTransition(async () => {
      try {
        const response = await signin(data);
        if (response.success) {
          response.showTwoFactorInput &&
            setShow2FA(response.showTwoFactorInput);
          response.redirect && router.replace(response.redirect);
          toast({
            title: "Success",
            description:
              response.message || "You have successfully logged in!!",
            variant: "success",
          });
        } else throw new Error("Internal Server Error");
      } catch (error: any) {
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
        {isUrlError && (
          <div className="relative">
            <Button
              className="z-10 absolute top-2 right-2 cursor-pointer size-5 p-1 border-red-500/50"
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setIsUrlError(false);
                router.replace("/sign-in");
              }}
            >
              <FaX size={10} className="text-red-700/60" />
            </Button>
            <Alert className={cn("mb-4")} variant="destructive">
              <ExclamationTriangleIcon height={16} width={16} />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The email you are trying to login with is already registered
                with another provider!!
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!show2FA && (
          <>
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
          </>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {!show2FA ? (
              <>
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
                          disabled={isPending}
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
                          disabled={isPending}
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          <EyeClosedIcon />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="link"
                        type="button"
                        className={cn("px-0")}
                      >
                        <Link href="/reset-password">
                          Forgot your password?
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className={cn("pb-2")}>
                    <FormLabel>Two Factor Authentication Code</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              className={cn(
                "w-full bg-gradient-to-r from-red-500 to-orange-500 dark:text-white text-base"
              )}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center">
                  <ReloadIcon className="size-4 animate-spin" />
                  <span className="ml-1">
                    {show2FA ? "Logging in..." : "Verifying..."}
                  </span>
                </div>
              ) : show2FA ? (
                "Confirm"
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
