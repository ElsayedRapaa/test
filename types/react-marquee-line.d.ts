declare module "react-marquee-line" {
  import React from "react";

  interface MarqueeLineProps {
    children: React.ReactNode;
  }

  const Marquee: React.FC<MarqueeLineProps>;

  export default Marquee;
}
