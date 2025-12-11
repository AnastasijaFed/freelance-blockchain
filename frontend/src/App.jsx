import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import NewJobCard from "./components/NewJobCard/NewJobCard";
import { ethers } from "ethers";
import "./App.css";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";
import FreelancerDashboard from "./components/FreelancerDashboard/FreelancerDashboard";
import FreelancePlatformArtifact from "../contracts/FreelancePlatform.json";

const mapStatus = (statusNumber) => {
  const s = Number(statusNumber);
  switch (s) {
    case 0:
      return "Created";
    case 1:
      return "Accepted";
    case 2:
      return "Submitted";
    case 3:
      return "Approved";
    case 4:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const jobFromOnchain = (onchainJob) => {
  const {
    id,
    client,
    freelancer,
    amount,
    status,
    title,
    description,
    deadline,
    workUri,
  } = onchainJob;

  // --- PRIDĖTA: Konvertuojame sekundes į datą ---
  let formattedDeadline = "N/A";
  if (deadline && Number(deadline) > 0) {
    formattedDeadline = new Date(Number(deadline) * 1000)
      .toISOString()
      .split("T")[0];
  }
  // ----------------------------------------------

  return {
    id: Number(id),
    title,
    description,
    freelancer: freelancer === ethers.ZeroAddress ? "" : freelancer,
    amountEth: ethers.formatEther(amount),
    deadline: formattedDeadline, // Dabar šis kintamasis jau egzistuoja
    status: mapStatus(status),
    submission: workUri || null,
    client,
  };
};

function App() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState("client");
  const [jobs, setJobs] = useState([]);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const syncJobsFromChain = async (_contract) => {
    try {
      const nextId = await _contract.nextJobId();
      const total = Number(nextId);
      const fetched = [];
      for (let i = 0; i < total; i++) {
        const j = await _contract.getJob(i);
        fetched.push(jobFromOnchain(j));
      }
      setJobs(fetched.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const setupBlockchainConnection = async (acc) => {
    if (!window.ethereum) return;

    const _provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await _provider.getSigner();

    // Svarbu: įsitikinkite, kad FreelancePlatform.json yra atnaujintas po 'truffle migrate'
    const networks = FreelancePlatformArtifact.networks;
    const networkId = Object.keys(networks)[0];

    if (!networkId) {
      alert("Contract not deployed to current network");
      return;
    }

    const address = networks[networkId].address;
    const _contract = new ethers.Contract(
      address,
      FreelancePlatformArtifact.abi,
      signer
    );

    setProvider(_provider);
    setContract(_contract);
    setAccount(acc);
    await syncJobsFromChain(_contract);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setupBlockchainConnection(accounts[0]);
        }
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) setupBlockchainConnection(accounts[0]);
          else setAccount(null);
        });
        window.ethereum.on("chainChanged", () => window.location.reload());
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setupBlockchainConnection(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => setAccount(null);

  const handleCreateJob = async (newJob) => {
    if (!contract) return;
    try {
      const val = ethers.parseEther(newJob.amountEth);

      // Konvertuojame datą į timestamp
      const dateObj = new Date(newJob.deadline);
      const deadlineTimestamp = Math.floor(dateObj.getTime() / 1000);

      // Siunčiame su nauju argumentu (deadlineTimestamp)
      const tx = await contract.createJob(
        newJob.title,
        newJob.description,
        deadlineTimestamp,
        { value: val }
      );

      await tx.wait();
      syncJobsFromChain(contract);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  const handleAcceptJob = async (jobId) => {
    if (!contract) return;
    try {
      const tx = await contract.acceptJob(jobId);
      await tx.wait();
      syncJobsFromChain(contract);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  const handleSubmitWork = async (jobId, link) => {
    if (!contract) return;
    try {
      const tx = await contract.submitWork(jobId, link);
      await tx.wait();
      syncJobsFromChain(contract);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  const handleApprove = async (jobId) => {
    if (!contract) return;
    try {
      const tx = await contract.markCompleted(jobId);
      await tx.wait();
      syncJobsFromChain(contract);
      alert("Funds released!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  const handleDispute = async (jobId) => {
    alert("Dispute logic pending in contract");
  };

  const handleCancelJob = async (jobId) => {
    alert("Cancel logic pending in contract");
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
            <ClientDashboard
              jobs={jobs}
              account={account}
              onCreateJob={handleCreateJob}
              onApprove={handleApprove}
              onDispute={handleDispute}
            />
          ) : (
            <FreelancerDashboard
              jobs={jobs}
              account={account}
              onAcceptJob={handleAcceptJob}
              onSubmitWork={handleSubmitWork}
              onCancelJob={handleCancelJob}
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;
