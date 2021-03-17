var Remit = artifacts.require("Remit.sol");
var RemitStaking = artifacts.require("RemitStaking.sol");
var RemitVaultFarmEth = artifacts.require("RemitVaultFarmEth.sol");
var Mistic =  artifacts.require("Mistic.sol");
module.exports = async function(deployer)
{
	 await deployer.deploy(Remit);
	 await deployer.deploy(RemitStaking,Remit.address);
	 await deployer.deploy(RemitVaultFarmEth);
	 await deployer.deploy(Mistic);
};	