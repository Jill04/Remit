var Remit = artifacts.require("Remit.sol");
var RemitStaking = artifacts.require("RemitStaking.sol");
var RemitVaultFarmEth = artifacts.require("RemitVaultFarmEth.sol");
var Mistic =  artifacts.require("Mistic.sol");
var RemitPreSale = artifacts.require("RemitPreSale.sol");
var accounts = web3.utils.getAccounts();
module.exports = async function(deployer)
{
	 await deployer.deploy(Remit);
	 await deployer.deploy(RemitStaking,Remit.address);
	 await deployer.deploy(RemitVaultFarmEth);
	 await deployer.deploy(Mistic);
	 await deployer.deploy(RemitPreSale,Remt.address,accounts[9])
};	
