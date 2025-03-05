// src/components/WalletConnect.jsx
import React from "react";
import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { Wallet } from "lucide-react";

const WalletConnect = () => {
  const { currentAccount } = useWalletKit();

  return (
    <div className="wallet-connect">
      {currentAccount ? (
        <div className="wallet-connected">
          <Wallet className="wallet-icon" size={16} />
          <span>
            {currentAccount.address.substring(0, 6)}...
            {currentAccount.address.substring(currentAccount.address.length - 4)}
          </span>
        </div>
      ) : (
        <ConnectButton className="connect-button" />
      )}
    </div>
  );
};

export default WalletConnect;
