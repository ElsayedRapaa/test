import { NextRequest } from "next/server";
import UserModel from "@/model/user";
import db from "@/lib/db";
import crypto from "crypto";

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

    const requiredCurrencies = ["BTC", "ETH", "BNB", "USDT"];
    const userWallets = user.wallets.map((wallet) => wallet.currency);

    const missingCurrencies = requiredCurrencies.filter(
      (currency) => !userWallets.includes(currency)
    );

    if (user.isFirstLogin) {
      const usdtWallet = user.wallets.find(
        (wallet) => wallet.currency === "USDT"
      );

      const prizeAmount = 100;

      if (!usdtWallet) {
        user.wallets.push({
          currency: "USDT",
          balance: prizeAmount,
          address: crypto.randomBytes(20).toString("hex"),
        });
      } else {
        usdtWallet.balance += prizeAmount;
      }
      user.hasReceivedPrize = true;
      await user.save();
    }

    if (missingCurrencies.length > 0) {
      const newWallets = missingCurrencies.map((currency) => ({
        currency,
        balance: 0,
        address: crypto.randomBytes(20).toString("hex"),
      }));

      user.wallets = [...user.wallets, ...newWallets];
      await user.save();
    }

    const wallets = user.wallets.map((wallet) => ({
      currency: wallet.currency,
      balance: wallet.balance || 0,
      address: wallet.address || "No address",
    }));

    return new Response(JSON.stringify({ wallets }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching wallets", error: error }),
      { status: 500 }
    );
  }
}
