// src/components/AnalyzeModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const AnalyzeModal = ({ onClose }) => {
  const [contract, setContract] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("sui");
  const { signAndExecuteTransactionBlock, currentAccount, connected } = useWalletKit();
  const navigate = useNavigate();

  const SUI_RECIPIENT_ADDRESS = "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234";
  const SOLANA_RECIPIENT_ADDRESS = "DezU6iz7jxFzS6nD1mjuU39eaFX5g8JJVnkn2V8D2Pqp";

  const SUI_PAYMENT_AMOUNT = 2;
  const SOLANA_PAYMENT_AMOUNT = 0.1;

  useEffect(() => {
    if (!connected && currentAccount) {
      setError("Wallet connection issue. Please reconnect your wallet.");
    } else {
      setError("");
    }
  }, [connected, currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract.trim()) {
      setError("Please enter a contract address");
      return;
    }
    if (!currentAccount && paymentMethod === "sui") {
      setError("Please connect your SUI wallet first");
      return;
    }
    setIsLoading(true);
    setError("");
    if (paymentMethod === "sui") {
      await processSuiPayment();
    } else {
      await processSolanaPayment();
    }
  };

  const processSuiPayment = async () => {
    try {
      const txb = new TransactionBlock();
      txb.transferObjects(
        [txb.splitCoins(txb.gas, [2000000000])],
        txb.pure(SUI_RECIPIENT_ADDRESS)
      );
      await signAndExecuteTransactionBlock({ transactionBlock: txb });
      navigate(`/analysis/${contract}`);
      onClose();
    } catch (err) {
      console.error("Transaction failed:", err);
      if (err.message && err.message.includes("insufficient balance")) {
        setError(`Insufficient balance. Please ensure you have at least ${SUI_PAYMENT_AMOUNT} SUI in your wallet.`);
      } else if (err.message && err.message.includes("rejected")) {
        setError("Transaction was rejected. Please try again.");
      } else if (err.message && err.message.includes("timeout")) {
        setError("Transaction timed out. Please try again.");
      } else {
        setError("Payment failed. Please check your wallet connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processSolanaPayment = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        setError("Phantom wallet is not installed. Please install it to continue.");
        setIsLoading(false);
        return;
      }
      await window.solana.connect();
      const connection = new window.solana.Connection("https://api.mainnet-beta.solana.com");
      const transaction = new window.solana.Transaction().add(
        window.solana.SystemProgram.transfer({
          fromPubkey: window.solana.publicKey,
          toPubkey: new window.solana.PublicKey(SOLANA_RECIPIENT_ADDRESS),
          lamports: SOLANA_PAYMENT_AMOUNT * 1000000000,
        })
      );
      const signature = await window.solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature.signature);
      navigate(`/analysis/${contract}`);
      onClose();
    } catch (err) {
      console.error("Solana transaction failed:", err);
      setError("Solana payment failed. Please check your wallet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipDemo = () => {
    if (!contract.trim()) {
      setError("Please enter a contract address");
      return;
    }
    navigate(`/analysis/${contract}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Analyze Coin</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            Contract Address:
            <input
              type="text"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              required
              placeholder="0x..."
              className="modal-input"
            />
          </label>
          <div className="payment-options">
            <p className="payment-options-title">Pay With:</p>
            <div className="payment-buttons">
              <button
                type="button"
                className={`payment-button ${paymentMethod === "sui" ? "active" : ""}`}
                onClick={() => setPaymentMethod("sui")}
              >
                SUI
              </button>
              <button
                type="button"
                className={`payment-button ${paymentMethod === "solana" ? "active" : ""}`}
                onClick={() => setPaymentMethod("solana")}
              >
                Solana
              </button>
            </div>
          </div>
          <div className="payment-info">
            <p className="payment-text">
              You will be charged {paymentMethod === "sui" ? `${SUI_PAYMENT_AMOUNT} SUI` : `${SOLANA_PAYMENT_AMOUNT} SOL`}.
            </p>
            <p className="payment-subtext">
              Payment will be processed through your connected {paymentMethod === "sui" ? "SUI" : "Phantom"} wallet.
            </p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-button-group">
            <button type="submit" disabled={isLoading || (paymentMethod === "sui" && !currentAccount)} className="modal-button modal-button-primary">
              {isLoading
                ? "Processing..."
                : paymentMethod === "sui" && !currentAccount
                ? "Connect SUI Wallet First"
                : "Proceed"}
            </button>
            <button type="button" onClick={handleSkipDemo} className="modal-button modal-button-secondary">
              Skip Demo
            </button>
          </div>
          <button type="button" onClick={onClose} className="modal-button modal-button-cancel">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnalyzeModal;
