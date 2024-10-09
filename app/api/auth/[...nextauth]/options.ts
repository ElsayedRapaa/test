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

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            _id: user._id,
            username: user.username,
            email: user.email,
            verifyCode: user.verifyCode,
            isVerify: user.isVerify,
            isAcceptingMessage: user.isAcceptingMessage,
            wallets: user.wallets,
            transactionHistory: user.transactionHistory,
            role: user.role,
            address: user.address,
            pass: user.pass,
            isFirstLogin: user.isFirstLogin,
          };
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.verifyCode = user.verifyCode;
        token.isVerify = user.isVerify;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
        token.wallets = user.wallets;
        token.transactionHistory = user.transactionHistory;
        token.role = user.role;
        token.address = user.address;
        token.pass = user.pass;
        token.isFirstLogin = user.isFirstLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.verifyCode = token.verifyCode;
        session.user.isVerify = token.isVerify;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
        session.user.wallets = token.wallets;
        session.user.transactionHistory = token.transactionHistory;
        session.user.role = token.role;
        session.user.address = token.address;
        session.user.pass = token.pass;
        session.user.isFirstLogin = token.isFirstLogin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
