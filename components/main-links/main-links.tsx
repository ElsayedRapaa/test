"use client";

import { LinksItems } from "./links-items";
import { mainLinks } from "./links/links";

const MainLinks = () => {
  return (
    <section
      className="
        w-full
        flex
        items-center
        justify-between
        sm:px-4
        px-0
        pt-4
      "
    >
      {mainLinks.map((item) => (
        <LinksItems
          key={item.id}
          title={item.title}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </section>
  );
};

export default MainLinks;
