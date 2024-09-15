"use client";

import Link from "next/link";

const LoginRegisterButton = () => {
  return (
    <Link
      href="/signin"
      className="
        text-white
        px-4
        py-1
        rounded-md
        bg-blue-500
        hover:bg-blue-700
        duration-300
      "
    >
      Login Register
    </Link>
  );
};

export default LoginRegisterButton;
