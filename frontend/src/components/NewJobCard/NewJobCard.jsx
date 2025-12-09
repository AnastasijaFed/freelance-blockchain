import React, { useState } from "react";
import "./NewJobCard.css";

const NewJobCard = ({ onCreateJob }) => {
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleCreateJob = (e) => {
    e.preventDefault();
    setError("");

    if (parseFloat(paymentAmount) < 0) {
      setError("Payment amount cannot be negative.");
      return;
    }

    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Lyginame tik datas, be laiko

    if (selectedDate < today) {
      setError("The deadline cannot be in the past.");
      return;
    }

    const newJob = {
      id: Date.now(),
      title: jobTitle,
      description: jobDescription,
      freelancer: freelancerAddress,
      amountEth: paymentAmount,
      deadline: deadline,
      status: "Created",
      submission: null,
    };

    onCreateJob(newJob);

    setFreelancerAddress("");
    setJobTitle("");
    setJobDescription("");
    setPaymentAmount("");
    setDeadline("");
  };

  return (
    <div className="new-job-container">
      <div className="new-job-card">
        <h2>Create new job</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="create-job-form" onSubmit={handleCreateJob}>
          <div className="form-row">
            <div className="form-field full-width">
              <label>
                Freelancer Address <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
                required
              />
              <small className="helper-text">
                Enter the wallet address of the freelancer (e.g., 0x123...). If
                testing alone, copy your own address from the navbar.
              </small>
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
                placeholder="Describe the job requirements..."
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
                min="0"
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
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="gas-info">
            <p>
              Estimated Gas Fee: <span>0.0023 ETH</span>
            </p>
            <p>
              Total (Payment + Gas):{" "}
              <span>
                {paymentAmount
                  ? (parseFloat(paymentAmount) + 0.0023).toFixed(4)
                  : "0.0000"}{" "}
                ETH
              </span>
            </p>
          </div>

          <button type="submit" className="primary-submit-btn">
            <span className="plus-icon">＋</span>
            Create Job & Lock Funds
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewJobCard;
