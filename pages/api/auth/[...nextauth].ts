import NextAuth, { NextAuthOptions, User, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Custom sign-in logic
      console.log({ user, profile, account, email, credentials });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, fullName: user.name }),
        }
      );
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.jwtToken = await exchangeAccessTokenForJwt(token.accessToken!);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

async function exchangeAccessTokenForJwt(accessToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/auth/exchange`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    }
  );
  const data = await response.json();
  return data.jwtToken;
}

export default NextAuth(authOptions);
