import React from "react";
import "./FreelancerDashboard.css";
import JobList from "../Jobs/JobList";
import DisputeCommentModal from "../Dispute Job Modal/DisputeCommentModal";
import { useState } from "react";

const FreelancerDashboard = ({
  jobs,
  account,
  onAcceptJob,
  onSubmitWork,
  onCancelJob,
}) => {
  if (!jobs) return null;
  const [disputeJob, setDisputeJob] = useState(null);

  const openDisputeComment = (job) => {
    setDisputeJob(job);
    console.log('Dispute Job State Set:', job.id);
  };

  const closeDisputeComment = () => {
    setDisputeJob(null);
  };

  const availableJobs = jobs.filter(
    (job) =>
      job.status === "Created" &&
      (!job.client ||
        (account && job.client.toLowerCase() !== account.toLowerCase()))
  );

  const myActiveJobs = jobs.filter(
    (job) =>
      (job.status === "Accepted" || job.status === "Submitted"|| job.status === "Disputed") &&
      job.freelancer &&
      account &&
      job.freelancer.toLowerCase() === account.toLowerCase()
  );

  const myFinishedJobs = jobs.filter(
    (job) =>
      (job.status === "Approved" || job.status === "Cancelled") &&
      job.freelancer &&
      account &&
      job.freelancer.toLowerCase() === account.toLowerCase()
  );

  return (
    <div className="freelancer-dashboard">
      <div className="freelancer-section">
        <JobList
          customTitle="Available Jobs"
          jobs={availableJobs}
          role="freelancer"
          onAcceptJob={onAcceptJob}
      
        />
        {availableJobs.length === 0 && (
          <div className="no-jobs-message">No new jobs available.</div>
        )}
      </div>

      <div className="freelancer-section">
        <JobList
          customTitle="My Active Projects"
          jobs={myActiveJobs}
          role="freelancer"
          onSubmitWork={onSubmitWork}
          onCancelJob={onCancelJob}
          onViewDisputeComment={openDisputeComment}
        />
        {myActiveJobs.length === 0 && (
          <div className="no-jobs-message">You have no active projects.</div>
        )}
      </div>

      {myFinishedJobs.length > 0 && (
        <div className="freelancer-section finished-section">
          <JobList
            customTitle="Finished Jobs"
            jobs={myFinishedJobs}
            role="freelancer"
          />
        </div>
      )}
      {disputeJob && (
        <DisputeCommentModal job={disputeJob} onClose={closeDisputeComment} />
      )}
    </div>
  );
};

export default FreelancerDashboard;
