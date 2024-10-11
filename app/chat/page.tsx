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
          my-4
          mx-4
          py-2
          px-4
          bg-blue-600
          rounded-md
          flex
          items-center
          justify-between
        "
      >
        <h4>Chat to Team 1</h4>
        <Link
          href="https://t.me/eatthebl0cks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline font-semibold"
        >
          Go To Chat
        </Link>
      </div>
      <div
        className="
          my-4
          mx-4
          py-2
          px-4
          bg-blue-600
          rounded-md
          flex
          items-center
          justify-between
        "
      >
        <h4>Chat to Team 2</h4>
        <Link
          href="https://t.me/erapaa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline font-semibold"
        >
          Go To Chat
        </Link>
      </div>
    </div>
  );
};

export default Chat;
