// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WalletKitProvider } from "@mysten/wallet-kit";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WalletKitProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WalletKitProvider>
  </React.StrictMode>
);
