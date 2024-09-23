import QRCode from "qrcode.react";

interface QRCodeAddProps {
  walletAddres: string;
  walletCurrency: string;
}

const QRCodeAdd: React.FC<QRCodeAddProps> = ({
  walletAddres,
  walletCurrency,
}) => {
  return (
    <div
      className="
        py-2
      "
    >
      <h3 className="pb-4">Scan code to send funds {walletCurrency}</h3>
      <div className="mx-auto w-fit">
        <QRCode value={walletAddres} size={256} />
      </div>
    </div>
  );
};

export default QRCodeAdd;
