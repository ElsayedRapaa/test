"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaCircleCheck } from "react-icons/fa6";

const PrizePopup: React.FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prizeAmount, setPrizeAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrizeAmount = async () => {
      if (session?.user?._id) {
        try {
          const response = await fetch("/api/wallets", {
            method: "GET",
            headers: {
              userid: session.user._id,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPrizeAmount(
              data.wallets.find(
                (wallet: { currency: string }) => wallet.currency === "USDT"
              )?.balance || 0
            );
            if (
              data.wallets.find(
                (wallet: { currency: string }) => wallet.currency === "USDT"
              )?.balance > 0
            ) {
              setIsOpen(true);
            }
          }
        } catch (error) {
          console.error("Error fetching prize amount:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPrizeAmount();
  }, [session]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOk = async () => {
    if (session?.user?._id) {
      try {
        const response = await fetch("/api/first-login", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            userid: session.user._id,
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          handleClose();
          window.localStorage.setItem("taked-prize", "true");
        } else {
          console.error("Error updating first login");
        }
      } catch (error) {
        console.error("Error updating first login:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black/80" />
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (
    !isOpen ||
    prizeAmount === null ||
    prizeAmount <= 0 ||
    window.localStorage.getItem("taked-prize") === "true"
  )
    return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-black text-center">
      <div className="absolute inset-0 bg-black opacity-20" />
      <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-[320px]">
        <h2 className="text-xl font-bold mb-4">Congrats!</h2>
        <p className="mb-4 flex items-center gap-x-3 w-fit mx-auto text-lg font-light">
          <span>You Win ${prizeAmount}</span>
          <FaCircleCheck className="text-green-700" size={20} />
        </p>
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mx-auto block w-fit"
            onClick={handleOk}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrizePopup;
