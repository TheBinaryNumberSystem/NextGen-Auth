"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isPending, startTransition] = useTransition();

  const clearError = () => {
    if (error) setError("");
  };

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push("/auth/login");
    }
  }, [countdown, router]);

  const onSubmit = (values) => {
    setError("");
    setSuccess("");
    setCountdown(null);

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data?.error) {
            form.setValue("password", "");
            setError(data.error);
          }
          if (data?.success) {
            setSuccess(data.success);
            setCountdown(3);
          }
        })
        .catch(() => {
          form.setValue("password", "");
          setError("Something went wrong!");
        });
    });
  };

  const getSuccessMessage = () => {
    if (countdown !== null) {
      if (countdown > 0) {
        return `Password updated! Redirecting to login in ${countdown}s...`;
      }
      return "Password updated! Redirecting to login...";
    }
    return success;
  };

  const isCompleted = countdown !== null;

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isPending || isCompleted}
                        placeholder="******"
                        type={showPassword && field.value ? "text" : "password"}
                        className="pr-10"
                        onFocus={clearError}
                        onClick={clearError}
                        onChange={(e) => {
                          clearError();
                          field.onChange(e);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={!field.value || isPending || isCompleted}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-400"
                        tabIndex={-1}
                      >
                        {showPassword && field.value ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={getSuccessMessage()} />
          <Button
            disabled={isPending || isCompleted}
            type="submit"
            className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isCompleted ? "Password updated! Redirecting..." : "Reset password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
