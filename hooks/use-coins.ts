import create from "zustand";

type CoinDetails = {
  price: number;
  priceChangePercentage24h: number;
  volume: number;
  high24h: number;
  low24h: number;
  name: string;
  image: string;
};

type CoinData = {
  [key: string]: CoinDetails;
};

type CoinsProps = {
  coinData: CoinData;
  updateCoinData: (data: CoinData) => void;
};

const useCoins = create<CoinsProps>((set) => ({
  coinData: {},
  updateCoinData: (data) => set({ coinData: data }),
}));

export default useCoins;
