import ether from './helpers/ether';
const BN = web3.utils.BN;
import time from './helpers/time';
//const { BN, balance, ether, expectRevert, time } = require('openzeppelin-test-helpers');

const BigNumber = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const SampleCrowdsale = artifacts.require('./NudiCoinCrowdsale.sol');
const SampleCrowdsaleToken = artifacts.require('./NudiCoin.sol');

contract('SampleCrowdsale', function ([_, deployer, owner, wallet, investor]) {
  const RATE = new BN(10);
  const GOAL = ether('10');
  const CAP = ether('20');

  const _name = "Nudi Coin";
  const _symbol = "NUDI";
  const _decimals = 18;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    //console.log("Init - beforEach")
    this.openingTime = (await time.latest()).add(time.duration.weeks(1));
    console.log("This Openning Time", new Date(new BN(this.openingTime).toString()).toLocaleString());

    this.closingTime = this.openingTime.add(time.duration.years(1));
    console.log("This Closing time", new BN(this.closingTime).toString())

    this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));
    console.log("This afterClosing Time", new BN(this.afterClosingTime).toString())

    this.token = await SampleCrowdsaleToken.new(_name, _symbol, _decimals, { from: deployer });
    //console.log("Token", this.token.address);
    this.crowdsale = await SampleCrowdsale.new(
      this.openingTime, this.closingTime, RATE, wallet, CAP, this.token.address, GOAL,
      { from: owner }
    );
    //console.log("This Crowdsale", this.crowdsale.address)

    await this.token.addMinter(this.crowdsale.address, { from: deployer });
    //console.log("Adding minter")
    await this.token.renounceMinter({ from: deployer });
    //console.log("Renounce Minter")
  });

  it('should create crowdsale with correct parameters', async function () {
    //console.log("Init - correct param")
    const _openingTime = await this.crowdsale.openingTime();
    (_openingTime.toNumber()).should.equal(this.openingTime.toNumber());

    //console.log("This Closing time", this.closingTime)
    const _closingTime = await this.crowdsale.closingTime();
    (_closingTime.toNumber()).should.equal(this.closingTime.toNumber());

    //console.log("RATE", RATE)
    const _RATE = await this.crowdsale.rate();
    (_RATE.toNumber()).should.equal(RATE.toNumber());

    //console.log("Wallet", wallet)
    (await this.crowdsale.wallet()).should.be.equal(wallet);

    console.log("GOAL", new BN(GOAL).toString())
    const _GOAL = await this.crowdsale.goal();
    console.log("_GOAL", new BN(_GOAL).toString())
    //(_GOAL.toNumber()).should.equal(GOAL.toNumber());

    console.log("CAP", new BN(CAP).toString())
    const _CAP = await this.crowdsale.cap();
    console.log("_CAP", new BN(_CAP).toString())
    //(_CAP.toNumber()).should.equal(CAP.toNumber());
  });

  /*it('should not accept payments before start', async function () {
    await expectRevert(this.crowdsale.send(ether('1')), 'TimedCrowdsale: not open');
    await expectRevert(this.crowdsale.buyTokens(investor, { from: investor, value: ether('1') }),
      'TimedCrowdsale: not open'
    );
  });*/

  it('should accept payments during the sale', async function () {
    const investmentAmount = ether('1');
    const expectedTokenAmount = RATE.mul(investmentAmount);
    
    //await time.increaseTo(this.openingTime);
    await this.crowdsale.buyTokens(investor, { value: investmentAmount, from: investor });

    const balanceOf = await this.token.balanceOf(investor);
    console.log("balanceOf", new BN(balanceOf).toString(), ", Expected Token Aount", new BN(expectedTokenAmount).toString())
    (new BN(balanceOf).toString()).should.equal(new BN(expectedTokenAmount).toString());

    const totalSupply = await this.token.totalSupply()
    console.log("totalSupply", new BN(totalSupply).toString(), ", Inventment", new BN(investmentAmount).toString())
    (new BN(totalSupply).toString()).should.equal(new BN(investmentAmount).toString());
  });

  /*it('should reject payments after end', async function () {
    await time.increaseTo(this.afterClosingTime);
    await expectRevert(this.crowdsale.send(ether('1')), 'TimedCrowdsale: not open');
    await expectRevert(this.crowdsale.buyTokens(investor, { value: ether('1'), from: investor }),
      'TimedCrowdsale: not open'
    );
  });

  it('should reject payments over cap', async function () {
    await time.increaseTo(this.openingTime);
    await this.crowdsale.send(CAP);
    await expectRevert(this.crowdsale.send(1), 'CappedCrowdsale: cap exceeded');
  });

  it('should allow finalization and transfer funds to wallet if the goal is reached', async function () {
    await time.increaseTo(this.openingTime);
    await this.crowdsale.send(GOAL);

    const balanceTracker = await balance.tracker(wallet);
    await time.increaseTo(this.afterClosingTime);
    await this.crowdsale.finalize({ from: owner });
    (await balanceTracker.delta()).should.be.bignumber.equal(GOAL);
  });

  it('should allow refunds if the goal is not reached', async function () {
    const balanceTracker = await balance.tracker(investor);

    await time.increaseTo(this.openingTime);
    await this.crowdsale.sendTransaction({ value: ether('1'), from: investor, gasPrice: 0 });
    await time.increaseTo(this.afterClosingTime);

    await this.crowdsale.finalize({ from: owner });
    await this.crowdsale.claimRefund(investor, { gasPrice: 0 });

    (await balanceTracker.delta()).should.be.bignumber.equal('0');
  });*/

  /*describe('when goal > cap', function () {
    // goal > cap
    const HIGH_GOAL = ether('30');

    it('creation reverts', async function () {
      await expectRevert(SampleCrowdsale.new(
        this.openingTime, this.closingTime, RATE, wallet, CAP, this.token.address, HIGH_GOAL
      ), 'SampleCrowdSale: goal is greater than cap');
    });
  });*/
});
