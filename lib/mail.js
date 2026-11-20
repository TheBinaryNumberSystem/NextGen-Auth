import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL || "myselfabhi27@gmail.com",
    pass: process.env.NODEMAILER_PW,
  },
});

export const sendTwoFactorTokenEmail = async (email, token) => {
  if (!process.env.NODEMAILER_PW) {
    console.log(`\n📧 [DEV 2FA CODE] To: ${email} | Code: ${token}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"NextGen Auth" <${process.env.NODEMAILER_EMAIL || "myselfabhi27@gmail.com"}>`,
    to: email,
    subject: "2FA Code",
    html: `<p>Your Two-Factor Authentication code is <b>${token}</b></p>`,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  if (!process.env.NODEMAILER_PW) {
    console.log(`\n🔗 [DEV PASSWORD RESET] Reset link: ${resetLink}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"NextGen Auth" <${process.env.NODEMAILER_EMAIL || "myselfabhi27@gmail.com"}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  if (!process.env.NODEMAILER_PW) {
    console.log(`\n🔗 [DEV EMAIL VERIFICATION] Confirmation link: ${confirmLink}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"NextGen Auth" <${process.env.NODEMAILER_EMAIL || "myselfabhi27@gmail.com"}>`,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};
