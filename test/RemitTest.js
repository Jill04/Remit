const {
    BN, // Big Number support
    constants, // Common constants, like the zero address and largest integers
    expectEvent, // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
    time,
  } = require("@openzeppelin/test-helpers");
  
  const truffleAssert = require("truffle-assertions");
  const { assert, expect } = require("chai");
const { emit } = require("nodemon");
  const Remit = artifacts.require("Remit");
  
  require("chai").use(require("chai-bignumber")(BN)).should();
  
  
  contract("remit", () => {
    it("Should deploy smart contract properly", async () => {
      const remit = await Remit.deployed();
      
      assert(remit.address !== "");
    });
  
    beforeEach(async function () {
      remit = await Remit.new();
      accounts = await web3.eth.getAccounts();
    });

    describe("[Testcase 1: To determine team advisor unlock time and supply]", () => {
      it("Team Advisor Supply", async () => {
         let teamcount = await remit.teamCounter();
         let actual = await remit.teamAdvisorSupplyUnlockSupply(6);
         assert.equal(actual,web3.utils.toWei("16666.666666666666666666","ether"))
        await remit.teamAdvisorSupplyUnlockTime(teamcount);
       });
    });

    describe("[Testcase 2: To check the dev supply count ]", () => {
      it(" Developer Supply", async () => {
        let devCount = await remit.devFundCounter();
        let actual = await remit.devFundSupplyUnlockSupply(devCount+2);
        assert.equal(actual,0);
      });
    });
  
    describe("[Testcase 3: To mint circulation supply]", () => {
      it("Supply", async () => {

         var actual = await remit.circulationSupply();
         var expected = web3.utils.toWei("370000","ether");
         assert.equal(actual,expected);
         await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("60","ether"));
         actual = await remit.balanceOf(accounts[0]);
         expected = web3.utils.toWei("60","ether");
         assert.equal(actual,expected);
      });
    });

    describe("[Testcase 4: To mint circulation supply more than limit]", () => {
      it("Supply", async () => {

         try{
          await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("390000","ether"));
         }
         catch{
         }
         var actual = await remit.circulationSupply();
         assert.equal(actual,web3.utils.toWei("370000","ether"));
      });
    });

    describe("[Testcase 5: To mint the developer supply before unlock time ]", () => {
      it("Mint Developer Supply", async () => {
        try{
          await remit.mintDevFundSupply(accounts[2],web3.utils.toWei("165","ether"));
        }
        catch{
        }
         var actual = await remit.devFundSupply();
         var expected = 0;
        assert.equal(actual,expected);
      });
    });
  
     describe("[Testcase 6 :To mint the developer supply after the unlock time]", () => {
      it("Mint Developer Supply", async () => {

        await time.increase(time.duration.days(43));

        await remit.mintDevFundSupply(accounts[2],web3.utils.toWei("165","ether"));
        await remit.mintDevFundSupply(accounts[4],web3.utils.toWei("435","ether"));
        await remit.mintDevFundSupply(accounts[5],web3.utils.toWei("899","ether"));
        actual = await remit.devFundSupply();
        expected = web3.utils.toWei("22501","ether");
        assert.equal(actual,expected);

      });
    });

    describe("[Testcase 7 :To mint stakefarm supply before unlock time]", () => {
      it("Mint StakeFarm Supply", async () => {

        var actual = await remit.stakeFarmSupply();
        var expected = web3.utils.toWei("350000","ether");
        assert.equal(actual,expected);
        
        await remit.setStakeAddress(accounts[0]);
        await remit.mintStakeFarmSupply(accounts[2],web3.utils.toWei("165","ether"));
        await remit.mintStakeFarmSupply(accounts[4],web3.utils.toWei("435","ether"));
        await remit.mintStakeFarmSupply(accounts[5],web3.utils.toWei("799","ether"));
        await remit.mintStakeFarmSupply(accounts[6],web3.utils.toWei("299","ether"));


        actual = await remit.stakeFarmSupply();
        expected = web3.utils.toWei("348302","ether");
        assert.equal(actual,expected);

      });
    });

    describe("[Testcase 8 :To mint stakefarm supply who is not stake/farm address]", () => {
      it("Mint StakeFarm Supply", async () => {
         try{
          await remit.mintStakeFarmSupply(accounts[5],web3.utils.toWei("899","ether"));
        }
        catch{
        }
     });
    });

    describe("[Testcase 9 :To mint stakefarm supply after unlock time]", () => {
      it("Mint StakeFarm Supply", async () => {

        var actual = await remit.stakeFarmSupply();
        var expected = web3.utils.toWei("350000","ether");
        assert.equal(actual,expected);
        
        await remit.setStakeAddress(accounts[0]);
        await remit.mintStakeFarmSupply(accounts[2],web3.utils.toWei("10000","ether"));
        await remit.mintStakeFarmSupply(accounts[4],web3.utils.toWei("14000","ether"));

        actual = await remit.stakeFarmSupply();
        expected = web3.utils.toWei("326000","ether");
        assert.equal(actual,expected);

        await time.increase(time.duration.days(378));

        await remit.mintStakeFarmSupply(accounts[1],web3.utils.toWei("25000","ether"));
        await remit.mintStakeFarmSupply(accounts[3],web3.utils.toWei("16000","ether"));
        await remit.mintStakeFarmSupply(accounts[6],web3.utils.toWei("16000","ether"));
        await remit.mintStakeFarmSupply(accounts[4],web3.utils.toWei("14000","ether"));

        actual = await remit.stakeFarmSupply();
        expected = web3.utils.toWei("975000","ether");
        assert.equal(actual,expected);

      });
    });

    describe("[Testcase 10 :To mint  reserved supply ]", () => {
      it("Reserved Supply", async () => {

        var actual = await remit.resverdSupply();
        var expected = web3.utils.toWei("10000","ether");
        assert.equal(actual,expected);

        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("875","ether"));
        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("9125","ether");
        assert.equal(actual,expected);

        await time.increase(time.duration.days(378)); 

        await remit.mintReservedSupply(accounts[2],web3.utils.toWei("1025","ether"));
        await remit.mintReservedSupply(accounts[4],web3.utils.toWei("535","ether"));
        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("17565","ether");
        assert.equal(actual,expected);
     });
    });
    
    describe("[Testcase 11 :To mint  reserved supply]", () => {
      it("Reserved Supply", async () => {

        var actual = await remit.resverdSupply();
        var expected = web3.utils.toWei("10000","ether");
        assert.equal(actual,expected);

        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("875","ether"));
        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("9125","ether");
        assert.equal(actual,expected);

        await remit.mintReservedSupply(accounts[2],web3.utils.toWei("1025","ether"));
        await remit.mintReservedSupply(accounts[4],web3.utils.toWei("5435","ether"));
        try{
          await remit.mintReservedSupply(accounts[4],web3.utils.toWei("3000","ether"));
        }
        catch{
        }
        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("2665","ether");
        assert.equal(actual,expected);
     });
    });
    
    describe("[Testcase 12 :To mint  reserved supply for all the unlock time ]", () => {
      it("Reserved Supply", async () => {

        var actual = await remit.resverdSupply();
        var expected = web3.utils.toWei("10000","ether");
        assert.equal(actual,expected);

        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("875","ether"));
        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("9125","ether");
        assert.equal(actual,expected);

        await time.increase(time.duration.days(378)); 

        await remit.mintReservedSupply(accounts[2],web3.utils.toWei("5025","ether"));
        await remit.mintReservedSupply(accounts[4],web3.utils.toWei("8535","ether"));
        await remit.mintReservedSupply(accounts[9],web3.utils.toWei("600","ether"));
        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("4000","ether"));

        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("965","ether");
        assert.equal(actual,expected);

        await time.increase(time.duration.days(778)); 

        await remit.mintReservedSupply(accounts[2],web3.utils.toWei("9600","ether"));
        await remit.mintReservedSupply(accounts[4],web3.utils.toWei("600","ether"));
        await remit.mintReservedSupply(accounts[9],web3.utils.toWei("4500","ether"));
        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("2000","ether"));
        await remit.mintReservedSupply(accounts[5],web3.utils.toWei("750","ether"));

        actual = await remit.resverdSupply();
        expected = web3.utils.toWei("3515","ether");
        assert.equal(actual,expected);

        await time.increase(time.duration.days(375)); 

        await remit.mintReservedSupply(accounts[7],web3.utils.toWei("8000","ether"));
        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("3515","ether"));
        await remit.mintReservedSupply(accounts[8],web3.utils.toWei("2000","ether"));

        actual = await remit.resverdSupply();
        expected = 0;
        assert.equal(actual,expected);
        try{
          await remit.mintReservedSupply(accounts[6],web3.utils.toWei("500","ether"));
        }
        catch{}
     });
    });

    describe("[Testcase 13 : To mint the marketing supply before unlock time]", () => {
      it("Mint Marketing Supply", async () => {

        var actual = await remit.marketingSupply();
        var expected = web3.utils.toWei("50000","ether");
        assert.equal(actual,expected);

        await remit.mintMarketingSupply(accounts[8],web3.utils.toWei("1250","ether"));
        await remit.mintMarketingSupply(accounts[9],web3.utils.toWei("695","ether"));
        await remit.mintMarketingSupply(accounts[1],web3.utils.toWei("500","ether"));
        actual = await remit.marketingSupply();
        expected = web3.utils.toWei("47555","ether");
        assert.equal(actual,expected);
      });
    });

    describe("[Testcase 14 : To mint the marketing supply after unlock time]", () => {
      it("Mint Marketing Supply", async () => {

        var actual = await remit.marketingSupply();
        var expected = web3.utils.toWei("50000","ether");
        assert.equal(actual,expected);

        await remit.mintMarketingSupply(accounts[8],web3.utils.toWei("1250","ether"));
        actual = await remit.marketingSupply();
        expected = web3.utils.toWei("48750","ether");
        assert.equal(actual,expected);

        await time.increase(time.duration.days(365));

        await remit.mintMarketingSupply(accounts[2],web3.utils.toWei("1250","ether"));
        await remit.mintMarketingSupply(accounts[9],web3.utils.toWei("6895","ether"));
        await remit.mintMarketingSupply(accounts[1],web3.utils.toWei("800","ether"));
        actual = await remit.marketingSupply();
        expected = web3.utils.toWei("89805","ether");
        assert.equal(actual,expected);

        await remit.mintMarketingSupply(accounts[1],web3.utils.toWei("12950","ether"));
        await remit.mintMarketingSupply(accounts[9],web3.utils.toWei("8895","ether"));
        await remit.mintMarketingSupply(accounts[4],web3.utils.toWei("990","ether"));
        await remit.mintMarketingSupply(accounts[8],web3.utils.toWei("10650","ether"));
        await remit.mintMarketingSupply(accounts[2],web3.utils.toWei("6895","ether"));
        await remit.mintMarketingSupply(accounts[2],web3.utils.toWei("5400","ether"));
        await remit.mintMarketingSupply(accounts[7],web3.utils.toWei("10055","ether"));
        await remit.mintMarketingSupply(accounts[5],web3.utils.toWei("5400","ether"));
        await remit.mintMarketingSupply(accounts[5],web3.utils.toWei("16895","ether"));
        await remit.mintMarketingSupply(accounts[9],web3.utils.toWei("11675","ether"));

        actual = await remit.marketingSupply();
        expected = 0 ;
        assert.equal(actual,expected);
        try{
          await remit.mintMarketingSupply(accounts[3],web3.utils.toWei("500","ether"));
        }
        catch{
        }
      });
    });

    describe("[Testcase 15 : To mint Team Advisor Supply]", () => {
      it("Mint Team Advisor Supply", async () => {

        var actual = await remit.teamAdvisorSupply();
        var expected = 0;
        assert.equal(actual,expected);
        try{
          await remit.mintTeamAdvisorFundSupply(accounts[8],web3.utils.toWei("1250","ether"));
        }
       catch{
       }
      });
    });

    describe("[Testcase 16 : To mint Team Advisor Supply after unlock time]", () => {
      it("Team Advisor Supply", async () => {

        var actual = await remit.teamAdvisorSupply();
        var expected = 0;
        assert.equal(actual,expected);

        await time.increase(time.duration.days(78));

        await remit.mintTeamAdvisorFundSupply(accounts[1],web3.utils.toWei("2500","ether"));
        await remit.mintTeamAdvisorFundSupply(accounts[2],web3.utils.toWei("1666","ether"));
        await remit.mintTeamAdvisorFundSupply(accounts[3],web3.utils.toWei("2500","ether"));
        actual = await remit.teamAdvisorSupply();
        expected = web3.utils.toWei("10000.666666666666666666","ether");
        assert.equal(actual,expected);
      });
    });
});
  