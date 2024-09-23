import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import QRCodeAdd from "@/components/qr-code";

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
  return (
    <Popup open={isOpen} onClose={onClose} modal>
      <div className="modal p-4 text-black text-center flex flex-col gap-y-4">
        <div className="header text-lg font-bold">Wallet Details</div>
        <div className="content">
          <p className="py-1">Wallet Currency: {walletCurrency}</p>
          <p className="py-1">
            Wallet Address: <br />{" "}
            <span className="py-2 block">{walletAddress}</span>
          </p>
          <QRCodeAdd
            walletAddres={walletAddress}
            walletCurrency={walletCurrency}
          />
        </div>
        <div className="actions">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
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
