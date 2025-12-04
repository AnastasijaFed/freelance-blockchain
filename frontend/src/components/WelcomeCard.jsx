import React from "react";
import "./WelcomeCard.css";

const WelcomeCard = ({ connectWallet }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
     

        <h1 className="welcome-title">Welcome to Freelance App</h1>

        <p className="welcome-subtitle">
          A secure, decentralized platform for managing freelance projects with built-in
          escrow protection. Connect your MetaMask wallet to get started.
        </p>

        <button className="welcome-connect-btn" onClick={connectWallet}>
          <span class="material-symbols-outlined">wallet</span>
          Connect MetaMask Wallet
        </button>

        <div className="welcome-roles">
          <div className="role-card role-clients">
            <h3>For Clients</h3>
            <p>Post jobs, lock funds in escrow, and release payment when work is complete.</p>
          </div>

          <div className="role-card role-freelancers">
            <h3>For Freelancers</h3>
            <p>Accept jobs, deliver work, and receive secure payment upon approval.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeCard;
