const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
} = require("@openzeppelin/test-helpers");

const { assert, expect } = require("chai");
const Remit = artifacts.require("Remit");
const RemitPreSale = artifacts.require("RemitPresale");


contract("Remit PresSale", () => {
  it("Should deploy smart contract properly", async () => {
    accounts = await web3.eth.getAccounts();
    const remit = await Remit.deployed();
    const remitpresale = await RemitPreSale.deployed(remit.address,accounts[9]);

    assert(remit.address !== "");
    assert(remitpresale.address !== "");
  });

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts();
    remit = await Remit.new();
    remitpresale = await RemitPreSale.new(remit.address,accounts[9]);
    
  });

  describe("[Testcase 1: To start the presale of remit tokens]", () => {
    it("Start  PreSale", async () => {
       await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
       await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
       await remitpresale.setMaxDeposit(web3.utils.toWei("10","ether"));
       await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
       await remitpresale.setCap(web3.utils.toWei("100","ether"));

       var endtime = 1619349181;

       await remitpresale.startPresale(endtime);

       var actual = await remitpresale.startTime();
       var expected = 0;
       assert.notEqual(actual,expected);
    });
  });

  describe("[Testcase 2: To start the presale of remit tokens without setting the required parameters]", () => {
      it("Start  PreSale", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1619349181;
         try{
          await remitpresale.startPresale(endtime);
         }
         catch{
         }
         var actual = await remitpresale.startTime();
         var expected = 0;
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 3:To buy tokens before pre sale starts]", () => {
      it("Buy  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("10","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         try{
          await remitpresale.buyToken({from : accounts[7], value : web3.utils.toWei("2.46","ether")})
         }catch{

         }
         var actual = await remitpresale.claimableAmount(accounts[7]);
         var expected = 0
         assert.equal(actual,expected);
       
      });
    });

    describe("[Testcase 4:To buy tokens after pre sale starts]", () => {
      it("Buy  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("10","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1619349181;
         await remitpresale.startPresale(endtime);
         await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("1.67","ether")})
        
         var actual = await remitpresale.claimableAmount(accounts[3]);
         var expected = 0
         assert.notEqual(actual,expected);
      });
    });

  describe("[Testcase 5:To buy tokens by depositing less /more than minium/maximum amount]", () => {
      it("Buy  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.8","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("6","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1619349181;
         await remitpresale.startPresale(endtime);
         try{
          await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("0.54","ether")})
         }
         catch{
         }
         var actual = await remitpresale.claimableAmount(accounts[3]);
         var expected = 0
         assert.equal(actual,expected);

         await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("2.92","ether")})

         try{
          await remitpresale.buyToken({from : accounts[2], value : web3.utils.toWei("7.8","ether")})
         }
         catch{
         }
         var actual = await remitpresale.claimableAmount(accounts[2]);
         var expected = 0
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 6:To buy tokens when sale is paused]", () => {
      it("Buy  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.8","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("6","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.01","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1619349181;
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("3","ether")})
         await remitpresale.buyToken({from : accounts[8], value : web3.utils.toWei("2.12","ether")})
         await remitpresale.buyToken({from : accounts[2], value : web3.utils.toWei("1.23","ether")})

         await remitpresale.isPausable(true);

         try{
          await remitpresale.buyToken({from : accounts[4], value : web3.utils.toWei("2","ether")})
         }
         catch{
         }
         var actual = await remitpresale.claimableAmount(accounts[4]);
         var expected = 0
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 7:To buy tokens when it hits the cap amount]", () => {
      it("Buy  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("4","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.01","ether"));
         await remitpresale.setCap(web3.utils.toWei("12","ether"));
         var endtime = 1619349181;
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("3","ether")})
         await remitpresale.buyToken({from : accounts[8], value : web3.utils.toWei("2.12","ether")})
         await remitpresale.buyToken({from : accounts[2], value : web3.utils.toWei("3.43","ether")})
         await remitpresale.buyToken({from : accounts[4], value : web3.utils.toWei("3.45","ether")})
         try{
          await remitpresale.buyToken({from : accounts[5], value : web3.utils.toWei("1.89","ether")})
         }
         catch{
         }
         var acutal = await remitpresale.totalInvestment();
         var expected = web3.utils.toWei("12","ether");
         assert(acutal,expected);
      });
    });

    describe("[Testcase 8:To claim tokens]", () => {
      it("Claim  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("4.5","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1619349181;
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[6], value : web3.utils.toWei("2.76","ether")})
         await remitpresale.buyToken({from : accounts[1], value : web3.utils.toWei("1.41","ether")})
         await remitpresale.buyToken({from : accounts[5], value : web3.utils.toWei("3.19","ether")})

         var actual = await remit.balanceOf(accounts[1]);
         var expected = 0
         assert.equal(actual,expected);
      
         await time.increase(time.duration.days(45));

         await remitpresale.claim({from:accounts[1]}); 
         await remitpresale.claim({from:accounts[6]});

         actual = await remit.balanceOf(accounts[1]);
         expected = web3.utils.toWei("70.5","ether")
         assert.equal(actual,expected);

         actual = await remit.balanceOf(accounts[6]);
         expected = web3.utils.toWei("138","ether");
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 9:To claim tokens before presale ends]", () => {
      it("Claim  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("4.5","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.01","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1624619581;
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[6], value : web3.utils.toWei("1.98","ether")})
         
         var actual = await remit.balanceOf(accounts[1]);
         var expected = 0
         assert.equal(actual,expected);
         try{
          await remitpresale.claim({from:accounts[6]});
         }
         catch{
         }

         actual = await remit.balanceOf(accounts[6]);
         expected = 0
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 10:To claim tokens who has not deposited]", () => {
      it("Claim  Tokens", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("4.5","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.01","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1624619581;
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[5], value : web3.utils.toWei("3.25","ether")})
         
         try{
          await remitpresale.claim({from:accounts[8]});
         }
         catch{
         }

         var actual = await remit.balanceOf(accounts[5]);
         var expected = 0
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 11:To withdraw eth deposited in the presale]", () => {
      it("Withdraw eth deposited", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("6","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.01","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1627211581; 
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[5], value : web3.utils.toWei("3.25","ether")})
         await remitpresale.buyToken({from : accounts[1], value : web3.utils.toWei("4.41","ether")})
         await remitpresale.buyToken({from : accounts[5], value : web3.utils.toWei("5.19","ether")})
         await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("1.87","ether")})
         await remitpresale.buyToken({from : accounts[8], value : web3.utils.toWei("6","ether")})

         var actual = await remitpresale.totalInvestment();
         var expected = web3.utils.toWei("20.72","ether");
         assert(actual,expected);

         
         actual = await web3.eth.getBalance(accounts[9]);
         assert.equal(actual,web3.utils.toWei("100","ether"))
         
         await remitpresale.withdrawDepositedEth();

         var actual = await web3.eth.getBalance(accounts[9]);
         assert.notEqual(actual,web3.utils.toWei("100","ether"))
      });
    });

    describe("[Testcase 12:To set new wallet address]", () => {
      it("Withdraw eth deposited", async () => {
         await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
         await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
         await remitpresale.setMaxDeposit(web3.utils.toWei("6","ether"));
         await remitpresale.setPrice(web3.utils.toWei("0.01","ether"));
         await remitpresale.setCap(web3.utils.toWei("100","ether"));
         var endtime = 1632568381;
         await remitpresale.startPresale(endtime);
       
         await remitpresale.buyToken({from : accounts[2], value : web3.utils.toWei("1","ether")})
         await remitpresale.buyToken({from : accounts[1], value : web3.utils.toWei("3.98","ether")})
         await remitpresale.buyToken({from : accounts[3], value : web3.utils.toWei("4","ether")})
         await remitpresale.buyToken({from : accounts[8], value : web3.utils.toWei("6","ether")})

         await remitpresale.setWalletAddress(accounts[5]); 
         
         var prevbalance = await web3.eth.getBalance(accounts[5]);
        
         await remitpresale.withdrawDepositedEth(); 

         var currentbalance = await web3.eth.getBalance(accounts[5]);
         assert.notEqual(currentbalance,prevbalance);
      });
    });
});
