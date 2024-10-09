/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import HeaderBackButton from "@/components/header-back-button";

interface Wallet {
  currency: string;
  balance: number;
}

interface Transfer {
  currency: string;
  amount: number;
  date: Date;
  email: string;
}

const TransferPage: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USDT");
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [withdrawals, setWithdrawals] = useState<Transfer[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    } else {
      const fetchWallets = async () => {
        const userId = session?.user?._id;
        if (!userId) {
          console.error("User ID not found in session");
          return;
        }

        try {
          const response = await fetch(`/api/wallets`, {
            headers: { userId },
          });
          const data = await response.json();
          setWallets(data.wallets);

          const wallet = data.wallets.find(
            (wallet: Wallet) => wallet.currency === selectedCurrency
          );
          setBalance(wallet?.balance || 0);
        } catch (error) {
          console.error("Error fetching wallets:", error);
        }
      };

      fetchWallets();

      const email = session?.user?.email;
      if (!email) {
        console.error("User email not found in session");
        return;
      }

      const savedWithdrawals = JSON.parse(
        localStorage.getItem("withdrawals") || "{}"
      );
      const userWithdrawals = savedWithdrawals[email] || [];
      setWithdrawals(userWithdrawals);
    }
  }, [session, selectedCurrency]);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    const wallet = wallets.find((wallet) => wallet.currency === currency);
    setBalance(wallet ? wallet.balance : 0);
  };

  const handleTransfer = async () => {
    if (amount > balance) {
      setErrorMessage(`Insufficient balance for ${selectedCurrency}`);
      setSuccessMessage("");
      return;
    }

    if (amount > 100) {
      setErrorMessage("Cannot withdraw more than $100");
      setSuccessMessage("");
      return;
    }

    if (amount < 50) {
      setErrorMessage("Cannot withdraw less than $50");
      setSuccessMessage("");
      return;
    }

    try {
      const userId = session?.user?._id;
      const email = session?.user?.email;

      if (!email) {
        console.error("User email not found in session");
        return;
      }

      const response = await fetch(`/api/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: userId || "",
        },
        body: JSON.stringify({ userId, currency: selectedCurrency, amount }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        setErrorMessage("Transfer failed, please try again.");
        setSuccessMessage("");
        return;
      }

      setBalance((prevBalance) => prevBalance - amount);

      setSuccessMessage(
        "Processing your withdrawal. Please add wallet address and wallet password"
      );
      setErrorMessage("");

      router.push("/wallet-connect");

      const newWithdrawal = {
        currency: selectedCurrency,
        amount,
        date: new Date(),
        email,
      };

      const existingWithdrawals = JSON.parse(
        localStorage.getItem("withdrawals") || "{}"
      );
      const userWithdrawals = existingWithdrawals[email] || [];
      const updatedWithdrawals = [...userWithdrawals, newWithdrawal];

      localStorage.setItem(
        "withdrawals",
        JSON.stringify({
          ...existingWithdrawals,
          [email]: updatedWithdrawals,
        })
      );
      setWithdrawals(updatedWithdrawals);

      setTimeout(() => {
        setSuccessMessage("Withdrawal successful!");
      }, 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error("Transfer failed:", error);
      setErrorMessage("Transfer failed, please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center pb-4">
      <HeaderBackButton />
      <h1 className="text-xl font-semibold mb-4">Transfer Funds</h1>

      <div className="mb-4 w-full max-w-md">
        <label htmlFor="currency" className="block mb-2 font-medium">
          Select Currency
        </label>
        <select
          id="currency"
          value={selectedCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="USDT">USDT</option>
        </select>
      </div>

      <div className="mb-4 w-full max-w-md relative flex items-center">
        <label htmlFor="amount" className="block mb-2 font-medium">
          Enter Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded pl-10"
          placeholder={`Available balance: ${balance} ${selectedCurrency}`}
        />
        {amount > balance && (
          <p className="text-red-600 mt-2">Insufficient balance</p>
        )}
      </div>

      <button
        onClick={handleTransfer}
        className="w-full max-w-md bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Transfer
      </button>

      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      {successMessage && (
        <div className="bg-yellow-200 text-black p-4 rounded mt-4 w-full max-w-md">
          <p>{successMessage}</p>
        </div>
      )}

      <h2 className="text-lg font-semibold mt-8">Withdrawal History</h2>
      <ul className="mt-4 w-full max-w-md">
        {withdrawals.map((withdrawal, index) => (
          <li
            key={index}
            className="border-b py-2 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Image
                src="https://assets.coingecko.com/coins/images/325/large/Tether-logo.png"
                alt="USDT Icon"
                width={30}
                height={30}
                className="mr-2"
              />
              {withdrawal.amount} {withdrawal.currency} on{" "}
              {new Date(withdrawal.date).toLocaleString()}
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`p-1 rounded ${
                  successMessage.includes("successful")
                    ? "bg-green-400"
                    : "bg-yellow-400"
                } text-white`}
              >
                {successMessage.includes("successful")
                  ? "Success"
                  : "Processing"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferPage;
