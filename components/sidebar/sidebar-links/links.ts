import { MdAccountBalanceWallet } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { RiChatSmile2Fill } from "react-icons/ri";
import { HiQuestionMarkCircle } from "react-icons/hi";

export const sidebarLinks = [
  {
    id: 1,
    title: "My account",
    href: "/",
    icon: MdAccountBalanceWallet,
  },
  {
    id: 2,
    title: "Check card",
    href: "/",
    icon: MdAccountBalanceWallet,
  },
  {
    id: 3,
    title: "Authentication",
    href: "/signin",
    icon: FaUserCheck,
  },
  {
    id: 4,
    title: "Chat",
    href: "/",
    icon: RiChatSmile2Fill,
  },
  {
    id: 5,
    title: "!&A",
    href: "/",
    icon: HiQuestionMarkCircle,
  },
];
