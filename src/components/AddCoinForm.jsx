// src/components/AddCoinForm.jsx
import React, { useState } from "react";

const AddCoinForm = ({ onClose, onAddCoin, selectedNetwork }) => {
  const [name, setName] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [network, setNetwork] = useState(selectedNetwork || "solana");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!contractAddress.trim()) newErrors.contractAddress = "Contract address is required";
    if (!poolAddress.trim()) newErrors.poolAddress = "Pool address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let formattedPoolAddress = poolAddress;
    if (!formattedPoolAddress.includes("/")) {
      formattedPoolAddress = `${network}/${poolAddress}`;
    }

    const newCoin = {
      name,
      contractAddress,
      poolAddress: formattedPoolAddress,
      logoUrl: logoUrl || getDefaultLogo(name),
    };

    onAddCoin(newCoin);
    onClose();

    // Reset fields
    setName("");
    setContractAddress("");
    setPoolAddress("");
    setLogoUrl("");
  };

  const getDefaultLogo = (coinName) => {
    const defaultLogos = {
      doge: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
      shib: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
      pepe: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
      floki: "https://cryptologos.cc/logos/floki-inu-floki-logo.png",
      sui: "https://cryptologos.cc/logos/sui-sui-logo.png",
      sol: "https://cryptologos.cc/logos/solana-sol-logo.png",
    };
    const lowerName = coinName.toLowerCase();
    for (const key in defaultLogos) {
      if (lowerName.includes(key)) return defaultLogos[key];
    }
    return "https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png";
  };

  return (
    <div className="overlay">
      <div className="form-container">
        <h2 className="form-title">Add Coin</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`input ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </label>
          <label className="label">
            Contract Address:
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              required
              className={`input ${errors.contractAddress ? "input-error" : ""}`}
            />
            {errors.contractAddress && <p className="error-text">{errors.contractAddress}</p>}
          </label>
          <div className="network-selector">
            <p className="network-label">Select Network:</p>
            <div className="network-buttons">
              <button
                type="button"
                className={`network-button ${network === "solana" ? "active-network-button" : ""}`}
                onClick={() => setNetwork("solana")}
              >
                Solana
              </button>
              <button
                type="button"
                className={`network-button ${network === "sui" ? "active-network-button" : ""}`}
                onClick={() => setNetwork("sui")}
              >
                SUI
              </button>
            </div>
          </div>
          <label className="label">
            Pool Address (from DexScreener):
            <input
              type="text"
              value={poolAddress}
              onChange={(e) => setPoolAddress(e.target.value)}
              required
              className={`input ${errors.poolAddress ? "input-error" : ""}`}
            />
            {errors.poolAddress && <p className="error-text">{errors.poolAddress}</p>}
            <p className="helper-text">
              Find the pool address by searching for your token on{" "}
              <a href={`https://dexscreener.com/${network}`} target="_blank" rel="noopener noreferrer" className="link">
                DexScreener
              </a>{" "}
              and copy the address from the URL.
            </p>
          </label>
          <label className="label">
            Logo URL (optional):
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="input"
            />
            <p className="helper-text">Leave empty for a default logo based on the coin name.</p>
          </label>
          <div className="button-group">
            <button type="submit" className="button button-green">Add</button>
            <button type="button" onClick={onClose} className="button button-red">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoinForm;
