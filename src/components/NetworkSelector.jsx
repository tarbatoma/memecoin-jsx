// src/components/NetworkSelector.jsx
import React from "react";

const NetworkSelector = ({ selectedNetwork, onSelect }) => {
  return (
    <div className="network-selector-container">
      <h1 className="network-title">
        <div className="switch-wrapper">
          <div className="labels">
            <span onClick={() => onSelect("solana")} className={`label ${selectedNetwork === "solana" ? "active" : ""}`}>
              SOLANA
            </span>
            <span className="slash">/</span>
            <span onClick={() => onSelect("sui")} className={`label ${selectedNetwork === "sui" ? "active" : ""}`}>
              SUI
            </span>
          </div>
          <div className="blob" style={{ transform: selectedNetwork === "solana" ? "translateX(0)" : "translateX(100%)" }}></div>
        </div>
      </h1>
    </div>
  );
};

export default NetworkSelector;
