/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/lib/db";
import UserModel from "@/model/user";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await db();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerify) {
            throw new Error("Please verify your account first before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            throw new Error("The password invalid");
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token._id = user._id?.toString();
  //       token.isVerified = user.isVerified;
  //       token.isAcceptingMessages = user.isAcceptingMessages;
  //       token.username = user.username;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user._id = token._id;
  //       session.user.isVerified = token.isVerified;
  //       session.user.isAcceptingMessages = token.isAcceptingMessages;
  //       session.user.username = token.username;
  //     }
  //     return session;
  //   },
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerify = user.isVerify;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        token.wallets = user.wallets;
        token.transactionHistory = user.transactionHistory;
        token.binanceApiKey = user.binanceApiKey;
        token.binanceApiSecret = user.binanceApiSecret;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerify = token.isVerify;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.wallets = token.wallets;
        session.user.transactionHistory = token.transactionHistory;
        session.user.binanceApiKey = token.binanceApiKey;
        session.user.binanceApiSecret = token.binanceApiSecret;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
