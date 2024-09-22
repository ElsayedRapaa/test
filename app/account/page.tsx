"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Wallet {
  currency: string;
  balance: number;
  address: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);

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

  if (status === "loading" || !session) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <h2>{session?.user?.username}</h2>
      <p>Email: {session?.user?.email}</p>

      <h3>Wallets</h3>
      <ul>
        {wallets.length > 0 ? (
          wallets.map((wallet, index) => (
            <li key={index}>
              <p>Currency: {wallet.currency}</p>
              <p>Balance: {wallet.balance}</p>
              <p>Address: {wallet.address}</p>
            </li>
          ))
        ) : (
          <p>No wallets available</p>
        )}
      </ul>
    </div>
  );
};

export default ProfilePage;
