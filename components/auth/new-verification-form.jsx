"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams, useRouter } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [countdown, setCountdown] = useState(null);
  const submittedRef = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

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

  const onSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          setCountdown(3);
        }
        if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const getSuccessMessage = () => {
    if (countdown !== null) {
      if (countdown > 0) {
        return `Email verified! Redirecting to login in ${countdown}s...`;
      }
      return "Email verified! Redirecting to login...";
    }
    return success;
  };

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={getSuccessMessage()} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
