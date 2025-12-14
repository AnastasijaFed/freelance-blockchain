import React, { useState } from "react";
import "./NewJobCard.css";

const NewJobCard = ({ onCreateJob, account }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");


  const todayStr = new Date().toISOString().split("T")[0];

  const handleCreateJob = (e) => {
    e.preventDefault();
    setError("");

    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }


    if (parseFloat(paymentAmount) < 0.01) {
      setError("Payment amount must be at least 0.01 ETH.");
      return;
    }

    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("The deadline cannot be in the past.");
      return;
    }

    const newJob = {
      id: Date.now(),
      title: jobTitle,
      description: jobDescription,
      freelancer: "", 
      client: account,
      amountEth: paymentAmount,
      deadline: deadline,
      status: "Created",
      submission: null,
    };

    onCreateJob(newJob);

    setJobTitle("");
    setJobDescription("");
    setPaymentAmount("");
    setDeadline("");
  };

  return (
    <div className="new-job-container">
      <div className="new-job-card">
        <h2>Create new job</h2>

        <form className="create-job-form" onSubmit={handleCreateJob}>
          <div className="form-row">
            <div className="form-field full-width">
              <label>My Wallet Address</label>
              <input
                type="text"
                value={account || "Not Connected"}
                disabled
                style={{
                  background: "#f3f4f6",
                  color: "#6b7280",
                  cursor: "not-allowed",
                  borderColor: "#e5e7eb",
                }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label>
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Build Landing Page"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full-width">
              <label>
                Job Description <span className="required">*</span>
              </label>
              <textarea
                placeholder="Describe requirements..."
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>
                Payment Amount (ETH) <span className="required">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>
                Deadline <span className="required">*</span>
              </label>
              <input
                type="date"
                min={
                  todayStr
                } 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

        

          {error && (
            <div
              className="error-message"
              style={{ marginBottom: "0", marginTop: "10px" }}
            >
              {error}
            </div>
          )}

          <button type="submit" className="primary-submit-btn">
            <span className="plus-icon">＋</span> Create Job & Lock Funds
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewJobCard;
