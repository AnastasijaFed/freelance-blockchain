import React from "react";
import "./Jobs.css";
import NewJobCard from "../NewJobCard/NewJobCard";
import JobCard from "./JobCard";


const JobList = ({ jobs, onViewDetails, onApprove, onDispute }) => {
  return (
    <div className="jobs-section">
      <div className="jobs-header">
        <div className="jobs-title">
          <h2>My Posted Jobs</h2>
          <span className="jobs-count">{jobs.length}</span>
        </div>
        <div className="jobs-filter">
          <button className="filter-btn">All Status ▾</button>
        </div>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onDispute={onDispute}
          />
        ))}
      </div>
    </div>
  );
};

export default JobList;