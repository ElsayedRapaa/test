import { MdAccountBalanceWallet } from "react-icons/md";
import { HiMiniFolderArrowDown } from "react-icons/hi2";
import { RiChatSmile2Fill } from "react-icons/ri";

export const mainLinks = [
  {
    id: 1,
    title: "My account",
    href: "/account",
    icon: MdAccountBalanceWallet,
  },
  {
    id: 2,
    title: "Withdraw coins",
    href: "/transfer",
    icon: HiMiniFolderArrowDown,
  },
  {
    id: 4,
    title: "Chat",
    href: "/chat",
    icon: RiChatSmile2Fill,
  },
];
