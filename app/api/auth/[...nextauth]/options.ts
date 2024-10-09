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

          // if (!user.isVerify) {
          //   throw new Error("Please verify your account first before login");
          // }

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
            isAcceptingMessages: user.isAcceptingMessage,
            wallets: user.wallets,
            transactionHistory: user.transactionHistory,
            role: user.role,
            address: user.address,
            pass: user.pass,
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
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        token.wallets = user.wallets;
        token.transactionHistory = user.transactionHistory;
        token.role = user.role;
        token.address = user.address;
        token.pass = user.pass;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.verifyCode = token.verifyCode;
        session.user.isVerify = token.isVerify;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.wallets = token.wallets;
        session.user.transactionHistory = token.transactionHistory;
        session.user.role = token.role;
        session.user.address = token.address;
        session.user.pass = token.pass;
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
