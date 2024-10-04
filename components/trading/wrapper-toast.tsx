"use client";

import useToast from "@/hooks/use-toast";

interface WrapperToastProps {
  children: React.ReactNode;
}

const WrapperToast: React.FC<WrapperToastProps> = ({ children }) => {
  const toast = useToast();

  const closeToast = () => {
    toast.onClose();
  };

  return (
    <div
      className={`
        fixed
        inset-0
        bg-black
        transition-opacity
        duration-300
        z-50
        ${toast.isOpen ? "opacity-30" : "opacity-0 pointer-events-none"}
      `}
      onClick={closeToast}
    >
      {children}
    </div>
  );
};

export default WrapperToast;
