import { NextResponse } from "next/server";
import UserModel from "@/model/user";
import db from "@/lib/db";

export async function GET(req: Request) {
  await db();

  const userId = req.headers.get("userid");

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

    const wallets = user.wallets.map((wallet) => ({
      currency: wallet.currency,
      balance: wallet.balance || 0,
      address: wallet.address || "No address",
    }));

    return NextResponse.json({ wallets });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching wallets", error },
      { status: 500 }
    );
  }
}
