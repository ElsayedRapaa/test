import CoinList from "@/components/crypto-currency/coin-list";
import Header from "@/components/header";
import MainLinks from "@/components/main-links/main-links";
import Swiper from "@/components/swiper/swiper";

export default function Home() {
  return (
    <main className="bg-white h-full">
      <Header />
      <section
        className="
          bg-gray-100
          py-10
          px-4
        "
      >
        <Swiper />
        <MainLinks />
      </section>
      <CoinList />
    </main>
  );
}
