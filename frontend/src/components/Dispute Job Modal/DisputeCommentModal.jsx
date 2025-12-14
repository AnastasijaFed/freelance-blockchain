import React from "react";
import "./DisputeCommentModal.css"; // We'll create this CSS file

const DisputeCommentModal = ({ job, onClose }) => {
  if (!job || !job.disputeComment) return null;

  return (
    <div className="dispute-modal-backdrop">
      <div className="dispute-modal-content">
        <div className="dispute-modal-header">
          <h2>Dispute Details for Job #{job.id}</h2>
          <button className="dispute-modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="dispute-modal-body">
          <p className="dispute-modal-warning">
            The client has requested revisions on the submitted work. Please address the following feedback and resubmit.
          </p>
          <div className="dispute-comment-display">
            <h3>Client's Feedback:</h3>
            <p>{job.disputeComment}</p>
          </div>
          
          <p className="dispute-modal-note">
            The job remains in your active projects list until resubmission.
          </p>
        </div>

        <div className="dispute-modal-footer">
            <button className="dispute-modal-close-btn primary" onClick={onClose}>
                Start Revision
            </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeCommentModal;