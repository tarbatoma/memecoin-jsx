// src/pages/MemeCoinFinderPage.jsx
import React, { useState, useEffect } from "react";
import NetworkSelector from "../components/NetworkSelector";
import MemeCoinCard from "../components/MemeCoinCard";
import AddCoinForm from "../components/AddCoinForm";
import Banner from "../components/Banner";
import AnalyzeModal from "../components/AnalyzeModal";
import { solanaCoins, suiCoins } from "../components/coinData";

const MemeCoinFinderPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("solana");
  const [coins, setCoins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);

  useEffect(() => {
    loadCoins();
  }, [selectedNetwork]);

  const loadCoins = () => {
    const storageKey = selectedNetwork === "solana" ? "solanaCoins" : "suiCoins";
    const savedCoins = localStorage.getItem(storageKey);
    if (savedCoins) {
      setCoins(JSON.parse(savedCoins));
    } else {
      const defaultCoins = selectedNetwork === "solana" ? solanaCoins : suiCoins;
      const initialCoins = defaultCoins.map((coin, index) => ({
        ...coin,
        id: `default-${selectedNetwork}-${index}`,
        rocketCount: 0,
        fireCount: 0,
      }));
      setCoins(initialCoins);
      localStorage.setItem(storageKey, JSON.stringify(initialCoins));
    }
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
  };

  const handleAddCoin = (newCoin) => {
    const coinWithId = {
      ...newCoin,
      id: `${selectedNetwork}-${Date.now()}`,
      rocketCount: 0,
      fireCount: 0,
    };
    const updatedCoins = [...coins, coinWithId];
    setCoins(updatedCoins);
    const storageKey = selectedNetwork === "solana" ? "solanaCoins" : "suiCoins";
    localStorage.setItem(storageKey, JSON.stringify(updatedCoins));
  };

  const handleDeleteCoin = (coinId) => {
    const updatedCoins = coins.filter((coin) => coin.id !== coinId);
    setCoins(updatedCoins);
    const storageKey = selectedNetwork === "solana" ? "solanaCoins" : "suiCoins";
    localStorage.setItem(storageKey, JSON.stringify(updatedCoins));
  };

  const handleUpdateReactions = (coinId, newReactions) => {
    const updatedCoins = coins.map((coin) =>
      coin.id === coinId ? { ...coin, ...newReactions } : coin
    );
    setCoins(updatedCoins);
    const storageKey = selectedNetwork === "solana" ? "solanaCoins" : "suiCoins";
    localStorage.setItem(storageKey, JSON.stringify(updatedCoins));
  };

  return (
    <div className="finder-page">
      <header className="finder-header">
        <h1 className="finder-title">MemeCoin Finder</h1>
        <button className="add-coin-button" onClick={() => setShowForm(true)}>
          + Add Coin
        </button>
      </header>
      <p className="finder-subtitle">
        Select your preferred network and manually add top meme coins!
      </p>
      <NetworkSelector selectedNetwork={selectedNetwork} onSelect={handleNetworkSelect} />
      <Banner onAnalyze={() => setShowAnalyzeModal(true)} />
      <div className="cards-wrapper">
        {coins.map((coin) => (
          <MemeCoinCard
            key={coin.id}
            coin={coin}
            network={selectedNetwork}
            onDeleteCoin={handleDeleteCoin}
            onUpdateReactions={handleUpdateReactions}
          />
        ))}
      </div>
      {showForm && (
        <AddCoinForm
          onClose={() => setShowForm(false)}
          onAddCoin={handleAddCoin}
          selectedNetwork={selectedNetwork}
        />
      )}
      {showAnalyzeModal && <AnalyzeModal onClose={() => setShowAnalyzeModal(false)} />}
    </div>
  );
};

export default MemeCoinFinderPage;
