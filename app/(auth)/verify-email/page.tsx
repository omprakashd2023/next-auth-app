"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ReloadIcon, CheckIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { verifyEmail } from "@/lib/actions/user.action";

import { DEFAULT_REDIRECT_PATH_AFTER_EMAIL_VERIFICATION } from "@/routes";

const VerifyEmail = () => {
  const { toast } = useToast();
  const [success, setSuccess] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyUserEmail = useCallback(async () => {
    try {
      const { success, message } = await verifyEmail(token!);

      if (success) {
        setSuccess(success);
        toast({
          title: "Success",
          description: message,
          variant: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    } else {
      toast({
        title: "No token found",
        description: "Please check your email for the reset link",
        variant: "destructive",
      });
    }
  }, [verifyUserEmail]);

  return (
    <Card className="w-[400px] shadow-lg dark:border-violet-300/30">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          to continue to{" "}
          <span className="gradient-text-red-orange">AuthApp</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <span className="text-base text-center mb-2">
            {success
              ? "Your email has been verified successfully!!"
              : "Verifying your email address..."}
          </span>
          {!success && <ReloadIcon className="size-5 animate-spin" />}
          {success && (
            <div className="flex items-center">
              <span className="mr-1">Verified</span>
              <CheckIcon className="size-6 text-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center text-sm">
        <span>
          Back to login:{" "}
          <Link
            href={DEFAULT_REDIRECT_PATH_AFTER_EMAIL_VERIFICATION}
            className="ml-1 gradient-text-red-orange hover:underline underline-offset-2 dark:decoration-neutral-50 decoration-neutral-950"
          >
            Click
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmail;
