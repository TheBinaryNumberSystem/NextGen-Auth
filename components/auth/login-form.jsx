"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : searchParams.get("error") === "OAuthNotRegistered"
      ? "No account found with this email. Please sign up first!"
      : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState(urlError || "");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLoading = isPending || isRedirecting;

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const clearError = () => {
    if (error) setError("");
  };

  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            if (showTwoFactor) {
              form.setValue("code", "");
            } else {
              form.setValue("password", "");
            }
            setError(data.error);
          }

          if (data?.success) {
            setIsRedirecting(true);
            if (data?.redirectTo) {
              window.location.assign(data.redirectTo);
            }
          }

          if (data?.twoFactor) {
            setError("");
            setSuccess("Two-factor code sent to your email!");
            setShowTwoFactor(true);
          }
        })
        .catch((err) => {
          if (
            err?.message === "NEXT_REDIRECT" ||
            err?.message?.includes("NEXT_REDIRECT") ||
            err?.digest?.includes("NEXT_REDIRECT")
          ) {
            return;
          }
          if (!showTwoFactor) {
            form.setValue("password", "");
          }
          setError("Something went wrong");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel={showTwoFactor ? "Two-Factor Authentication" : "Welcome back"}
      backButtonLabel={showTwoFactor ? "Back to login" : "Don't have an account?"}
      backButtonHref={showTwoFactor ? "/auth/login" : "/auth/register"}
      showSocial={!showTwoFactor}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="123456"
                        onFocus={clearError}
                        onClick={clearError}
                        onChange={(e) => {
                          clearError();
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder="abhishek.goswami@example.in"
                          type="email"
                          onFocus={clearError}
                          onClick={clearError}
                          onChange={(e) => {
                            clearError();
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            disabled={isLoading}
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
                            disabled={!field.value || isLoading}
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
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal cursor-pointer"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="italic flex items-center justify-center gap-x-2">
                Logging in...
              </span>
            ) : showTwoFactor ? (
              "Confirm"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
