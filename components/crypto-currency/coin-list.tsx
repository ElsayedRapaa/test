"use client";

import Image from "next/image";
import Link from "next/link";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const coins = [
  "btcusdt",
  "ethusdt",
  "bnbusdt",
  "xrpusdt",
  "adausdt",
  "solusdt",
  "dotusdt",
  "dogeusdt",
  "maticusdt",
  "shibusdt",
  "ltcusdt",
  "avaxusdt",
  "uniusdt",
  "linkusdt",
  "xlmusdt",
  "vetusdt",
  "atomusdt",
  "trxusdt",
  "sandusdt",
  "thetausdt",
];

const coinImages: { [key: string]: string } = {
  btcusdt: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  ethusdt: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  bnbusdt:
    "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  xrpusdt:
    "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  adausdt: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  solusdt: "https://assets.coingecko.com/coins/images/4128/large/Solana.jpg",
  dotusdt: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
  dogeusdt: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
  maticusdt:
    "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
  shibusdt: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
  ltcusdt: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
  avaxusdt:
    "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png",
  uniusdt:
    "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
  linkusdt:
    "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
  xlmusdt:
    "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
  vetusdt: "https://assets.coingecko.com/coins/images/2226/large/VeChain.png",
  atomusdt:
    "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
  trxusdt: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
  sandusdt:
    "https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.png",
  thetausdt:
    "https://assets.coingecko.com/coins/images/2538/large/theta-token-logo.png",
};

const CoinList = () => {
  const [coinData, setCoinData] = useState<{ [key: string]: any }>({});

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
          };
        }
      });

      setCoinData(newCoinData);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      ws.close();
    };
  }, [coinData]);

  return (
    <div
      className="
        px-4
        py-6
      "
    >
      <h1 className="text-2xl font-bold text-black">Crypto Prices</h1>
      {coins.map((coin) => {
        const data = coinData[coin];
        return (
          data && (
            <div
              className="
              flex
              flex-col
            "
            >
              <Link
                href={`/coin/${coin}`}
                className="
                px-4
                py-2
                grid
                grid-cols-3
                hover:bg-gray-100
                duration-200
              "
              >
                <div className="flex items-center gap-x-4">
                  <Image
                    src={coinImages[coin]}
                    alt={coin}
                    width={25}
                    height={25}
                  />
                  <h2 className="text-black font-bold text-lg">
                    {coin.replace("usdt", "").toUpperCase()}
                  </h2>
                </div>
                <h3 className="text-black font-semibold mx-auto">
                  {data.price > 1000
                    ? data.price.toFixed(2)
                    : data.price.toFixed(8)}
                </h3>
                <span
                  className={`
                    rounded-md
                    text-white
                    ml-auto
                    w-24
                    flex
                    items-center
                    justify-center
                    ${data.priceChangePercentage24h > 0 && "bg-green-700"}
                    ${data.priceChangePercentage24h < 0 && "bg-red-700"}
                    ${data.priceChangePercentage24h == 0 && "bg-gray-300"}
                  `}
                >
                  {data.priceChangePercentage24h}%
                </span>
              </Link>
            </div>
          )
        );
      })}
    </div>
  );
};

export default CoinList;
