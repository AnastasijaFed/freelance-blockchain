import React, { useState } from "react";
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
  const {
    id,
    title,
    description,
    freelancer,
    amountEth,
    deadline,
    status,
    submission,
  } = job;
  const [linkInput, setLinkInput] = useState("");

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{title}</h3>
        <span className={`job-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <p className="job-description">{description}</p>

      {(status === "Submitted" || status === "Approved") && submission && (
        <div className="submission-box">
          <strong>📎 Link:</strong>
          <a
            href={
              submission.startsWith("http")
                ? submission
                : `https://${submission}`
            }
            target="_blank"
            rel="noreferrer"
          >
            {submission}
          </a>
        </div>
      )}

      <div className="job-meta-container">
        <div className="meta-row-top">
          <div className="job-meta-item">
            <span className="meta-label">Freelancer</span>
            <span className="meta-value" title={freelancer}>
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

        <div className="meta-row-bottom">
          {onViewDetails && (
            <button className="link-btn" onClick={() => onViewDetails(job)}>
              View Details
            </button>
          )}
        </div>
      </div>

      <div className="job-card-footer">
        <div className="action-buttons">
          {role === "client" && status === "Submitted" && (
            <div className="btn-group">
              <button className="approve-btn" onClick={() => onApprove(id)}>
                Approve & Pay
              </button>
              <button className="dispute-btn" onClick={() => onDispute(id)}>
                Dispute
              </button>
            </div>
          )}

          {role === "freelancer" && status === "Created" && (
            <button
              className="approve-btn blue-btn"
              onClick={() => onAcceptJob(id)}
            >
              Accept Job
            </button>
          )}

          {role === "freelancer" && status === "Accepted" && (
            <div className="submit-group">
              <input
                type="text"
                placeholder="Paste link..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />
              <button
                className="approve-btn"
                disabled={!linkInput}
                onClick={() => onSubmitWork(id, linkInput)}
              >
                Submit
              </button>
            </div>
          )}

          {role === "freelancer" && status === "Approved" && (
            <div className="paid-badge">
              <span>💰</span> Payment Received
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
