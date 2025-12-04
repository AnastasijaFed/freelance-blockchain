import React from 'react';
import { useState } from "react";
import "./NewJobCard.css";

const NewJobCard = () => {
     const [freelancerAddress, setFreelancerAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
   const handleCreateJob = (e) => {
    e.preventDefault();

    const newJob = {
      id: Date.now(),
      title: jobTitle,
      description: jobDescription,
      freelancer: freelancerAddress,
      payment: paymentAmount,
      deadline: deadline,
      status: "Created",
    };



    setFreelancerAddress("");
    setJobTitle("");
    setJobDescription("");
    setPaymentAmount("");
    setDeadline("");
  };

  return (
    <div className='new-job-container'>
        <div className='new-job-card'>
            <h2>Create new job</h2>
            <form className="create-job-form" onSubmit={handleCreateJob}>
          <div className="form-row">
            <div className="form-field">
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
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
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
                placeholder="Describe the job requirements and deliverables..."
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
                type="text"
                placeholder="dd/mm/yyyy"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
        </div>
        {/* CIA KOL KAS HARDCODINAM SITA VIETA, VELIAU ISSIAISKINSIM */}
        <div className="gas-info">
            <p>Estimated Gas Fee: <span>0.0023 ETH</span></p>
            <p>Total (Payment + Gas): <span>0.0023 ETH</span></p>
          </div>

          <button type="submit" className="primary-submit-btn">
            <span className="plus-icon">＋</span>
            Create Job &amp; Lock Funds
          </button>
        </form>

        </div>

    </div>
  )
}

export default NewJobCard