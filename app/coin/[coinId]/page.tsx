/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import HeaderBackButton from "@/components/header-back-button";

import Trading from "@/components/trading/trading";
import WrapperTrading from "@/components/trading/wrapper";

import useCoins from "@/hooks/use-coins";
import useTrading from "@/hooks/use-trading";

type CoinIdProps = {
  params: {
    coinId: string;
  };
};

const CoidId: React.FC<CoinIdProps> = ({ params: { coinId } }) => {
  const { data: session } = useSession();
  const formattedCoinId = coinId.toUpperCase();
  const { coinData } = useCoins();
  const [isLoading, setIsLoading] = useState(true);
  const data = useMemo(() => coinData[coinId as string], [coinData, coinId]);
  const trading = useTrading();

  const openTrading = () => {
    trading.onOpen();
  };

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      console.log("TradingView script loaded successfully");

      setTimeout(() => {
        const container = document.getElementById("tradingview-chart");
        if (container) {
          console.log("Container found, creating TradingView widget...");
          new (window as any).TradingView.widget({
            symbol: `BINANCE:${formattedCoinId}`,
            container_id: "tradingview-chart",
            width: "90%",
            height: "500px",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#ffffff",
            enable_publishing: false,
            allow_symbol_change: true,
            save_image: false,
          });
        } else {
          console.error("Container for TradingView widget not found");
        }
      }, 100);
    };

    script.onerror = () => {
      console.error("Failed to load TradingView script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [formattedCoinId]);

  if (isLoading) {
    return (
      <div className="bg-white h-full flex items-center justify-center text-2xl font-bold text-black">
        Loading...
      </div>
    );
  }

  return (
    <section className="h-full bg-white">
      <HeaderBackButton />
      <div className="flex flex-col items-center justify-center">
        <div
          className="
            flex
            items-center
            py-4
            gap-x-4
          "
        >
          <Image
            src={data.image}
            alt={data.name}
            width={30}
            height={30}
            style={{ width: "auto", height: "auto" }}
          />
          <h1 className="text-lg font-bold text-black">{data.name}</h1>
          <h1 className="text-lg font-bold text-black">${data.price}</h1>
        </div>
        <div
          id="tradingview-chart"
          style={{ width: "90%", height: "500px" }}
        ></div>
        <WrapperTrading />
        {session ? (
          <button
            className="
              bg-blue-600
              text-white
              block
              sm:w-[60%]
              w-full
              sm:mx-auto
              mx-4
              mt-6
              rounded-md
              hover:bg-blue-700
              duration-200
              py-2
              text-lg
            "
            onClick={openTrading}
          >
            Order
          </button>
        ) : (
          <h1 className="mt-6 w-fit mx-auto text-black text-xl font-semibold">
            Please Signin For Trade With Us ❤
          </h1>
        )}
        {trading.isOpen && <Trading currency={data.name} image={data.image} />}
      </div>
    </section>
  );
};

export default CoidId;
