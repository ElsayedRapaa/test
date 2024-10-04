"use client";

import useToast from "@/hooks/use-toast";
import useTrading from "@/hooks/use-trading";

const WrapperTrading = () => {
  const trading = useTrading();
  const toast = useToast();

  const closeTrading = () => {
    trading.onClose();
  };

  return (
    <div
      className={`
        fixed
        inset-0
        bg-black
        transition-opacity
        duration-300
        z-10
        ${trading.isOpen ? "opacity-30" : "opacity-0 pointer-events-none"}
        ${toast.isOpen && "pointer-events-none"}
      `}
      onClick={closeTrading}
    ></div>
  );
};

export default WrapperTrading;
