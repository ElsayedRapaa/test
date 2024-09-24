"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface QRCodeAddProps {
  walletAddress: string;
  walletCurrency: string;
}

const QRCodeAdd: React.FC<QRCodeAddProps> = ({
  walletAddress,
  walletCurrency,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (walletAddress) {
      QRCode.toDataURL(walletAddress)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR Code:", err);
        });
    }
  }, [walletAddress]);

  return (
    <div className="py-2">
      <h3 className="pb-4">Scan code to send funds in {walletCurrency}</h3>
      <div className="mx-auto w-fit">
        {qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt={`QR code for ${walletCurrency} address`}
            width={256}
            height={256}
          />
        ) : (
          <p>Generating QR Code...</p>
        )}
      </div>
    </div>
  );
};

export default QRCodeAdd;
