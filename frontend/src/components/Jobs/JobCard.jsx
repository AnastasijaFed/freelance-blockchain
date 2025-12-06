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

  // Saugome įvedamą nuorodą/failo pavadinimą lokaliai
  const [submissionLink, setSubmissionLink] = useState("");

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{title}</h3>
        <span className={`job-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <p className="job-description">{description}</p>

      {/* Jei darbas priduotas, rodome nuorodą */}
      {submission && (
        <div
          style={{
            background: "#f0fdf4",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          <strong>📎 Submission:</strong>{" "}
          <a href="#" style={{ color: "#16a34a" }}>
            {submission}
          </a>
        </div>
      )}

      <div className="job-meta">
        <div className="job-meta-item">
          <span className="meta-label">Freelancer</span>
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
        {onViewDetails && (
          <button className="link-btn" onClick={() => onViewDetails(job)}>
            View Details
          </button>
        )}

        <div
          className="action-buttons"
          style={{ flexDirection: "column", alignItems: "flex-end" }}
        >
          {/* --- KLIENTO VEIKSMAI --- */}
          {role !== "freelancer" && status === "Submitted" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="approve-btn" onClick={() => onApprove(id)}>
                Approve & Pay
              </button>
              <button className="dispute-btn" onClick={() => onDispute(id)}>
                Dispute
              </button>
            </div>
          )}

          {/* --- FREELANCERIO VEIKSMAI --- */}

          {/* 1. Laisvas darbas -> Priimti */}
          {role === "freelancer" && status === "Created" && (
            <button
              className="approve-btn"
              style={{ background: "#4f46e5" }}
              onClick={() => onAcceptJob(id)}
            >
              Accept Job
            </button>
          )}

          {/* 2. Priimtas darbas -> Įkelti failą ir Priduoti */}
          {role === "freelancer" && status === "Accepted" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "100%",
              }}
            >
              <input
                type="text"
                placeholder="Paste link to work (GitHub/Drive)..."
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <button
                className="approve-btn"
                style={{
                  background: "#10b981",
                  width: "100%",
                  opacity: submissionLink ? 1 : 0.5,
                }}
                disabled={!submissionLink}
                onClick={() => onSubmitWork(id, submissionLink)}
              >
                Submit Work
              </button>
            </div>
          )}

          {/* 3. Apmokėta -> Rodyti patvirtinimą */}
          {status === "Approved" && (
            <div
              style={{
                color: "#16a34a",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ fontSize: "18px" }}>💰</span> Payment Received
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
