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
  onCancelJob,
  onViewDisputeComment,
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

      <div className="job-meta-row">
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

      <div className="view-details-row">
        {role === "freelancer" && status === "Disputed" && job.disputeComment && (
            <button 
                className="link-btn dispute-link" 
                onClick={() => onViewDisputeComment && onViewDisputeComment(job)}
            >
                See Dispute Comment
            </button>
        )}
        {onViewDetails && (
          <button className="link-btn" onClick={() => onViewDetails(job)}>
            View Details
          </button>
        )}
      </div>

      <div className="job-card-footer">
        <div className="action-buttons">
          {role === "client" && status === "Submitted" && (
            <div className="btn-group">
              <button className="approve-btn" onClick={() => onApprove(id)}>
                Approve & Pay
              </button>
              <button className="dispute-btn" onClick={() => onViewDetails(job)}>
                Dispute (Fix)
              </button>
            </div>
          )}
          {role === "client" && status === "Disputed" && (
            <div className="disputed-badge" onClick={() => onViewDetails(job)}>
              Disputed. Awaiting Freelancer Revision. (View Details)
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

          {(role === "freelancer" && status === "Accepted") || (role === "freelancer" && status === "Disputed") ? (
            <div className="submit-group">
              {status === "Disputed" && (
                  <p className="dispute-warning"> Revision Requested. Resubmit work below.</p>
              )}
              <input
                type="text"
                placeholder="Paste link..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />
              <button
                className="approve-btn green-btn"
                disabled={!linkInput}
                onClick={() => onSubmitWork(id, linkInput)}
              >
                {status === "Disputed" ? "Resubmit Work" : "Submit Work"}
              </button>

              <button className="cancel-btn" onClick={() => onCancelJob(id)}>
                Cancel Job
              </button>
            </div>
          ) : null}

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
