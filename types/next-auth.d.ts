import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerify?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    verifyCode?: string;
    wallets?: {
      currency: string;
      balance: number;
      address: string;
    }[];
    transactionHistory?: {
      id: string;
      type: string;
      amount: number;
      date: Date;
    }[];
    role: "admin" | "user";
    address: string;
    pass: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerify?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      email?: string;
      verifyCode?: string;
      wallets?: {
        currency: string;
        balance: number;
        address: string;
      }[];
      transactionHistory?: {
        id: string;
        type: string;
        amount: number;
        date: Date;
      }[];
      role: "admin" | "user";
      address: string;
      pass: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerify?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    verifyCode?: string;
    wallets?: {
      currency: string;
      balance: number;
      address: string;
    }[];
    transactionHistory?: {
      id: string;
      type: string;
      amount: number;
      date: Date;
    }[];
    role: "admin" | "user";
    address: string;
    pass: string;
  }
}
