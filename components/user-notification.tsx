"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const UserCountNotification: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [newUsername, setNewUsername] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { data: session } = useSession();

  const fetchUserData = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (data.success) {
      setUserCount(data.userCount);
      if (data.newUser) {
        setNewUsername(data.newUser);
        setPopupVisible(true);
      }
    } else {
      console.error(data.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const closePopup = () => {
    setPopupVisible(false);
  };

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div>
      {isPopupVisible && newUsername && (
        <div className="fixed top-5 right-5 bg-green-500 text-white rounded-lg p-4 shadow-lg">
          <p>
            New user registered: {newUsername} - {userCount}
          </p>
          <button
            onClick={closePopup}
            className="bg-red-600 text-white rounded px-2 py-1 mt-2"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCountNotification;
