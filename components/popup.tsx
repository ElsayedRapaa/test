import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import QRCodeAdd from "@/components/qr-code";
import { FiCopy } from "react-icons/fi";

interface WalletPopupProps {
  walletCurrency: string;
  walletAddress: string;
  isOpen: boolean;
  onClose: () => void;
}

const WalletPopup: React.FC<WalletPopupProps> = ({
  walletCurrency,
  walletAddress,
  isOpen,
  onClose,
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      alert("Wallet address copied!");
    });
  };

  return (
    <Popup open={isOpen} onClose={onClose} modal>
      <div className="modal p-4 text-black text-center flex flex-col gap-y-4 w-full sm:w-auto max-w-lg">
        <div className="header text-lg font-bold">Wallet Details</div>
        <div className="content">
          <p className="py-1">Wallet Currency: {walletCurrency}</p>
          <p className="py-1">
            Wallet Address: <br /> <p className="py-2">{walletAddress}</p>
            <button
              onClick={handleCopyAddress}
              className="ml-2 bg-gray-200 py-2 px-3 rounded-md"
            >
              <FiCopy className="inline" /> Copy Address
            </button>
          </p>
          <QRCodeAdd
            walletAddress={walletAddress}
            walletCurrency={walletCurrency}
          />
        </div>
        <div className="actions">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default WalletPopup;
