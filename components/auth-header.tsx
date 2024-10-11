"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthHeaderProps {
  logo: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ logo }) => {
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
      <Link
        href="/"
        className="text-3xl font-bold text-black flex items-center gap-x-2"
      >
        <Image
          src={logo}
          alt="logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        Mastercoin
      </Link>
    </header>
  );
};

export default AuthHeader;
