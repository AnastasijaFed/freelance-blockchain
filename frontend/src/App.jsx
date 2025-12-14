import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import NewJobCard from "./components/NewJobCard/NewJobCard";
import {
  BrowserProvider,
  Contract,
  parseEther,
  formatEther,
  ZeroAddress
} from "ethers";

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
    case 5: 
      return "Disputed";
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
    disputeComment
  } = onchainJob;

  let formattedDeadline = "N/A";
  if (deadline && Number(deadline) > 0) {
    formattedDeadline = new Date(Number(deadline) * 1000)
      .toISOString()
      .split("T")[0];
  }


  return {
    id: Number(id),
    title,
    description,
    freelancer: freelancer === ZeroAddress ? "" : freelancer,
    amountEth: formatEther(amount),
    deadline: formattedDeadline, 
    status: mapStatus(status),
    submission: workUri || null,
    client,
    disputeComment: disputeComment || null,
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
  const getDeployedAddressFromArtifact = async (provider) => {
  const networks = FreelancePlatformArtifact.networks || {};
  const entries = Object.entries(networks);

  console.log("Artifact networks:", networks);

  if (entries.length === 0) {
    throw new Error(
      "No deployments found in FreelancePlatformArtifact.networks. Did you run `truffle migrate`?"
    );
  }

  for (const [netId, netInfo] of entries) {
    const candidate = netInfo.address;
    if (!candidate) continue;

    const code = await provider.getCode(candidate);
    console.log(`Checking address ${candidate} for networkId ${netId}, code prefix:`, code.slice(0, 10));

    if (code && code !== "0x") {
      console.log("Found deployed contract at:", candidate, "for networkId:", netId);
      return candidate;
    }
  }

  throw new Error(
    "No contract from FreelancePlatformArtifact has code on the current RPC. " +
      "Make sure Ganache is running, you ran `truffle migrate --reset`, and copied the JSON to frontend."
  );
};


  const setupBlockchainConnection = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask to use this app.");
    return;
  }

  try {
    const _provider = new BrowserProvider(window.ethereum);
    const signer = await _provider.getSigner();

    const address = await getDeployedAddressFromArtifact(_provider);
    const _contract = new Contract(
      address,
      FreelancePlatformArtifact.abi,
      signer
    );

    const signerAddress = await signer.getAddress();
    console.log("Connected wallet:", signerAddress);
    console.log("Using contract at:", address);

    setProvider(_provider);
    setContract(_contract);
    setAccount(signerAddress);

    await syncJobsFromChain(_contract);
  } catch (err) {
    console.error("Error setting up blockchain connection:", err);
    alert(err.message || "Failed to connect to smart contract.");
  }
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
      const val = parseEther(newJob.amountEth);

      
      const dateObj = new Date(newJob.deadline);
      const deadlineTimestamp = Math.floor(dateObj.getTime() / 1000);

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
const handleDispute = async (jobId, comment) => {
    if (!contract) return;
    if (!comment) return alert("Please provide a comment for the dispute.");
    try {
      const tx = await contract.disputeJob(jobId, comment);
      await tx.wait();
      syncJobsFromChain(contract);
      alert(`Dispute opened for job ${jobId}!`);
    } catch (err) {
      console.error(err);
      alert("Transaction failed: Could not start dispute.");
    }
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
