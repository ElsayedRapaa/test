import { MdAccountBalanceWallet } from "react-icons/md";
import { HiMiniFolderArrowDown } from "react-icons/hi2";
import { RiChatSmile2Fill } from "react-icons/ri";
import { MdAnalytics } from "react-icons/md";

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
    href: "/",
    icon: HiMiniFolderArrowDown,
  },
  {
    id: 3,
    title: "History",
    href: "/",
    icon: MdAnalytics,
  },
  {
    id: 4,
    title: "Chat",
    href: "/",
    icon: RiChatSmile2Fill,
  },
];
