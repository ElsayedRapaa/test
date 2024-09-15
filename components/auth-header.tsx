"use client";

import Link from "next/link";

const AuthHeader = () => {
  return (
    <header
      className="
        w-full
        px-4
        py-2
        bg-gray-50
        shadow-sm
      "
    >
      <Link href="/" className="text-xl font-bold text-blue-600">
        Mastercoin
      </Link>
    </header>
  );
};

export default AuthHeader;
