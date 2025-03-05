// src/pages/AnalysisPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, User, Bot, ArrowLeft, Copy, Check } from "lucide-react";
import "../style/AnalysisPage.css";

const AnalysisPage = () => {
  const { contractAddress } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  useEffect(() => {
    const initialMessage = {
      id: "1",
      content: `I'm analyzing the token at address ${contractAddress}. Here's what I found:
1. Token Name: Example Token (EXT)
2. Total Supply: 1,000,000,000
3. Current Price: $0.0023
4. Market Cap: $2,300,000
5. Holders: 1,245

The token appears to be a utility token for a DeFi platform. The contract code shows no obvious red flags or security issues. The liquidity is currently locked for 6 months.

What specific information would you like to know about this token?`,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setCurrentTypingIndex(0);
  }, [contractAddress]);

  useEffect(() => {
    if (
      currentTypingIndex >= 0 &&
      currentTypingIndex < messages.length &&
      messages[currentTypingIndex].sender === "bot"
    ) {
      setIsTyping(true);
      const fullText = messages[currentTypingIndex].content;
      let i = 0;
      setDisplayedText("");
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setCurrentTypingIndex(-1);
        }
      }, 10);
      return () => clearInterval(typingInterval);
    }
  }, [currentTypingIndex, messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setTimeout(() => {
      const botResponses = {
        tokenomics:
          "The tokenomics of this project include:\n\n- 40% for public sale\n- 20% for team (vested over 2 years)\n- 15% for marketing\n- 15% for development\n- 10% for liquidity\n\nThe team tokens are locked with a 6-month cliff and then vested over 24 months.",
        team:
          "The team behind this project consists of:\n\n- CEO: John Smith (ex-Google)\n- CTO: Jane Doe (ex-Coinbase)\n- Head of Marketing: Mike Johnson (ex-Binance)\n\nThe team has a combined experience of over 15 years in blockchain development.",
        roadmap:
          "The roadmap for this project is:\n\nQ2 2025: Launch of main platform\nQ3 2025: Integration with major DEXes\nQ4 2025: Mobile app release\nQ1 2026: Cross-chain functionality",
        security:
          "The contract has been audited by CertiK with no critical issues found. There is a timelock of 48 hours for admin functions, and the ownership is transferred to a multi-sig wallet requiring 3/5 signatures for any major changes.",
      };
      let responseContent =
        "Based on my analysis, this token has a moderate risk profile. The contract implements standard ERC-20 functionality with no custom modifications that could introduce vulnerabilities. The team appears to be legitimate with a clear roadmap and use case. However, as with all crypto investments, you should conduct your own research before investing.";
      const lowercaseInput = input.toLowerCase();
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (lowercaseInput.includes(keyword)) {
          responseContent = response;
          break;
        }
      }
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      setCurrentTypingIndex(messages.length + 1);
    }, 1500);
  };

  const copyToClipboard = () => {
    const textToCopy = messages.map((msg) => `${msg.sender === "user" ? "You" : "Bot"}: ${msg.content}`).join("\n\n");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="analysis-container">
      <header className="analysis-header">
        <div className="header-left">
          <Link to="/" className="back-button">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="header-title">
            Token Analysis: {contractAddress?.substring(0, 8)}...{contractAddress?.substring(contractAddress.length - 6)}
          </h1>
        </div>
        <button onClick={copyToClipboard} className="copy-button">
          {isCopied ? (
            <>
              <Check size={16} className="button-icon" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} className="button-icon" />
              Copy conversation
            </>
          )}
        </button>
      </header>
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message, index) => (
            <div key={message.id} className={`message-row ${message.sender === "user" ? "user-row" : "bot-row"}`}>
              <div className={`message-box ${message.sender === "user" ? "user-message" : "bot-message"}`}>
                <div className="message-icon-container">
                  {message.sender === "user" ? (
                    <User size={24} className="user-icon" />
                  ) : (
                    <Bot size={24} className="bot-icon" />
                  )}
                </div>
                <div className="message-content">
                  {message.sender === "bot" && isTyping && currentTypingIndex === index ? (
                    <div className="message-text">{displayedText}</div>
                  ) : (
                    <div className="message-text">{message.content}</div>
                  )}
                  <div className={`message-time ${message.sender === "user" ? "user-time" : "bot-time"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-row bot-row">
              <div className="message-box bot-message loading-message">
                <div className="message-icon-container">
                  <Bot size={24} className="bot-icon" />
                </div>
                <div className="loading-spinner"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this token..."
              className="input-field"
              disabled={isLoading || isTyping}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || isTyping}
              className={`send-button ${isLoading || !input.trim() || isTyping ? "disabled-button" : ""}`}
            >
              <Send size={20} color="#fff" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnalysisPage;
