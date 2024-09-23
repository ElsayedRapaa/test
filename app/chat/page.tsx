"use client";

import Link from "next/link";
import HeaderBackButton from "@/components/header-back-button";

const Chat = () => {
  return (
    <div
      className="
        bg-gray-100
        h-full
      "
    >
      <HeaderBackButton />
      <div
        className="
          py-4
          flex
          items-center
          justify-center
        "
      >
        <Link
          href="https://t.me/eatthebl0cks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-semibold"
        >
          Go To Chat
        </Link>
      </div>
    </div>
  );
};

export default Chat;
