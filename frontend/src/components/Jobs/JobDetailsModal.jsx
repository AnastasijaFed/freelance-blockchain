
import React from "react";
import "./JobDetailsModal.css";

const steps = ["Created", "Accepted", "Submitted", "Approved"];

const JobDetailsModal = ({ job, onClose, onApprove, onDispute }) => {
  if (!job) return null;

  const { id, title, client, freelancer, amountEth, deadline, status } = {
    client: "0x742d...0bEb", //KOL KAS SITOJ VIETOJ IRGI HARDCODINAM KOL NERA BACKO JOKIO
    ...job,
  };

  const currentIndex = steps.indexOf(
    status === "Disputed" ? "Submitted" : status
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Job Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Progress */}
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
        </div>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-box client">
            <span className="info-label">Client</span>
            <span className="info-value">{client}</span>
          </div>
          <div className="info-box freelancer">
            <span className="info-label">Freelancer</span>
            <span className="info-value">{freelancer}</span>
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

        <div className="status-message">
          {status === "Submitted"
            ? "The freelancer has submitted their work. Please review and approve or open a dispute."
            : status === "Approved"
            ? "This job has been approved and funds have been released."
            : status === "Disputed"
            ? "A dispute has been opened for this job."
            : `Current status: ${status}.`}
        </div>

        <div className="modal-footer">
          {status === "Submitted" && (
            <>
              <button
                className="approve-long"
                onClick={() => onApprove(id)}
              >
                Approve &amp; Release Funds
              </button>
              <button
                className="dispute-long"
                onClick={() => onDispute(id)}
              >
                Dispute
              </button>
            </>
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
