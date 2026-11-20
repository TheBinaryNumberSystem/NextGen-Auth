import { db } from "@/lib/db";

export const getAccountByUserId = async (userId) => {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });
    return account;
  } catch {
    return null;
  }
};

export const getAccountByProviderAndId = async (provider, providerAccountId) => {
  try {
    const account = await db.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
    return account;
  } catch {
    return null;
  }
};
