import React from "react";
import "./FreelancerDashboard.css";
import JobList from "../Jobs/JobList";

const FreelancerDashboard = ({ jobs, account, onAcceptJob, onSubmitWork }) => {
  // Laisvi darbai (tikriname ar job.status yra "Created")
  const availableJobs = jobs.filter((job) => job.status === "Created");

  // Rodome darbus, kurie yra priimti/priduoti/patvirtinti
  // IR kurių freelancer adresas sutampa su prisijungusiu account
  const myActiveJobs = jobs.filter(
    (job) =>
      (job.status === "Accepted" ||
        job.status === "Submitted" ||
        job.status === "Approved") &&
      job.freelancer &&
      account &&
      job.freelancer.toLowerCase() === account.toLowerCase()
  );

  return (
    <div className="freelancer-dashboard">
      {/* Pirma sekcija: Laisvi darbai */}
      <div className="freelancer-section">
        <h2>Available Jobs (Marketplace)</h2>
        {availableJobs.length === 0 ? (
          <div className="no-jobs-message">
            No new jobs available at the moment.
          </div>
        ) : (
          <JobList
            jobs={availableJobs}
            role="freelancer"
            onAcceptJob={onAcceptJob}
          />
        )}
      </div>

      {/* Antra sekcija: Mano aktyvūs darbai */}
      <div className="freelancer-section">
        <h2>My Active Projects</h2>
        {myActiveJobs.length === 0 ? (
          <div className="no-jobs-message">
            You haven't accepted any jobs yet.
          </div>
        ) : (
          <JobList
            jobs={myActiveJobs}
            role="freelancer"
            onSubmitWork={onSubmitWork}
          />
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
