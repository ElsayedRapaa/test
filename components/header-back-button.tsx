"use client";

import { useRouter } from "next/navigation";

import { BiArrowBack } from "react-icons/bi";

const HeaderBackButton = () => {
  const router = useRouter();

  return (
    <div
      className="
        border-b
        shadow-lg
        py-2
        px-4
        bg-gray-100
        sticky
        top-0
        left-0
        w-full
        z-20
      "
    >
      <button
        onClick={() => router.back()}
        className="outline-none border-none bg-transparent"
      >
        <BiArrowBack
          size={28}
          className="cursor-pointer text-black hover:text-blue-600 duration-200"
        />
      </button>
    </div>
  );
};

export default HeaderBackButton;
