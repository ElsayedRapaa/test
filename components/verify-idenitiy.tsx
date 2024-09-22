"use client";

// import { useSession } from "next-auth/react";

const VerifyIdenitiy = () => {
  // const { data: session } = useSession();
  // const isVerify = session?.user.isVerify;

  return (
    <section
      className={`
        w-full
        my-6
        px-20
        py-4
        space-y-5
      `}
    >
      <p
        className="
          bg-destructive/20
          text-destructive
          font-semibold
          text-center
          rounded-md
          py-4
        "
      >
        Complete identity verification to keep account active
      </p>
      <button
        className="
          w-fit
          block
          mx-auto
          outline-none
          border
          border-blue-600
          bg-transparent
          text-blue-600
          px-2
          py-1
          rounded-md
          cursor-pointer
          hover:text-white
          hover:bg-blue-600
          duration-300
        "
      >
        Check idintity verification
      </button>
    </section>
  );
};

export default VerifyIdenitiy;
