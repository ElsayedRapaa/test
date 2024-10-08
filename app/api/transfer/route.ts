/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/user";
import db from "@/lib/db";
import crypto from "crypto";

interface TransferRequestBody {
  userId: string;
  currency: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  await db();

  const { userId, currency, amount }: TransferRequestBody = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User ID not provided" },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const wallet = user.wallets.find((wallet) => wallet.currency === currency);

    if (!wallet) {
      return NextResponse.json(
        { message: `${currency} wallet not found` },
        { status: 404 }
      );
    }

    if (wallet.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    wallet.balance -= amount;

    user.transactionHistory.push({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Transfer",
      amount,
      date: new Date(),
    });

    await user.save();

    return NextResponse.json(
      { message: "Transfer initiated" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Transfer error:", err);
    return NextResponse.json(
      { message: "Transfer failed", error: err || "Internal Server Error" },
      { status: 500 }
    );
  }
}
