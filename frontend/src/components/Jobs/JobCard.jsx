import React from "react";
import "./Jobs.css";

const JobCard = ({
  job,
  role,
  onViewDetails,
  onApprove,
  onDispute,
  onAcceptJob,
  onSubmitWork,
}) => {
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
          {/* Jei freelanceris dar nepriskirtas, rodom brūkšnelį */}
          <span className="meta-value">
            {freelancer
              ? `${freelancer.slice(0, 6)}...${freelancer.slice(-4)}`
              : "—"}
          </span>
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
        {}
        {onViewDetails && (
          <button className="link-btn" onClick={() => onViewDetails(job)}>
            View Details
          </button>
        )}

        <div className="action-buttons">
          {/* Klientas */}
          {role !== "freelancer" && status === "Submitted" && (
            <>
              <button className="approve-btn" onClick={() => onApprove(id)}>
                Approve
              </button>
              <button className="dispute-btn" onClick={() => onDispute(id)}>
                Dispute
              </button>
            </>
          )}

          {/* Freelancer'is */}

          {}
          {role === "freelancer" && status === "Created" && (
            <button
              className="approve-btn"
              style={{ background: "#4f46e5" }}
              onClick={() => onAcceptJob(id)}
            >
              Accept Job
            </button>
          )}

          {}
          {role === "freelancer" && status === "Accepted" && (
            <button
              className="approve-btn"
              style={{ background: "#10b981" }}
              onClick={() => onSubmitWork(id)}
            >
              Submit Work
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
