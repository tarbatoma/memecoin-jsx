// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Coins, AlertCircle } from "lucide-react";
import WalletConnect from "../components/WalletConnect";

const HomePage = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signAndExecuteTransactionBlock, currentAccount } = useWalletKit();

  const RECIPIENT_ADDRESS = "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractAddress.trim()) {
      setError("Please enter a contract address");
      return;
    }
    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const txb = new TransactionBlock();
      txb.transferObjects(
        [txb.splitCoins(txb.gas, [1000000000])],
        txb.pure(RECIPIENT_ADDRESS)
      );
      await signAndExecuteTransactionBlock({ transactionBlock: txb });
      console.log("Transaction successful");
      navigate(`/analysis/${contractAddress}`);
    } catch (err) {
      console.error("Transaction failed:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipDemo = () => {
    if (!contractAddress.trim()) {
      setError("Please enter a contract address");
      return;
    }
    navigate(`/analysis/${contractAddress}`);
  };

  return (
    <div className="home-container">
      <div className="wallet-container">
        <WalletConnect />
      </div>
      <div className="form-container">
        <div className="icon-container">
          <Coins size={48} color="#1a73e8" />
        </div>
        <h1 className="title">SUI Token Analyzer</h1>
        <p className="subtitle">Enter a contract address to analyze token metrics and potential</p>
        <form onSubmit={handleSubmit} className="home-form">
          <div className="input-group">
            <label htmlFor="contractAddress" className="label">
              Contract Address
            </label>
            <input
              id="contractAddress"
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="input"
              required
            />
          </div>
          <div className="info-box">
            <p className="info-text">
              Analysis fee: <span className="info-highlight">1 SUI</span>
            </p>
            <p className="info-subtext">
              Payment will be processed through your connected SUI wallet
            </p>
          </div>
          {error && (
            <div className="error-box">
              <AlertCircle size={16} className="error-icon" />
              <p className="error-text">{error}</p>
            </div>
          )}
          <div className="button-group">
            <button type="submit" disabled={isLoading || !currentAccount} className="button primary-button">
              {isLoading ? "Processing..." : currentAccount ? "Pay & Analyze" : "Connect Wallet First"}
            </button>
            <button type="button" onClick={handleSkipDemo} className="button secondary-button">
              Skip Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
