"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Wallet {
  currency: string;
  balance: number;
  address: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: Date;
}

interface User {
  username: string;
  email: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerify: boolean;
  isAcceptingMessage: boolean;
  wallets: Wallet[];
  transactionHistory: Transaction[];
  binanceApiKey: string;
  binanceApiSecret: string;
}

const Wallet = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/signin");
    } else {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(
            `/api/account?userId=${session.user._id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: User = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>
          <p>
            Verification Status: {user.isVerify ? "Verified" : "Not Verified"}
          </p>
          <p>Accepting Messages: {user.isAcceptingMessage ? "Yes" : "No"}</p>
          <h3>Wallets</h3>
          <ul>
            {user.wallets.map((wallet, index) => (
              <li key={index}>
                <p>Currency: {wallet.currency}</p>
                <p>Balance: {wallet.balance}</p>
                <p>Address: {wallet.address}</p>
              </li>
            ))}
          </ul>
          <h3>Transaction History</h3>
          <ul>
            {user.transactionHistory.map((transaction, index) => (
              <li key={index}>
                <p>ID: {transaction.id}</p>
                <p>Type: {transaction.type}</p>
                <p>Amount: {transaction.amount}</p>
                <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
          <h3>Binance API Key</h3>
          <p>{user.binanceApiKey}</p>
          <h3>Binance API Secret</h3>
          <p>{user.binanceApiSecret}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Wallet;
