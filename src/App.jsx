// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AnalysisPage from "./pages/AnalysisPage";
import MemeCoinFinderPage from "./pages/MemeCoinFinderPage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MemeCoinFinderPage />} />
        <Route path="/wallet" element={<HomePage />} />
        <Route path="/analysis/:contractAddress" element={<AnalysisPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
