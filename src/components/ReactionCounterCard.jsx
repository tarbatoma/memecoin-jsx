// src/components/ReactionCounterCard.jsx
import React, { useState, useEffect } from "react";
import "../style/ReactionCounterCard.css";

const ReactionCounterCard = ({ coinId, rocketCount, fireCount, onUpdateReactions }) => {
  const [localRocket, setLocalRocket] = useState(rocketCount);
  const [localFire, setLocalFire] = useState(fireCount);
  const [isVerifying, setIsVerifying] = useState(false);
  const [rocketAnimating, setRocketAnimating] = useState(false);
  const [fireAnimating, setFireAnimating] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);

  useEffect(() => {
    const reacted = localStorage.getItem("reacted_" + coinId);
    if (reacted === "true") setHasReacted(true);
  }, [coinId]);

  const verifyHuman = () => new Promise((resolve) => setTimeout(() => resolve(true), 500));

  const handleRocketClick = async () => {
    if (isVerifying || hasReacted) return;
    setIsVerifying(true);
    const isHuman = await verifyHuman();
    if (isHuman) {
      setRocketAnimating(true);
      setTimeout(() => setRocketAnimating(false), 1000);
      const newCount = localRocket + 1;
      setLocalRocket(newCount);
      setHasReacted(true);
      localStorage.setItem("reacted_" + coinId, "true");
      onUpdateReactions(coinId, { rocketCount: newCount, fireCount: localFire });
    }
    setIsVerifying(false);
  };

  const handleFireClick = async () => {
    if (isVerifying || hasReacted) return;
    setIsVerifying(true);
    const isHuman = await verifyHuman();
    if (isHuman) {
      setFireAnimating(true);
      setTimeout(() => setFireAnimating(false), 1500);
      const newCount = localFire + 1;
      setLocalFire(newCount);
      setHasReacted(true);
      localStorage.setItem("reacted_" + coinId, "true");
      onUpdateReactions(coinId, { rocketCount: localRocket, fireCount: newCount });
    }
    setIsVerifying(false);
  };

  return (
    <div className="reaction-container">
      <div className="reaction">
        <button
          className="emoji-button"
          style={{ animation: rocketAnimating ? "rocketBlast 1s ease" : "none", cursor: hasReacted ? "not-allowed" : "pointer" }}
          onClick={handleRocketClick}
          title="Rocket"
          disabled={hasReacted}
        >
          🚀
        </button>
        <span className="reaction-count">{localRocket}</span>
      </div>
      <div className="reaction">
        <button
          className="emoji-button"
          style={{ animation: fireAnimating ? "fireFlicker 1.5s ease" : "none", cursor: hasReacted ? "not-allowed" : "pointer" }}
          onClick={handleFireClick}
          title="Fire"
          disabled={hasReacted}
        >
          🔥
        </button>
        <span className="reaction-count">{localFire}</span>
      </div>
    </div>
  );
};

export default ReactionCounterCard;
