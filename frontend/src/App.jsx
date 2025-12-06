import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import NewJobCard from "./components/NewJobCard/NewJobCard";
import { N } from "ethers";
import "./App.css";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";

function App() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState("client");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };
  const disconnectWallet = () => {
    setAccount(null);
    console.log("Disconnected");
  };

  return (
    <>
      <Navbar
        account={account}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />

      {!account ? (
        <WelcomeCard connectWallet={connectWallet} />
      ) : (
        <div className="app-content">
          <div className="role-toggle-wrapper">
            <div className="role-toggle">
              <button
                className={`role-btn ${
                  role === "client" ? "active" : "inactive"
                }`}
                onClick={() => setRole("client")}
              >
                Client
              </button>
              <button
                className={`role-btn ${
                  role === "freelancer" ? "active" : "inactive"
                }`}
                onClick={() => setRole("freelancer")}
              >
                Freelancer
              </button>
            </div>
          </div>
          {role === "client" ? (
            <ClientDashboard />
          ) : (
            <div style={{ padding: "2rem 4rem" }}>
              <h2>cia freelanceris ka mato</h2>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
