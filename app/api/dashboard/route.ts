/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/user";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  await db();

  try {
    const users = await UserModel.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching users", error }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  await db();

  try {
    const body = await req.json();
    const { userId, walletUpdates, currency, amount, role } = body;

    if (!userId || (!walletUpdates && (!currency || amount == null) && !role)) {
      return new NextResponse(
        JSON.stringify({
          message: "User ID and wallet updates or currency and amount required",
        }),
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (walletUpdates) {
      for (const walletUpdate of walletUpdates) {
        const walletIndex = user.wallets.findIndex(
          (wallet) => wallet.currency === walletUpdate.currency.toUpperCase()
        );
        if (walletIndex !== -1) {
          user.wallets[walletIndex].address = walletUpdate.address;
        }
      }
    }

    if (currency && amount != null) {
      const walletIndex = user.wallets.findIndex(
        (wallet) => wallet.currency === currency.toUpperCase()
      );
      if (walletIndex !== -1) {
        user.wallets[walletIndex].balance += amount;
      } else {
        user.wallets.push({
          currency: currency.toUpperCase(),
          balance: amount,
          address: "",
        });
      }
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "User updated successfully", user }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error updating user", error }),
      { status: 500 }
    );
  }
}
