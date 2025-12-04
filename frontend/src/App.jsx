import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      console.log("Connected:", accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar connectWallet={connectWallet} account={account} />
      
    </div>
  );
}

export default App;
