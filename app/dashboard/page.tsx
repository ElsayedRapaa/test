"use client";

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

  return (
    <div className="bg-white text-black p-4">
      <h1>Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Wallets</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-2 border-black">
              <td>{user.username}</td>
              <td>
                <ul>
                  {user.wallets.map((wallet) => (
                    <li key={wallet.currency}>
                      <p>Currency: {wallet.currency}</p>
                      <p>Balance: {wallet.balance}</p>
                      <p>Address: {wallet.address}</p>
                      <input
                        className="border-2 border-black p-2 rounded-md"
                        type="text"
                        placeholder="New Address"
                        onChange={(e) =>
                          setWalletUpdates((prev) => ({
                            ...prev,
                            [wallet.currency]: e.target.value,
                          }))
                        }
                      />
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedUserId(user._id);
                    updateAddress();
                  }}
                >
                  Update Address
                </button>

                <input
                  className="border-2 border-black p-2 rounded-md"
                  type="text"
                  placeholder="Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                />
                <input
                  className="border-2 border-black p-2 rounded-md"
                  type="number"
                  placeholder="Amount"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <button
                  onClick={() => {
                    setSelectedUserId(user._id);
                    addFunds();
                  }}
                >
                  Add Funds
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
