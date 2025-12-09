import React from "react";
import "./Navbar.css";

const Navbar = ({ account, connectWallet, disconnectWallet }) => {
  const shortAddress = account
    ? account.slice(0, 6) + "..." + account.slice(-4)
    : null;

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      alert("Address copied to clipboard!");
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>Freelance Blockchain</h1>
      </div>

      <div className="navbar-right">
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            <span className="material-symbols-outlined">wallet</span>
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-group">
            <div
              className="wallet-badge"
              title={account}
              onClick={copyAddress}
              style={{ cursor: "pointer" }}
            >
              <span className="wallet-dot"></span>
              {shortAddress}
            </div>

            <button className="disconnect-btn" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
