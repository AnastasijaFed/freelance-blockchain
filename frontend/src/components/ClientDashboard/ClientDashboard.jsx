
import React, { useState } from "react";
import "./ClientDashboard.css";
import NewJobCard from "../NewJobCard/NewJobCard";
import JobList from "../Jobs/JobList";
import JobDetailsModal from "../Jobs/JobDetailsModal";

const initialJobs = [
  {
    id: 1,
    title: "Build Landing Page",
    description:
      "Create a modern landing page for a SaaS product with responsive design and animations.",
    freelancer: "0x8626...1199",
    amountEth: "2.5",
    deadline: "20/12/2025",
    status: "Submitted",
  },
  {
    id: 2,
    title: "Smart Contract Audit",
    description:
      "Security audit for ERC-20 token smart contract.",
    freelancer: "0x5aAe...eAed",
    amountEth: "5.0",
    deadline: "25/12/2025",
    status: "Accepted",
  },
  {
    id: 3,
    title: "Logo Design",
    description:
      "Create a professional logo for Web3 startup, including multiple variations.",
    freelancer: "0x8626...1199",
    amountEth: "1.0",
    deadline: "15/12/2025",
    status: "Created",
  },
];

const ClientDashboard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleApprove = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "Approved" } : job
      )
    );
    setSelectedJob(null);
  };

  const handleDispute = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "Disputed" } : job
      )
    );
    setSelectedJob(null);
  };

  return (
    <div className="client-dashboard">
      <NewJobCard />

      <JobList
        jobs={jobs}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onDispute={handleDispute}
      />

      <JobDetailsModal
        job={selectedJob}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onDispute={handleDispute}
      />
    </div>
  );
};

export default ClientDashboard;
