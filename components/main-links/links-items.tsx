"use client";

import Link from "next/link";
import { IconType } from "react-icons";

type LinksItemsProps = {
  id?: number;
  title: string;
  href: string;
  icon: IconType;
};
export const LinksItems: React.FC<LinksItemsProps> = ({
  title,
  href,
  icon: Icon,
}) => {
  return (
    <Link
      href={href}
      className="
        flex
        flex-col
        gap-y-1
        items-center
        justify-center
      "
    >
      <Icon size={36} className="text-blue-600" />
      <h3
        className="
          text-black
          font-bold
        "
      >
        {title}
      </h3>
    </Link>
  );
};
