pragma solidity ^0.8.19;

contract FreelancePlatform {
    enum Status {
        Open,        
        InProgress,  
        Submitted,   
        Completed,   
        Cancelled,
        Disputed   
    }

    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;      
        Status status;
        string title;
        string description;
        string workUri;   
        uint256 deadline;
        string disputeComment;     
    }

    uint256 public nextJobId;
    mapping(uint256 => Job) public jobs;

    event JobCreated(
        uint256 indexed id,
        address indexed client,
        uint256 amount,
        string title
    );
    event JobAccepted(uint256 indexed id, address indexed freelancer);
    event WorkSubmitted(uint256 indexed id, string workUri);
    event JobCompleted(uint256 indexed id);
    event JobCancelled(uint256 indexed id);
    event PayoutReleased(uint256 indexed id, address indexed freelancer, uint256 amount);
    event JobDisputed(uint256 indexed id, string comment);

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Not job client");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(jobs[_jobId].freelancer != address(0), "Job not accepted yet");
        require(msg.sender == jobs[_jobId].freelancer, "Not job freelancer");
        _;
    }

    modifier inStatus(uint256 _jobId, Status _status) {
        require(jobs[_jobId].status == _status, "Invalid job status");
        _;
    }

    function createJob(
        string calldata _title,
        string calldata _description,
        uint256 _deadline
    ) external payable {
        require(msg.value > 0, "Must send payment");

        uint256 jobId = nextJobId;
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: msg.value,
            status: Status.Open,
            title: _title,
            description: _description,
            workUri: "",
            deadline: _deadline,
            disputeComment: ""
        });
        nextJobId++;

        emit JobCreated(jobId, msg.sender, msg.value, _title);
    }

    function acceptJob(uint256 _jobId)
        external
        inStatus(_jobId, Status.Open)
    {
        Job storage job = jobs[_jobId];
        require(job.client != address(0), "Job does not exist");
        require(msg.sender != job.client, "Client cannot accept own job");

        job.freelancer = msg.sender;
        job.status = Status.InProgress;

        emit JobAccepted(_jobId, msg.sender);
    }

    function submitWork(uint256 _jobId, string calldata _workUri)
        external
        onlyFreelancer(_jobId)
    {
        Job storage job = jobs[_jobId];
        require(job.status == Status.InProgress || job.status == Status.Disputed, "Invalid status for job sumbission");
        job.status = Status.Submitted;
        job.workUri = _workUri;
        job.disputeComment = "";

        emit WorkSubmitted(_jobId, _workUri);
    }


    function markCompleted(uint256 _jobId)
        external
        onlyClient(_jobId)
        inStatus(_jobId, Status.Submitted)
    {
        Job storage job = jobs[_jobId];
        job.status = Status.Completed;

        uint256 amount = job.amount;
        job.amount = 0;

        (bool sent, ) = job.freelancer.call{value: amount}("");
        require(sent, "Payout failed");

        emit JobCompleted(_jobId);
        emit PayoutReleased(_jobId, job.freelancer, amount);
    }

    

    function freelancerCancelJob(uint256 _jobId)
        external
        onlyFreelancer(_jobId)
  
    {
        Job storage job = jobs[_jobId];
        require(
            job.status == Status.InProgress || job.status == Status.Disputed,
            "Freelancer can only cancel jobs that are In Progress"
        );
        job.status = Status.Cancelled;
        uint256 amount = job.amount;
        job.amount = 0;
        (bool sent, ) = job.client.call{value: amount}("");
        require(sent, "Refund failed");
        job.freelancer = address(0);


        emit JobCancelled(_jobId);
    }
    function disputeJob(uint256 _jobId, string calldata _comment)
        external
        onlyClient(_jobId)
        inStatus(_jobId, Status.Submitted)
    {
        Job storage job = jobs[_jobId];
        job.status = Status.Disputed;
        job.disputeComment = _comment;

        emit JobDisputed(_jobId, _comment);
    }

 

    function getJob(uint256 _jobId)
        external
        view
        returns (
            uint256 id,
            address client,
            address freelancer,
            uint256 amount,
            Status status,
            string memory title,
            string memory description,
            string memory workUri,
            uint256 deadline,
            string memory disputeComment
        )
    {
        Job storage j = jobs[_jobId];
        require(j.client != address(0), "Job does not exist");
        return (
            j.id,
            j.client,
            j.freelancer,
            j.amount,
            j.status,
            j.title,
            j.description,
            j.workUri,
            j.deadline,
            j.disputeComment
        );
    }
}
