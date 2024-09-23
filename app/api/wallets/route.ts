import { NextRequest } from "next/server";
import UserModel from "@/model/user";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  await db();

  const userId = req.headers.get("userid");

  if (!userId) {
    return new Response(JSON.stringify({ message: "User ID not provided" }), {
      status: 400,
    });
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const wallets =
      user.wallets && user.wallets.length > 0
        ? user.wallets.map((wallet) => ({
            currency: wallet.currency,
            balance: wallet.balance || 0,
            address: wallet.address || "No address",
          }))
        : [];

    return new Response(JSON.stringify({ wallets }), { status: 200 });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching wallets", error: error }),
      { status: 500 }
    );
  }
}
