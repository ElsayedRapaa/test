/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HeaderBackButton from "@/components/header-back-button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import photo01 from "./images/file01.png";
import WalletPopup from "@/components/popup";
import React from "react";

interface Wallet {
  currency: string;
  balance: number;
  address: string;
}

const coinImage: { [key: string]: string } = {
  btc: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  eth: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  bnb: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  usdt: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  gbp: "https://huobicfg.s3.amazonaws.com/currency_icon/gbp.png",
};

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [coinData, setCoinData] = useState<{ [key: string]: any }>({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const coins = ["btcusdt", "ethusdt", "bnbusdt", "usdtusdt", "gbpusdt"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
    } else {
      const fetchWallets = async () => {
        try {
          const response = await fetch(`/api/wallets`, {
            headers: {
              userid: session?.user?._id || "",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch wallet data");
          const data = await response.json();
          setWallets(data.wallets || []);
        } catch (error) {
          console.error("Error fetching wallets:", error);
        }
      };
      fetchWallets();
    }
  }, [session, status, router]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const updates = JSON.parse(event.data);
      const newCoinData = { ...coinData };

      updates.forEach((update: any) => {
        const symbol = update.s.toLowerCase();
        if (coins.includes(symbol)) {
          newCoinData[symbol] = {
            price: parseFloat(update.c),
            priceChangePercentage24h: parseFloat(update.P),
            volume: parseFloat(update.q),
            high24h: parseFloat(update.h),
            low24h: parseFloat(update.l),
            name: symbol.replace("usdt", "").toUpperCase(),
            image: coinImage[symbol] || "",
          };
        }
      });

      setCoinData(newCoinData);
    };

    return () => {
      ws.close();
    };
  }, [coinData, coins]);

  if (status === "loading" || !session)
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <h1 className="text-3xl font-bold w-fit text-black">Loading...</h1>
      </div>
    );

  const openPopup = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedWallet(null);
  };

  return (
    <div className="bg-gray-100 text-black min-h-full">
      <HeaderBackButton />
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h5 className="text-xl font-light">
              Sending encrypted currency immediately
            </h5>
            <p className="text-xs">
              Select a wallet to send encrypted currency
            </p>
          </div>
          <Image src={photo01} alt="File" width={400} height={400} />
        </div>
        <div className="flex items-center justify-between flex-wrap border-y py-2">
          <h1 className="text-xl font-bold">User Profile</h1>
          <h2 className="text-xl font-bold">{session?.user?.username}</h2>
        </div>
        <p className="py-2 text-xl font-bold">Email: {session?.user?.email}</p>

        <h3 className="text-xl font-bold py-2">Wallets</h3>
        <ul className="pt-4 pb-12">
          {wallets.length > 0 ? (
            wallets.map((wallet, index) => (
              <li
                key={index}
                className="border-y py-4 flex items-center justify-between cursor-pointer"
                onClick={() => openPopup(wallet)}
              >
                <div className="flex items-center sm:gap-x-12 gap-x-4">
                  <Image
                    src={coinImage[wallet.currency.toLowerCase()]}
                    alt={wallet.currency}
                    width={40}
                    height={40}
                  />
                  <p>
                    {wallet.currency} <br />
                    <span className="text-xs mt-2">USDT</span>
                  </p>
                </div>
                <p className="text-right">
                  US$ {wallet.balance} <br />
                  {coinData[wallet.currency.toLowerCase() + "usdt"] && (
                    <>
                      <p className="text-sm pt-2">
                        Price Coin: ${" "}
                        {coinData[
                          wallet.currency.toLowerCase() + "usdt"
                        ].price.toFixed(2)}
                      </p>
                      <p className="text-sm pt-2">
                        Total Price: ${" "}
                        {wallet.balance *
                          coinData[
                            wallet.currency.toLowerCase() + "usdt"
                          ].price.toFixed(0)}
                      </p>
                    </>
                  )}
                </p>
              </li>
            ))
          ) : (
            <p>No wallets available</p>
          )}
        </ul>
      </div>

      {selectedWallet && (
        <WalletPopup
          walletCurrency={selectedWallet.currency}
          walletAddress={selectedWallet.address}
          isOpen={isPopupOpen}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default ProfilePage;
