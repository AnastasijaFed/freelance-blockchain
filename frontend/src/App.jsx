import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import NewJobCard from "./components/NewJobCard/NewJobCard";
import { ethers } from "ethers";
import "./App.css";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";
import FreelancerDashboard from "./components/FreelancerDashboard/FreelancerDashboard";
import FreelancePlatformArtifact from "./contracts/FreelancePlatform.json";


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
    workUri,
  } = onchainJob;

  return {
    id: Number(id),
    title,
    description,
    freelancer,
    amountEth: ethers.utils.formatEther(amount),
    deadline: "", 
    status: mapStatus(status),
    submission: workUri || null,
    client,
  };
};
function App() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState("client");
    const [jobs, setJobs] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            await setupBlockchainConnection(accounts[0]);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setContract(null);
          setProvider(null);
          setJobs([]);
        } else {
          await setupBlockchainConnection(accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);
  

    const syncJobsFromChain = async (_contract = contract) => {
    if (!_contract) return;

    try {
      const nextId = await _contract.nextJobId();
      const total = Number(nextId);

      const fetched = [];
      for (let i = 0; i < total; i++) {
        try {
          const j = await _contract.getJob(i);
          fetched.push(jobFromOnchain(j));
        } catch (e) {
          console.warn("Failed to load job", i, e);
        }
      }

      fetched.sort((a, b) => b.id - a.id); // newest first
      setJobs(fetched);
    } catch (err) {
      console.error("Failed to sync jobs", err);
    }
  };

  const setupBlockchainConnection = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask to use this app.");
    return;
  }

  const _provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = _provider.getSigner();

  // --- NEW: read address directly from artifact ---
  const networks = FreelancePlatformArtifact.networks || {};
  const networkIds = Object.keys(networks);

  console.log("Artifact networks:", networks);
  console.log("Artifact network ids:", networkIds);

  if (networkIds.length === 0) {
    console.error("No deployments found in FreelancePlatformArtifact.networks");
    alert(
      "Smart contract has not been deployed yet. Run `truffle migrate` and copy the JSON."
    );
    return;
  }

  // Just take the first network (for dev: that's Ganache)
  const firstNetworkId = networkIds[0];
  const address = networks[firstNetworkId].address;

  console.log("Using contract address from artifact:", address, "networkId:", firstNetworkId);

  // Double-check that there is code at this address on the currently selected RPC
  const code = await _provider.getCode(address);
  if (code === "0x") {
    console.error("No contract code at address", address);
    alert(
      "No smart contract found at the expected address on this RPC. Make sure Ganache is running and you migrated to this Ganache instance."
    );
    return;
  }

  const _contract = new ethers.Contract(
    address,
    FreelancePlatformArtifact.abi,
    signer
  );

  const signerAddress = await signer.getAddress();
  console.log("🔗 Connected wallet:", signerAddress);
  console.log("🔗 Using contract at:", address);

  setProvider(_provider);
  setContract(_contract);
  setAccount(signerAddress);

  await syncJobsFromChain(_contract);
};


  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
      if (accounts.length > 0) setAccount(accounts[0]);
      window.ethereum.on("accountsChanged", (newAccounts) => {
            if (newAccounts.length > 0) {
              setAccount(newAccounts[0]);
            } else {
              setAccount(null); 
            }
          });

    await setupBlockchainConnection(accounts[0]);  
  } catch (err) {
    console.error(err);
  }
  };

  const disconnectWallet = () => setAccount(null);
const handleCreateJob = async (newJob) => {
    if (!contract || !account) {
      alert("Connect wallet first");
      return;
    }
    console.log("Job Data:", newJob);
    console.log("Amount to send (ETH):", newJob.amountEth);
    try {
      const value = ethers.utils.parseEther(newJob.amountEth);

      const tx = await contract.createJob(newJob.title, newJob.description, {
        value,
      });
      await tx.wait();
      const nextId = await contract.nextJobId();
      const newId = Number(nextId) - 1;
      const onchainJob = await contract.getJob(newId);
      const job = jobFromOnchain(onchainJob);

      setJobs((prev) => [job, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Error creating job, see console");
    }
  };

  const handleAcceptJob = async (jobId) => {
    if (!contract || !account) {
      alert("Connect wallet first");
      return;
    }
    try {
      const tx = await contract.acceptJob(jobId);
      await tx.wait();
      const onchainJob = await contract.getJob(jobId);
      const updatedJob = jobFromOnchain(onchainJob);

      setJobs((prev) => prev.map((j) => (j.id === jobId ? updatedJob : j)));
    } catch (err) {
      console.error(err);
      alert("Error accepting job, see console");
    }
  };

  const handleCancelJob = async (jobId) => {
    if (!contract || !account) {
      alert("Connect wallet first");
      return;
    }
    try {
      const tx = await contract.markCompleted(jobId);
      await tx.wait();

      const onchainJob = await contract.getJob(jobId);
      const updatedJob = jobFromOnchain(onchainJob);

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? updatedJob : j))
      );
      alert("Funds released to Freelancer!(on-chain)");
    } catch (err) {
      console.error(err);
      alert("Error approving job, see console");
    }
  };

  const handleSubmitWork = async (jobId, submissionLink) => {
    if (!contract || !account) {
      alert("Connect wallet first");
      return;
    }
    try {
      const tx = await contract.submitWork(jobId, submissionLink);
      await tx.wait();

      const onchainJob = await contract.getJob(jobId);
      const updatedJob = jobFromOnchain(onchainJob);

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? updatedJob : j))
      );
    } catch (err) {
      console.error(err);
      alert("Error submitting work, see console");
    }
  };

  const handleApprove =async(jobId) => {
   if (!contract || !account) {
      alert("Connect wallet first");
      return;
    }
    try {
      const tx = await contract.markCompleted(jobId);
      await tx.wait();

      const onchainJob = await contract.getJob(jobId);
      const updatedJob = jobFromOnchain(onchainJob);

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? updatedJob : j))
      );
      alert("Funds released to Freelancer!(on-chain)");
    } catch (err) {
      console.error(err);
      alert("Error approving job, see console");
    }
  };

  const handleDispute = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "Accepted" } : job
      )
    );
    alert("Job returned to freelancer for updates/fixes.");
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
