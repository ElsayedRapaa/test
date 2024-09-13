"use client";

import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

import AuthHeader from "@/components/auth-header";

const Signin = () => {
  return (
    <section
      className="
        bg-gray-100
        h-full
      "
    >
      <AuthHeader />
      <h1 className="text-4xl text-center mt-6 mb-16 text-black">Mastercoin</h1>
      <form
        className="
          w-full
          flex
          flex-col
          gap-y-4
          px-16
        "
      >
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-gray-100 px-2">
            <MdEmail size={22} className="text-black" />
          </div>
          <input
            type="email"
            placeholder="Your Email"
            value=""
            onChange={() => {}}
            disabled={false}
            className="
              focus:placeholder:opacity-0
              placeholder:duration-300
              w-full
              py-2
              px-4
              rounded-md
            "
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-gray-100 px-2">
            <FaLock size={22} className="text-black" />
          </div>
          <input
            type="password"
            placeholder="Enter Password"
            value=""
            onChange={() => {}}
            disabled={false}
            className="
              focus:placeholder:opacity-0
              placeholder:duration-300
              w-full
              py-2
              px-4
              rounded-md
            "
          />
        </div>
        <button
          className="
            text-white
            bg-blue-600
            cursor-pointer
            outline-none
            border-none
            rounded-md
            py-2
            hover:bg-blue-700
            duration-300
          "
        >
          Login
        </button>
        <button
          className="
            text-blue-600
            bg-transparent
            cursor-pointer
            border
            border-blue-600
            outline-none
            rounded-md
            py-2
            hover:bg-blue-600
            hover:text-white
            duration-300
          "
        >
          Register in now
        </button>
      </form>
    </section>
  );
};

export default Signin;
