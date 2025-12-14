import React from "react";
import { useState } from "react";
import "./JobDetailsModal.css";

const steps = ["Created", "Accepted", "Submitted", "Approved"];

const JobDetailsModal = ({ job, onClose, onApprove, onDispute }) => {
  if (!job) return null;

  const [disputeCommentInput, setDisputeCommentInput] = useState("");
  const [isDisputeMode, setIsDisputeMode] = useState(false);

  const {
    id,
    title,
    client,
    freelancer,
    amountEth,
    deadline,
    status,
    submission,
  } = {
    client: "0x742d...0bEb",
    ...job,
  };

  const currentIndex = steps.indexOf(
    status === "Disputed" ? "Submitted" : status
  );
  const confirmDispute = () => {
    if (!disputeCommentInput) return alert("Please specify what needs to be fixed.");
    onDispute(id, disputeCommentInput);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Job Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-card">
          <h3>Progress</h3>
          <div className="progress-line">
            {steps.map((step, idx) => {
              const state =
                idx < currentIndex
                  ? "done"
                  : idx === currentIndex
                  ? "current"
                  : "upcoming";
              return (
                <div className="prog-wrapper" key={step}>
                  <div className={`prog-step prog-${state}`}>
                    <div className="prog-icon">
                      {state === "done" || state === "current" ? "✔" : ""}
                    </div>
                    <span className="prog-label">{step}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`prog-connector prog-${state}`} />
                  )}
                </div>
              );
            })}
          </div>
          {status === "Disputed" && (
            <p className="disputed-note">Job Disputed. Client requested revisions.</p>
          )}
        </div>


        <div className="info-grid">
          <div className="info-box client">
            <span className="info-label">Client</span>
            <span className="info-value">{client}</span>
          </div>
          <div className="info-box freelancer">
            <span className="info-label">Freelancer</span>
            <span className="info-value">{freelancer || "Not assigned"}</span>
          </div>
          <div className="info-box amount">
            <span className="info-label">Payment Amount</span>
            <span className="info-value">{amountEth} ETH</span>
          </div>
          <div className="info-box deadline">
            <span className="info-label">Deadline</span>
            <span className="info-value">{deadline}</span>
          </div>
        </div>

       
        {submission && (
          <div
            style={{
              background: "#f0fdf4",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #bbf7d0",
              marginBottom: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <h4 style={{ margin: "0 0 5px 0", color: "#166534" }}>
              Submission from Freelancer:
            </h4>
            <a
              href={submission}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#16a34a",
                textDecoration: "underline",
                wordBreak: "break-all",
              }}
            >
              {submission}
            </a>
          </div>
        )}

    
        <div className="status-message">
          {status === "Submitted"
            ? "The freelancer has submitted their work. Please review the submission above and Approve or Dispute."
            : status === "Approved"
            ? "This job has been approved and funds have been released."
            : status === "Disputed"
            ? "A dispute has been opened for this job."
            : `Current status: ${status}.`}
        </div>

        {status === "Submitted" && isDisputeMode && (
          <div className="dispute-input-area">
            <textarea
              placeholder="What specific changes are required (e.g., 'The logo needs to be blue and centered')?"
              value={disputeCommentInput}
              onChange={(e) => setDisputeCommentInput(e.target.value)}
              rows="3"
            />
          </div>
        )}

    
        <div className="modal-footer">
          {status === "Submitted" && (
            isDisputeMode ? (
              <>
                <button 
                  className="approve-long" 
                  onClick={confirmDispute}
                  disabled={!disputeCommentInput.trim()}
                >
                  Confirm Dispute & Request Fix
                </button>
                <button className="dispute-long" onClick={() => setIsDisputeMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="approve-long" onClick={() => onApprove(id)}>
                  Approve & Release Funds
                </button>
                <button className="dispute-long" onClick={() => setIsDisputeMode(true)}>
                  Dispute
                </button>
              </>
            )
          )}
          {status === "Disputed" && (
             <div className="dispute-info-footer">
                <p>The job is Disputed. Freelancer must submit revised work.</p>
             </div>
          )}
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
