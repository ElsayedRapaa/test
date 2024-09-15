import { create } from "zustand";

type UseSidebarProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useSidebar = create<UseSidebarProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSidebar;
