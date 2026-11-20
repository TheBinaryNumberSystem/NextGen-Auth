import * as z from "zod";

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;

export const PASSWORD_MESSAGE =
  "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(["ADMIN", "USER"]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string()),
    newPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.password && data.newPassword === data.password) {
        return false;
      }
      return true;
    },
    {
      message: "New password cannot be the same as your old password!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return PASSWORD_REGEX.test(data.newPassword);
      }
      return true;
    },
    {
      message: PASSWORD_MESSAGE,
      path: ["newPassword"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, {
      message: "Minimum of 6 characters required",
    })
    .regex(PASSWORD_REGEX, {
      message: PASSWORD_MESSAGE,
    }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(6, {
      message: "Minimum of 6 characters required",
    })
    .regex(PASSWORD_REGEX, {
      message: PASSWORD_MESSAGE,
    }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
