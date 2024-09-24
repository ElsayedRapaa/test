// import { NextRequest } from "next/server";
// import UserModel from "@/model/user";
// import db from "@/lib/db";
// import crypto from "crypto";

// export async function GET(req: NextRequest) {
//   await db();

//   const userId = req.headers.get("userid");

//   if (!userId) {
//     return new Response(JSON.stringify({ message: "User ID not provided" }), {
//       status: 400,
//     });
//   }

//   try {
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return new Response(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//       });
//     }

//     const requiredCurrencies = ["BTC", "ETH", "BNB", "USDT", "GBP"];
//     const userWallets = user.wallets.map((wallet) => wallet.currency);

//     const missingCurrencies = requiredCurrencies.filter(
//       (currency) => !userWallets.includes(currency)
//     );

//     if (missingCurrencies.length > 0) {
//       const newWallets = missingCurrencies.map((currency) => ({
//         currency,
//         balance: 0,
//         address: crypto.randomBytes(20).toString("hex"),
//       }));

//       user.wallets = [...user.wallets, ...newWallets];
//       await user.save();
//     }

//     const wallets = user.wallets.map((wallet) => ({
//       currency: wallet.currency,
//       balance: wallet.balance || 0,
//       address: wallet.address || "No address",
//     }));

//     return new Response(JSON.stringify({ wallets }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching wallets:", error);
//     return new Response(
//       JSON.stringify({ message: "Error fetching wallets", error: error }),
//       { status: 500 }
//     );
//   }
// }

import { NextRequest } from "next/server";
import UserModel from "@/model/user";
import db from "@/lib/db";

const fixedAddresses: Record<string, string> = {
  BTC: "bc1qjp722ft9tr4jzewh3v9c64j3m97rcku7culdn0",
  ETH: "0xe5999D6E15FCaE2648e8ED38abf5fFE0a38b140a",
  BNB: "0xe5999D6E15FCaE2648e8ED38abf5fFE0a38b140a",
  USDT: "0xe5999D6E15FCaE2648e8ED38abf5fFE0a38b140a",
  GBP: "0x0676C9E3F01c62B8031e727e40bDc1381484A869",
};

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

    const requiredCurrencies = ["BTC", "ETH", "BNB", "USDT", "GBP"];

    const updatedWallets = requiredCurrencies.map((currency) => {
      const existingWallet = user.wallets.find(
        (wallet) => wallet.currency === currency
      );
      return {
        currency,
        balance: existingWallet?.balance || 0,
        address: fixedAddresses[currency],
      };
    });

    user.wallets = updatedWallets;
    await user.save();

    return new Response(JSON.stringify({ wallets: updatedWallets }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching or updating wallets:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching or updating wallets", error }),
      { status: 500 }
    );
  }
}
