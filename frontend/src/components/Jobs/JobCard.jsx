// src/components/Jobs/JobCard.jsx
import React from "react";
import "./Jobs.css";

const JobCard = ({ job, onViewDetails, onApprove, onDispute }) => {
  const { id, title, description, freelancer, amountEth, deadline, status } =
    job;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{title}</h3>
        <span className={`job-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <p className="job-description">{description}</p>

      <div className="job-meta">
        <div className="job-meta-item">
          <span className="meta-label">Freelancer</span>
          <span className="meta-value">{freelancer}</span>
        </div>
        <div className="job-meta-item">
          <span className="meta-label">Payment</span>
          <span className="meta-value">{amountEth} ETH</span>
        </div>
        <div className="job-meta-item">
          <span className="meta-label">Deadline</span>
          <span className="meta-value">{deadline}</span>
        </div>
      </div>

      <div className="job-card-footer">
        <button className="link-btn" onClick={() => onViewDetails(job)}>
          View Details
        </button>

        <div className="action-buttons">
          {status === "Submitted" && (
            <>
              <button
                className="approve-btn"
                onClick={() => onApprove(id)}
              >
                Approve
              </button>
              <button
                className="dispute-btn"
                onClick={() => onDispute(id)}
              >
                Dispute
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
