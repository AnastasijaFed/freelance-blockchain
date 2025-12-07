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

      {/* --- 2 PUNKTAS: Nuorodos rodymas --- */}
      {/* Rodome TIK jei darbas priduotas (Submitted) arba patvirtintas (Approved) */}
      {(status === "Submitted" || status === "Approved") && submission && (
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
          <strong style={{ color: "#166534" }}>📎 Submitted Work:</strong>
          <br />
          <a
            href={
              submission.startsWith("http")
                ? submission
                : `https://${submission}`
            }
            target="_blank"
            rel="noreferrer"
            style={{ color: "#16a34a", wordBreak: "break-all" }}
          >
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
        {/* View Details mato visi */}
        {onViewDetails && (
          <button className="link-btn" onClick={() => onViewDetails(job)}>
            View Details
          </button>
        )}

        <div
          className="action-buttons"
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* --- KLIENTO MYGTUKAI --- */}
          {/* 4 PUNKTAS: Klientas mato "Pay" tik kai darbas PRIDUOTAS (Submitted) */}
          {role === "client" && status === "Submitted" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="approve-btn" onClick={() => onApprove(id)}>
                Approve & Pay
              </button>
              <button className="dispute-btn" onClick={() => onDispute(id)}>
                Dispute
              </button>
            </div>
          )}

          {/* --- FREELANCERIO MYGTUKAI --- */}

          {/* A. Jei darbas naujas -> "Accept" */}
          {role === "freelancer" && status === "Created" && (
            <button
              className="approve-btn"
              style={{ background: "#4f46e5" }}
              onClick={() => onAcceptJob(id)}
            >
              Accept Job
            </button>
          )}

          {/* B. Jei darbas priimtas -> Inputas ir "Submit" */}
          {role === "freelancer" && status === "Accepted" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              <input
                type="text"
                placeholder="Paste link (GitHub...)"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
              />
              <button
                className="approve-btn"
                style={{
                  background: "#10b981",
                  width: "100%",
                  opacity: linkInput ? 1 : 0.5,
                }}
                disabled={!linkInput}
                onClick={() => onSubmitWork(id, linkInput)}
              >
                Submit Work
              </button>
            </div>
          )}

          {/* C. 4 PUNKTAS: Jei patvirtinta -> "Payment Received" */}
          {role === "freelancer" && status === "Approved" && (
            <div
              style={{
                color: "#16a34a",
                fontWeight: "700",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "#dcfce7",
                padding: "5px 12px",
                borderRadius: "99px",
              }}
            >
              <span>💰</span> Payment Received
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
