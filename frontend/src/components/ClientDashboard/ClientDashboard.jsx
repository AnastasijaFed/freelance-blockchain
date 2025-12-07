import React, { useState } from "react";
import "./ClientDashboard.css";
import NewJobCard from "../NewJobCard/NewJobCard";
import JobList from "../Jobs/JobList";
import JobDetailsModal from "../Jobs/JobDetailsModal";

const ClientDashboard = ({ jobs, onCreateJob, onApprove, onDispute }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="client-dashboard">
      <NewJobCard onCreateJob={onCreateJob} />

      <JobList
        jobs={jobs} // Dabar naudojame bendrą sąrašą iš App.jsx
        role="client" // Nurodome, kad čia žiūri klientas
        onViewDetails={handleViewDetails}
        onApprove={onApprove}
        onDispute={onDispute}
      />

      <JobDetailsModal
        job={selectedJob}
        onClose={handleCloseModal}
        onApprove={onApprove}
        onDispute={onDispute}
      />
    </div>
  );
};

export default ClientDashboard;
