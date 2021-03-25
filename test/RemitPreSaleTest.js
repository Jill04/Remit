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
  const RemitPreSale = artifacts.require("RemitPreSale");

  require("chai").use(require("chai-bignumber")(BN)).should();
  
  
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
         await remitpresale.startPresale(time.duration.minutes(10));

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
          //  try{
          //   await remitpresale.startPresale(time.duration.minutes(10));
          //  }
          //  catch{
          //  }
          //  var actual = await remitpresale.startTime();
          //  var expected = 0;
          //  assert.equal(actual,expected);
        });
      });
  
      describe("[Testcase 2:To buy tokens before pre sale starts]", () => {
        it("Start  PreSale", async () => {
           await remit.mintCirculationSupply(remitpresale.address,web3.utils.toWei("5000","ether"));
           await remitpresale.setMinDeposit(web3.utils.toWei("0.1","ether"));
           await remitpresale.setMaxDeposit(web3.utils.toWei("10","ether"));
           await remitpresale.setPrice(web3.utils.toWei("0.02","ether"));
           await remitpresale.setCap(web3.utils.toWei("100","ether"));
        
           var actual = await remitpresale.startTime();
           var expected = 0;
           assert.notEqual(actual,expected);
        });
      });

    // describe("[Testcase 4: To stake remit tokens without setting stake address]", () => {
    //     it("Stake tokens", async () => {
    //        await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("60","ether"));
    //        await remit.transfer(accounts[3],web3.utils.toWei("28","ether"));
    //        await remit.approve(remitstake.address,web3.utils.toWei("25","ether"),{from:accounts[3]});
    //        try{
    //         await remitstake.deposit(web3.utils.toWei("19","ether"),{from : accounts[3]});
    //        }
    //        catch{
    //        } 
    //     });
    //   });

    // describe("[Testcase 5: To withdraw the more than staked tokens]", () => {
    //   it("Withdraw tokens", async () => {
    //     await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("120","ether"));
    //     await remit.setStakeAddress(remitstake.address);
    //     await remit.transfer(accounts[7],web3.utils.toWei("100","ether"));
    //     await remit.approve(remitstake.address,web3.utils.toWei("85","ether"),{from:accounts[7]});
    //     await remitstake.deposit(web3.utils.toWei("40","ether"),{from : accounts[7]});
    //     try{
    //       await remitstake.withdraw(web3.utils.toWei("56","ether"),{from : accounts[7]});
    //     }
    //     catch{
    //     }
    //   });
    // });

    // describe("[Testcase 6: To withdraw the staked tokens before cliff time]", () => {
    //   it("Withdraw tokens", async () => {
    //     await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("120","ether"));
    //     await remit.setStakeAddress(remitstake.address);
    //     await remit.transfer(accounts[7],web3.utils.toWei("100","ether"));
    //     await remit.approve(remitstake.address,web3.utils.toWei("50","ether"),{from:accounts[7]});
    //     await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[7]});
    //     await remitstake.deposit(web3.utils.toWei("10","ether"),{from : accounts[7]});
    //     try{
    //       await remitstake.withdraw(web3.utils.toWei("25","ether"),{from : accounts[7]});
    //     }
    //     catch{
    //     }
    //   });
    // });

    // describe("[Testcase 7: To determine number of holder]", () => {
    //     it("holder", async () => {
    //       await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("320","ether"));
    //       await remit.setStakeAddress(remitstake.address);
    //       await remit.transfer(accounts[7],web3.utils.toWei("100","ether"));
    //       await remit.approve(remitstake.address,web3.utils.toWei("50","ether"),{from:accounts[7]});
    //       await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[7]});
    //       await remitstake.deposit(web3.utils.toWei("10","ether"),{from : accounts[7]});
          
    //       await remit.transfer(accounts[9],web3.utils.toWei("50","ether"));
    //       await remit.approve(remitstake.address,web3.utils.toWei("40","ether"),{from:accounts[9]});
    //       await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[9]});

    //       var actual = await remitstake.getNumberOfHolders();
    //       var expected = 2;
    //       assert.equal(actual,expected);
    //     });
    //   });

    //   describe("[Testcase 8: To claim Divs]", () => {
    //     it("Claim", async () => {
    //       await remit.mintCirculationSupply(accounts[0],web3.utils.toWei("80","ether"));
    //       await remit.setStakeAddress(remitstake.address);
    //       await remit.transfer(accounts[1],web3.utils.toWei("56","ether"));
    //       await remit.approve(remitstake.address,web3.utils.toWei("50","ether"),{from:accounts[1]});
    //       await remitstake.deposit(web3.utils.toWei("20","ether"),{from : accounts[1]});

    //       await time.increase(time.duration.hours(93));

    //       await remitstake.deposit(web3.utils.toWei("15","ether"),{from : accounts[1]});
    //       await remitstake.claimDivs();
    //       var actual = await remit.stakeFarmSupply();
    //       var expected = web3.utils.toWei("350000","ether");
    //       assert.notEqual(actual,expected);
    //       actual = await remitstake.totalEarnedTokens(accounts[1]);
    //       assert.notEqual(actual,0);
    //     });
    //   });
});

    
