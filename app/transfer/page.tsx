/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image"; // إضافة Image لاستيراد صورة العملة

interface Wallet {
  currency: string;
  balance: number;
}

interface Transfer {
  currency: string;
  amount: number;
  date: Date;
}

const TransferPage: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USDT"); // تعيين العملة الافتراضية
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
            headers: { userid: userId },
          });
          const data = await response.json();
          setWallets(data.wallets);

          // Update balance for the selected currency
          const wallet = data.wallets.find(
            (wallet: Wallet) => wallet.currency === selectedCurrency
          );
          setBalance(wallet?.balance || 0);
        } catch (error) {
          console.error("Error fetching wallets:", error);
        }
      };

      fetchWallets();

      const savedWithdrawals = JSON.parse(
        localStorage.getItem("withdrawals") || "[]"
      );
      setWithdrawals(savedWithdrawals);
    }
  }, [session, selectedCurrency]); // Add selectedCurrency as a dependency

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
      // تحقق من الحد الأقصى للسحب
      setErrorMessage("Cannot withdraw more than $100");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(`/api/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: session?.user?._id || "", // Use session user ID
        },
        body: JSON.stringify({ currency: selectedCurrency, amount }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get error response text
        console.error("Error Response:", errorText);
        setErrorMessage("Transfer failed, please try again.");
        setSuccessMessage("");
        return;
      }

      // خصم المبلغ من الرصيد
      setBalance((prevBalance) => prevBalance - amount);

      setSuccessMessage(
        "Processing your withdrawal. It will be completed within 24 hours."
      );
      setErrorMessage("");

      const newWithdrawal = {
        currency: selectedCurrency,
        amount,
        date: new Date(),
      };
      const updatedWithdrawals = [...withdrawals, newWithdrawal];
      setWithdrawals(updatedWithdrawals);
      localStorage.setItem("withdrawals", JSON.stringify(updatedWithdrawals));

      setTimeout(() => {
        setSuccessMessage("Withdrawal successful!");
      }, 24 * 60 * 60 * 1000); // 24 hours
    } catch (error) {
      console.error("Transfer failed:", error);
      setErrorMessage("Transfer failed, please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center p-4">
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
          <option value="USDT">USDT</option> {/* فقط USDT */}
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