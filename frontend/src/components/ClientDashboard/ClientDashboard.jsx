import React, { useState } from "react";
import "./ClientDashboard.css";
import NewJobCard from "../NewJobCard/NewJobCard";
import JobList from "../Jobs/JobList";
import JobDetailsModal from "../Jobs/JobDetailsModal";

const ClientDashboard = ({
  jobs,
  account,
  onCreateJob,
  onApprove,
  onDispute,
}) => {
  const [selectedJob, setSelectedJob] = useState(null);

  const myCreatedJobs = jobs.filter(
    (job) =>
      job.client &&
      account &&
      job.client.toLowerCase() === account.toLowerCase()
  );

  const activeJobs = myCreatedJobs.filter(
    (job) =>
      job.status === "Created" ||
      job.status === "Accepted" ||
      job.status === "Submitted"
  );

  const finishedJobs = myCreatedJobs.filter(
    (job) => job.status === "Approved" || job.status === "Disputed"
  );

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="client-dashboard">
      <NewJobCard onCreateJob={onCreateJob} account={account} />

      {activeJobs.length > 0 && (
        <JobList
          customTitle="My Posted Jobs (Active)"
          jobs={activeJobs}
          role="client"
          onViewDetails={handleViewDetails}
          onApprove={onApprove}
          onDispute={onDispute}
        />
      )}

      {finishedJobs.length > 0 && (
        <div
          style={{
            marginTop: "4rem",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "2rem",
          }}
        >
          <JobList
            customTitle="Finished Jobs"
            jobs={finishedJobs}
            role="client"
            onViewDetails={handleViewDetails}
            onApprove={onApprove}
            onDispute={onDispute}
          />
        </div>
      )}

      {activeJobs.length === 0 && finishedJobs.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          You haven't posted any jobs yet.
        </div>
      )}

      <JobDetailsModal
        job={selectedJob}
        onClose={handleCloseModal}
        onApprove={onApprove}
        onDispute={onDispute}
      />
    </div>
  );
};

export default ClientDashboard;
