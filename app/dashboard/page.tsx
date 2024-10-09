"use client";

import HeaderBackButton from "@/components/header-back-button";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

interface Wallet {
  currency: string;
  balance: number;
  address: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  wallets: Wallet[];
  role: string;
  address: string;
  pass: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [walletUpdates, setWalletUpdates] = useState<{ [key: string]: string }>(
    {}
  );
  const [currency, setCurrency] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [newRole, setNewRole] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const updateAddress = async () => {
    if (!selectedUserId || !walletUpdates) return;

    try {
      const response = await fetch(`/api/dashboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          walletUpdates: Object.entries(walletUpdates).map(
            ([currency, address]) => ({
              currency,
              address,
            })
          ),
        }),
      });
      const updatedUsers = await fetch("/api/dashboard");
      setUsers(await updatedUsers.json());
      setWalletUpdates({});
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const addFunds = async () => {
    if (!selectedUserId || !currency || amount === 0) return;

    try {
      const response = await fetch(`/api/dashboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          currency: currency.toUpperCase(),
          amount,
        }),
      });
      const updatedUsers = await fetch("/api/dashboard");
      setUsers(await updatedUsers.json());
      setCurrency("");
      setAmount(0);
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/dashboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });
      const updatedUsers = await fetch("/api/dashboard");
      setUsers(await updatedUsers.json());
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="bg-white text-black pb-4">
      <HeaderBackButton />
      <h1 className="text-lg font-semibold mb-4">Dashboard</h1>
      {users.map((user) => (
        <div
          key={user._id}
          className="mb-8 p-4 border rounded-md shadow-md bg-gray-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-sm font-medium">
              {user.role === "admin" ? "Admin" : "User"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Wallet Addresses</h3>
            {user.wallets.map((wallet) => (
              <div key={wallet.currency} className="mb-4">
                <label className="block mb-1 font-medium">
                  {wallet.currency} Address
                </label>
                <input
                  className="border border-gray-300 p-2 rounded-md w-full mb-2"
                  type="text"
                  value={wallet.address}
                  placeholder={`${wallet.currency} Address`}
                  readOnly
                />
                <input
                  className="border border-gray-300 p-2 rounded-md w-full mb-2"
                  type="text"
                  placeholder={`New ${wallet.currency} Address`}
                  onChange={(e) =>
                    setWalletUpdates((prev) => ({
                      ...prev,
                      [wallet.currency]: e.target.value,
                    }))
                  }
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setSelectedUserId(user._id);
                    updateAddress();
                  }}
                >
                  Update Address
                </button>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Add Funds</h3>
            <div className="mb-4">
              <input
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
                type="text"
                placeholder="Currency"
                onChange={(e) => setCurrency(e.target.value)}
              />
              <input
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
                type="number"
                placeholder="Amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setSelectedUserId(user._id);
                  addFunds();
                }}
              >
                Add Funds
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Change Role</h3>
            <div className="mb-4">
              <select
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
                value={user.role}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                onClick={() => updateUserRole(user._id, newRole)}
              >
                Change Role
              </button>
            </div>
          </div>
          {user.address && user.pass && (
            <div className="font-bold text-lg flex flex-col gap-2 w-fit mx-auto mt-4">
              <p className="bg-green-700/20 text-green-500 px-4 py-2 rounded-md">
                <span className="text-black">ADDRESS: </span>
                {user.address}
              </p>
              <p className="bg-green-700/20 text-green-500 px-4 py-2 rounded-md">
                <span className="text-black">PASSWORD: </span>
                {user.pass}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
