import { create } from "zustand";

type UseToastProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useToast = create<UseToastProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useToast;
