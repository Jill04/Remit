const {
    BN, // Big Number support
    constants, // Common constants, like the zero address and largest integers
    expectEvent, // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
    time,
  } = require("@openzeppelin/test-helpers");
  
  const truffleAssert = require("truffle-assertions");
  const { assert, expect } = require("chai");
  const Remit = artifacts.require("Remit");
  const RemitStake = artifacts.require("RemitStaking");

  require("chai").use(require("chai-bignumber")(BN)).should();
  
  
  contract("Remit Stake", () => {
    it("Should deploy smart contract properly", async () => {
      const remit = await Remit.deployed();
      const remitstake = await RemitStake.deployed(remit.address);

      assert(remit.address !== "");
      assert(remitstake.address !== "");
    });
  
    beforeEach(async function () {
      remit = await Remit.new();
      remitstake = await RemitStake.new(remit.address);
      accounts = await web3.eth.getAccounts();
    });
  
    describe("[Testcase 1: To stake remit tokens]", () => {
      it("Stake tokens", async () => {
         await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("60","ether"));
         await remit.transfer(accounts[3],web3.utils.toWei("50","ether"));
         await remit.approve(remitstake.address,web3.utils.toWei("40","ether"),{from:accounts[3]});
         await remit.setStakeAddress(remitstake.address);
         await remitstake.deposit(web3.utils.toWei("15","ether"),{from : accounts[3]});
         
         await time.increase(time.duration.hours(93));

         await remitstake.deposit(web3.utils.toWei("25","ether"),{from : accounts[3]});
         var actual = await remit.stakeFarmSupply();
         var expected = web3.utils.toWei("350000","ether");
         assert.notEqual(actual,expected);
      });
    });

    describe("[Testcase 2: To stake remit tokens with insufficient balance]", () => {
      it("Stake tokens", async () => {
         await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("60","ether"));
         await remit.transfer(accounts[3],web3.utils.toWei("10","ether"));
         await remit.approve(remitstake.address,web3.utils.toWei("10","ether"),{from:accounts[3]});
         await remit.setStakeAddress(remitstake.address);
         try{
          await remitstake.deposit(web3.utils.toWei("15","ether"),{from : accounts[3]});
         }
         catch{
         } 
         var actual = await remitstake.depositedTokens( accounts[3]);
         assert.equal(actual,0);
         actual = await remit.stakeFarmSupply();
         var expected = web3.utils.toWei("350000","ether");
         assert.equal(actual,expected);
      });
    });
  
     describe("[Testcase 3: To withdraw the staked tokens after the cliff time]", () => {
      it("Withdraw tokens", async () => {
        await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("120","ether"));
        await remit.setStakeAddress(remitstake.address);
        await remit.transfer(accounts[5],web3.utils.toWei("100","ether"));
        await remit.approve(remitstake.address,web3.utils.toWei("85","ether"),{from:accounts[5]});
        await remitstake.deposit(web3.utils.toWei("70","ether"),{from : accounts[5]});

        await time.increase(time.duration.hours(84));
       
        await remitstake.withdraw(web3.utils.toWei("60","ether"),{from : accounts[5]});
        var actual = await remitstake.totalEarnedTokens(accounts[5]);
        assert.notEqual(actual,0);
      });
    });

    describe("[Testcase 4: To stake remit tokens without setting stake address]", () => {
        it("Stake tokens", async () => {
           await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("60","ether"));
           await remit.transfer(accounts[3],web3.utils.toWei("28","ether"));
           await remit.approve(remitstake.address,web3.utils.toWei("25","ether"),{from:accounts[3]});
           try{
            await remitstake.deposit(web3.utils.toWei("19","ether"),{from : accounts[3]});
           }
           catch{
           } 
        });
      });

    describe("[Testcase 5: To withdraw the more than staked tokens]", () => {
      it("Withdraw tokens", async () => {
        await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("120","ether"));
        await remit.setStakeAddress(remitstake.address);
        await remit.transfer(accounts[7],web3.utils.toWei("100","ether"));
        await remit.approve(remitstake.address,web3.utils.toWei("85","ether"),{from:accounts[7]});
        await remitstake.deposit(web3.utils.toWei("40","ether"),{from : accounts[7]});
        try{
          await remitstake.withdraw(web3.utils.toWei("56","ether"),{from : accounts[7]});
        }
        catch{
        }
      });
    });

    describe("[Testcase 6: To withdraw the staked tokens before cliff time]", () => {
      it("Withdraw tokens", async () => {
        await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("120","ether"));
        await remit.setStakeAddress(remitstake.address);
        await remit.transfer(accounts[7],web3.utils.toWei("100","ether"));
        await remit.approve(remitstake.address,web3.utils.toWei("50","ether"),{from:accounts[7]});
        await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[7]});
        await remitstake.deposit(web3.utils.toWei("10","ether"),{from : accounts[7]});
        try{
          await remitstake.withdraw(web3.utils.toWei("25","ether"),{from : accounts[7]});
        }
        catch{
        }
      });
    });

    describe("[Testcase 7: To determine number of holder]", () => {
        it("holder", async () => {
          await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("320","ether"));
          await remit.setStakeAddress(remitstake.address);
          await remit.transfer(accounts[7],web3.utils.toWei("100","ether"));
          await remit.approve(remitstake.address,web3.utils.toWei("50","ether"),{from:accounts[7]});
          await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[7]});
          await remitstake.deposit(web3.utils.toWei("10","ether"),{from : accounts[7]});
          
          await remit.transfer(accounts[9],web3.utils.toWei("50","ether"));
          await remit.approve(remitstake.address,web3.utils.toWei("40","ether"),{from:accounts[9]});
          await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[9]});

          var actual = await remitstake.getNumberOfHolders();
          var expected = 2;
          assert.equal(actual,expected);
        });
      });

      describe("[Testcase 8: To claim Divs]", () => {
        it("Claim", async () => {
          await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("80","ether"));
          await remit.setStakeAddress(remitstake.address);
          await remit.transfer(accounts[1],web3.utils.toWei("56","ether"));
          await remit.approve(remitstake.address,web3.utils.toWei("50","ether"),{from:accounts[1]});
          await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[1]});

          await time.increase(time.duration.hours(93));

          await remitstake.deposit(web3.utils.toWei("15","ether"),{from : accounts[1]});
          await remitstake.claimDivs();
          var actual = await remit.stakeFarmSupply();
          var expected = web3.utils.toWei("350000","ether");
          assert.notEqual(actual,expected);
          actual = await remitstake.totalEarnedTokens(accounts[1]);
          assert.notEqual(actual,0);
        });
      });
});

    
