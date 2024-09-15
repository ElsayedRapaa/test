"use client";

import Image from "next/image";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const Swiper = () => {
  const data = [
    {
      id: 1,
      title: "Trade Now",
      description:
        "There will only ever be 21 million bitcoin mined. Get trading now",
      img: "https://static.rain.com/banners/trade_now.png",
    },
    {
      id: 2,
      title: "Check out new assets",
      description:
        "Specially selected coins for you to trade including Shiba Inu, Chainlink, Tether, and more.",
      img: "https://static.rain.com/banners/new_assets.png",
    },
  ];

  return (
    <section>
      <SwiperReact
        className="
          mx-auto
          p-4
          shadow-2xl
          rounded-lg
          max-w-[600px]
          mb-10
          z-10
        "
        modules={[Navigation, Autoplay]}
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="
                flex
                items-center
                gap-x-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-y-2
                  text-black
                  flex-1
                  text-center
                "
              >
                <h5 className="font-bold">{item.title}</h5>
                <p>{item.description}</p>
              </div>
              <Image src={item.img} alt={item.title} width={120} height={120} />
            </div>
          </SwiperSlide>
        ))}
      </SwiperReact>
    </section>
  );
};

export default Swiper;
