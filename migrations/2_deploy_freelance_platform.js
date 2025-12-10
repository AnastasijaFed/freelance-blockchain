const FreelancePlatform = artifacts.require("FreelancePlatform");

module.exports = function (deployer) {
  deployer.deploy(FreelancePlatform);
};
