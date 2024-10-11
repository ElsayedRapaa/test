"use client";

import { HiClock } from "react-icons/hi2";
import { FaArrowUpShortWide } from "react-icons/fa6";
import { FaArrowDownWideShort } from "react-icons/fa6";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/use-toast";
import Link from "next/link";

const usdt =
  "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png";

interface TradingOptionsProps {
  tradeState: string;
  setTradeState: React.Dispatch<SetStateAction<string>>;
}

interface Wallet {
  currency: string;
  balance: number;
  address: string;
}

const TradingOptions: React.FC<TradingOptionsProps> = ({
  tradeState,
  setTradeState,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("60");
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState(selectedValue);
  const [tradeOpen, setTradeOpen] = useState<boolean>(false);
  const [showDiv, setShowDiv] = useState<boolean>(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const toastHook = useToast();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
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
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = parseFloat(e.target.value);
    setAmount(numberValue);
  };

  const handleFocus = () => {
    if (amount === 0) {
      setAmount(NaN);
    }
  };

  const handleTime = (value: string) => {
    setDuration(value);
    setSelectedValue(value);
  };

  const handleClick = () => {
    if (
      wallets.find((item) => item.currency === "USDT" && item.balance === 0)
    ) {
      toast.info(
        <div className="bg-white p-4">
          <h1 className="text-red-700 font-semibold text-lg mb-4">Sorry!!!</h1>
          <div className="flex flex-col gap-y-2 mb-4">
            <p className="text-black text-lg">
              Deposit USDT first and then trade.
            </p>
            <p className="text-black text-lg">
              Go to the account to get a deposit address.
            </p>
            <Link href="/account" className="text-blue-600 underline">
              Account
            </Link>
          </div>
        </div>,
        {
          autoClose: 5000,
          progressClassName: "custom-progress-bar",
          className: "custom-toast",
          pauseOnFocusLoss: false,
        }
      );
    } else if (amount > 0) {
      toast.info(
        <div className="bg-white p-4">
          <h1 className="text-green-700 font-semibold text-lg mb-4">
            Success!!!
          </h1>
          <div className="flex flex-col gap-y-2 mb-4">
            <p className="text-green-700">Order placed successfully.</p>
            <p>Please wait for {selectedValue}S</p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Direction</h3>
            <h3
              className={`${
                tradeState === "Up" ? "text-green-700" : "text-red-700"
              }`}
            >
              {tradeState}
            </h3>
          </div>
          <div className="flex items-center justify-between mb-3 text-lg font-semibold text-gray-700">
            <h3>Hosting Amount</h3>
            <h3>{amount}</h3>
          </div>
          <div className="flex items-center justify-between mb-3 text-lg font-semibold text-gray-700">
            <h3>Buy Price</h3>
            <h3>currancy Price</h3>
          </div>
          <div className="w-8 h-8 rounded-full border-y border-4 border-blue-600 mx-auto mt-5 animate-spin"></div>
        </div>,
        {
          autoClose: Number(duration) * 1000,
          onClose: () => setShowDiv(true),
          progressClassName: "custom-progress-bar",
          className: "custom-toast",
          pauseOnFocusLoss: false,
        }
      );
      setTradeOpen(true);
      toastHook.onOpen();
    }
  };

  const handleRemoveDiv = () => {
    setShowDiv(false);
    setAmount(0);
    setTradeOpen(false);
    toastHook.onClose();
  };

  return (
    <div
      className={`
        flex
        flex-col
        gap-y-4
        px-4
        ${tradeOpen && "pointer-events-none"}
        ${showDiv && "pointer-events-none"}
      `}
    >
      <ToastContainer
        hideProgressBar={false}
        closeButton={false}
        className="custom-toast-container"
        icon={false}
      />
      <p className="-mb-4 text-black">Delivery time</p>
      <div
        className="
          grid
          md:grid-cols-3
          sm:grid-cols-2
          grid-cols-1
          gap-x-4
          gap-y-4
        "
      >
        <div
          className="
            border
            rounded-md
            p-1
            flex
            items-center
            gap-x-2
            text-black
          "
        >
          <HiClock size={24} className="text-blue-600" />
          <Select
            value={selectedValue}
            onValueChange={(value) => handleTime(value)}
          >
            <SelectTrigger className="flex-1 text-lg">
              <SelectValue placeholder={selectedValue} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">60S</SelectItem>
              <SelectItem value="120">120S</SelectItem>
              <SelectItem value="300">300S</SelectItem>
              <SelectItem value="10000">10M</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          className={`
            px-4
            py-2
            sm:skew-x-12
            sm:rounded-none
            rounded-md
            text-white
            ${tradeState === "Up" ? "bg-green-700" : "bg-gray-500"}
            hover:bg-green-600
            duration-200
          `}
          onClick={() => setTradeState("Up")}
        >
          Up
        </button>
        <button
          className={`
            px-4
            py-2
            sm:-skew-x-12
            sm:rounded-none
            rounded-md
            text-white
            ${tradeState === "Fall" ? "bg-red-600" : "bg-gray-500"}
            hover:bg-red-600/90
            duration-200
          `}
          onClick={() => setTradeState("Fall")}
        >
          Fall
        </button>
      </div>
      <p className="-mb-4 text-black">Price range</p>
      <div>
        {tradeState === "Up" ? (
          <div
            className={`flex items-center gap-x-2 text-green-700 border p-2`}
          >
            <FaArrowUpShortWide size={24} />
            <p className="text-lg">UP</p>
          </div>
        ) : (
          <div className={`flex items-center gap-x-2 text-red-700 border p-2`}>
            <FaArrowDownWideShort size={24} />
            <p className="text-lg">FALL</p>
          </div>
        )}
      </div>
      <p className="-mb-4 text-black">Purchase amount</p>
      <div
        className="
          border
          pb-[1px]
          flex
          items-center
          bg-gray-100
        "
      >
        <div className="p-2 border">
          <Image src={usdt} alt="USDT" width={30} height={30} />
        </div>
        <input
          type="number"
          className="border flex-1 bg-transparent py-2 px-4 text-black"
          value={amount}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <p className="p-2 text-black border sm:block hidden">Minmum: 100</p>
      </div>
      <button
        className={`
          ${tradeState === "Up" ? "bg-green-700" : "bg-red-600"}
          hover:bg-opacity-90
          text-white
          block
          w-full
          mx-auto
          mt-2
          rounded-md
          duration-200
          py-2
          text-lg
        `}
        onClick={handleClick}
      >
        Order
      </button>
      {showDiv && (
        <div className="bg-white text-black p-4 rounded-md shadow-md text-center fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[320px] pointer-events-auto">
          <h2 className="text-red-700 font-semibold text-xl my-4">
            You lost your trade
          </h2>
          <span className="text-red-700 text-lg my-4">-{amount}</span>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Direction</h3>
            <h3
              className={`${
                tradeState === "Up" ? "text-green-700" : "text-red-700"
              }`}
            >
              {tradeState}
            </h3>
          </div>
          <div className="flex items-center justify-between mb-3 text-lg font-semibold text-gray-700">
            <h3>Hosting Amount</h3>
            <h3>{amount}</h3>
          </div>
          <div className="flex items-center justify-between mb-3 text-lg font-semibold text-gray-700">
            <h3>Buy Price</h3>
            <h3>currancy Price</h3>
          </div>
          <button
            onClick={handleRemoveDiv}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer duration-200"
          >
            Ok
          </button>
        </div>
      )}
      <div className="my-4 py-2 px-4 bg-gray-100">
        {wallets.length > 0 ? (
          (() => {
            const item = wallets.find((item) => item.currency === "USDT");
            return item ? (
              <div
                key={item.currency}
                className="
                flex
                items-center
                justify-between
              "
              >
                <h4 className="font-semibold text-black">{item.currency}</h4>
                <p className="text-gray-700 font-light">${item.balance}</p>
              </div>
            ) : (
              <div className="text-black font-semibold">Sorry No Wallets</div>
            );
          })()
        ) : (
          <div>No wallets available</div>
        )}
      </div>
    </div>
  );
};

export default TradingOptions;
