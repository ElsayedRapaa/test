import { create } from "zustand";

type UseTradingProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useTrading = create<UseTradingProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useTrading;
