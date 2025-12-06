import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import NewJobCard from "./components/NewJobCard/NewJobCard";
import { N } from "ethers";
import "./App.css";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";
import FreelancerDashboard from "./components/FreelancerDashboard/FreelancerDashboard";

const initialJobs = [
  {
    id: 1,
    title: "Build Landing Page",
    description: "Create a modern landing page.",
    freelancer: "",
    amountEth: "2.5",
    deadline: "20/12/2025",
    status: "Created",
    submission: null, // Čia saugosime atliktą darbą
  },
  {
    id: 2,
    title: "Smart Contract Audit",
    description: "Audit needed.",
    freelancer: "0x123...456",
    amountEth: "5.0",
    deadline: "25/12/2025",
    status: "Accepted",
    submission: null,
  },
];

function App() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState("client");
  const [jobs, setJobs] = useState(initialJobs);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) setAccount(accounts[0]);
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => setAccount(null);

  const handleCreateJob = (newJob) => {
    setJobs((prev) => [{ ...newJob, submission: null }, ...prev]);
  };

  // Klientas sumoka
  const handleApprove = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "Approved" } : job
      )
    );
    alert("Payment sent to freelancer! 💸");
  };

  const handleDispute = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "Disputed" } : job
      )
    );
  };

  // Freelancerio funkcijos
  const handleAcceptJob = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: "Accepted", freelancer: account }
          : job
      )
    );
  };

  // Čia atnaujinimas: priimame submissionLink
  const handleSubmitWork = (jobId, submissionLink) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: "Submitted", submission: submissionLink }
          : job
      )
    );
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
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;
