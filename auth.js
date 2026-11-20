import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById, getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId, getAccountByProviderAndId } from "@/data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        let flow = "login";
        try {
          const cookieStore = await cookies();
          flow = cookieStore.get("auth_flow")?.value || "login";
        } catch {
          flow = "login";
        }

        const existingAccount = await getAccountByProviderAndId(
          account.provider,
          account.providerAccountId
        );

        const existingUser = user.email ? await getUserByEmail(user.email) : null;

        // If user is attempting OAuth from the LOGIN page
        if (flow === "login") {
          // If no account exists for this provider AND no user exists at all:
          // User has not registered yet, block login and redirect with error
          if (!existingAccount && !existingUser) {
            return "/auth/login?error=OAuthNotRegistered";
          }

          // If a user exists but was registered with a different provider or password
          if (existingUser && !existingAccount) {
            return "/auth/login?error=OAuthAccountNotLinked";
          }
        }

        // If user is attempting OAuth from the REGISTER page
        if (flow === "register") {
          // If user exists with password or a different provider, prevent collision
          if (existingUser && !existingAccount) {
            return "/auth/register?error=OAuthAccountNotLinked";
          }
        }

        return true;
      }

      if (!user.id) return false;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
