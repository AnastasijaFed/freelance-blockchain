import React from "react";
import "./Jobs.css";
import JobCard from "./JobCard";

const JobList = ({
  jobs,
  role,
  onViewDetails,
  onApprove,
  onDispute,
  onAcceptJob,
  onSubmitWork,
  onCancelJob,
  customTitle,
}) => {
  const getTitle = () => {
    if (customTitle) return customTitle;
    return role === "freelancer" ? "Jobs" : "My Posted Jobs";
  };

  return (
    <div className="jobs-section">
      <div className="jobs-header">
        <div className="jobs-title">
          <h2>{getTitle()}</h2>
          <span className="jobs-count">{jobs.length}</span>
        </div>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            role={role}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onDispute={onDispute}
            onAcceptJob={onAcceptJob}
            onSubmitWork={onSubmitWork}
            onCancelJob={onCancelJob}
          />
        ))}
      </div>
    </div>
  );
};

export default JobList;
