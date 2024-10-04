"use client";

import useTrading from "@/hooks/use-trading";
import Image from "next/image";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import TradingOptions from "./trading-options";
import useToast from "@/hooks/use-toast";

interface TradingProps {
  currency: string;
  image: string;
}

const Trading: React.FC<TradingProps> = ({ currency, image }) => {
  const [tradeState, setTradeState] = useState("Up");
  const tradingHook = useTrading();
  const toast = useToast();

  const closeTrading = () => {
    tradingHook.onClose();
  };

  return (
    <section
      className={`
        w-full
        z-50
        bg-white
        fixed
        top-24
        h-full
      `}
    >
      <div
        className={`
          border-b
          flex
          items-center
          justify-between
          p-4
          ${toast.isOpen && "pointer-events-none"}
        `}
      >
        <h3 className="font-bold text-2xl text-black">
          {currency.toUpperCase()}/USDT Delivery
        </h3>
        <button
          className="
            border-none
            outline-none
            p-0
            text-gray-400
            hover:text-black
            duration-200
          "
          onClick={closeTrading}
        >
          <MdClose size={24} />
        </button>
      </div>
      <div
        className="
          py-6
          px-4
          flex
          items-center
          gap-x-2
        "
      >
        <Image src={image} alt={currency} width={35} height={35} />
        <div className="flex flex-col font-semibold text-black">
          <h4 className="-mb-1">{currency}</h4>
          <p>
            Buy{" "}
            <span
              className={`${
                tradeState === "Up" ? "text-green-700" : "text-red-700"
              }`}
            >
              {tradeState}
            </span>
          </p>
        </div>
      </div>
      <TradingOptions tradeState={tradeState} setTradeState={setTradeState} />
    </section>
  );
};

export default Trading;
