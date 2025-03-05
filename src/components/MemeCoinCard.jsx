// src/components/MemeCoinCard.jsx
import React, { useState, useEffect } from "react";
import ReactionCounterCard from "./ReactionCounterCard";

const MemeCoinCard = ({ coin, network, onDeleteCoin, onUpdateReactions }) => {
  const [chartError, setChartError] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(true);

  const explorerUrl =
    network === "solana"
      ? `https://solscan.io/token/${coin.contractAddress}`
      : `https://explorer.sui.io/addresses/${coin.contractAddress}?network=mainnet`;

  const formatPoolAddress = () => {
    if (coin.poolAddress.includes("/")) return coin.poolAddress;
    return `${network}/${coin.poolAddress}`;
  };

  const dexScreenerUrl = `https://dexscreener.com/${formatPoolAddress()}?embed=1&theme=light&interval=5m`;

  const handleIframeError = () => {
    setChartError(true);
    setIsChartLoading(false);
  };

  const handleIframeLoad = () => {
    setIsChartLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isChartLoading) {
        setChartError(true);
        setIsChartLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isChartLoading]);

  return (
    <div className="meme-coin-card">
      <ReactionCounterCard
        coinId={coin.id}
        rocketCount={coin.rocketCount || 0}
        fireCount={coin.fireCount || 0}
        onUpdateReactions={onUpdateReactions}
      />
      <button className="delete-button" onClick={() => onDeleteCoin(coin.id)} title="Delete Coin">
        &ndash;
      </button>
      <div className="card-header">
        {coin.logoUrl && <img src={coin.logoUrl} alt={coin.name} className="coin-logo" />}
        <h2 className="coin-title">{coin.name}</h2>
      </div>
      <div className="contract-section">
        <p className="contract-label">Contract Address:</p>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="contract-link">
          {coin.contractAddress.substring(0, 10)}...{coin.contractAddress.substring(coin.contractAddress.length - 6)}
        </a>
      </div>
      <div className="chart-container">
        {isChartLoading && (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>Loading chart...</p>
          </div>
        )}
        {chartError ? (
          <div className="chart-error">
            <p className="error-title">Chart Unavailable</p>
            <p className="error-message">
              The trading chart for this token couldn't be loaded.
            </p>
            <a href={`https://dexscreener.com/${formatPoolAddress()}`} target="_blank" rel="noopener noreferrer" className="view-button">
              View on DexScreener
            </a>
          </div>
        ) : (
          <iframe
            title={coin.name}
            src={dexScreenerUrl}
            width="100%"
            height="350"
            frameBorder="0"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isChartLoading ? "none" : "block" }}
          />
        )}
      </div>
    </div>
  );
};

export default MemeCoinCard;
