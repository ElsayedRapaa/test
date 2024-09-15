type CoinIdProps = {
  params: {
    coinId: string;
  };
};

const CoidId: React.FC<CoinIdProps> = ({ params: { coinId } }) => {
  return (
    <div
      className="
        h-full
        flex
        items-center
        justify-center
      "
    >
      <h1 className="text-3xl font-bold text-red-700">{coinId}</h1>
    </div>
  );
};

export default CoidId;
