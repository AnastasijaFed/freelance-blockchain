import { useState } from "react";
import Navbar from "./components/Navbar";
import WelcomeCard from "./components/WelcomeCard";

function App() {
  const [account, setAccount] = useState(null);

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
  setAccount(null);                 // clear account from state
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
        
      </div>
    )}
    </>
  );
}

export default App;
