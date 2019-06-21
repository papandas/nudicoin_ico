import ether from './helpers/ether';
import EVMRevert from './helpers/EVMRevert';

const BigNumber = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const NudiCoin = artifacts.require('./NudiCoin.sol');
const NudiCoinCrowdsale = artifacts.require("./NudiCoinCrowdsale.sol");

contract('NudiCoinCrowdsale', function([_, wallet, investor1, investor2, foundersFund, foundationFund, partnersFund]){
    
  const _name = 'Nudi Coin';
  const _symbol = 'NUDI';
  const _decimals = 18;

  const _rate = 500;
  const _wallet = wallet;
  const _cap = ether(100);
  const _investorMinCap = ether(0.02);

  //var this.token;
  //var this.crowdsale;

  beforeEach(async function () {

    this.token = await NudiCoin.new(_name, _symbol, _decimals);
    
    this.crowdsale = await NudiCoinCrowdsale.new(_rate, _wallet, this.token.address, _cap);

    // Pause Token
    //await this.token.pause();

    // Transfer token ownership to crowdsale
    //await this.token.transferOwnership(this.crowdsale.address);

    // let owners = await this.token.owner();
    //console.log("Owner", owners)
  });

  describe('crowdsale', function() {
    it('tracks the rate', async function() {
      const rate = await this.crowdsale.rate();
      const rateToNum = rate.toNumber()
      rateToNum.should.equal(_rate);
    });

    it('tracks the wallet', async function() {
      const wallet = await this.crowdsale.wallet();
      wallet.should.equal(_wallet);
    });

    it('tracks the token', async function() {
      const token = await this.crowdsale.token();
      token.should.equal(this.token.address);
    });
  });


  /*describe('minted crowdsale', function() {
    it('mints tokens after purchase', async function() {
      const originalTotalSupply = await this.token.totalSupply();
      await this.crowdsale.sendTransaction({ value: ether(1), from: investor1 });
      const newTotalSupply = await this.token.totalSupply();
      assert.isTrue(newTotalSupply > originalTotalSupply);
    });
  });

  describe('capped crowdsale', async function() {
    it('has the correct hard cap', async function() {
      const cap = await this.crowdsale.cap();
      cap.should.be.bignumber.equal(_cap);
    });
  });

  describe('accepting payments', function() {
    it('should accept payments', async function() {
      const value = ether(1)
      const purchaser = investor2;
      ///await this.crowdsale.sendTransaction({ value: value, from: investor1 }).then((reply)=>{console.log(reply)});
      await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
    });
  });

  describe('buyTokens()', function() {
    describe('when the contribution is less than the minimum cap', function() {
      it('rejects the transaction', async function() {
        const value = _investorMinCap - 1;
        await this.crowdsale.buyTokens(investor2, { value: value, from: investor2 }).should.be.rejectedWith('revert');
      });
    });

    describe('when the investor has already met the minimum cap', function() {
      it('allows the investor to contribute below the minimum cap', async function() {
        // First contribution is valid
        const value1 = web3.toWei('1', 'ether');
        await this.crowdsale.buyTokens(investor1, { value: value1, from: investor1 });
        // Second contribution is less than investor cap
        const value2 = 1; // wei
        await this.crowdsale.buyTokens(investor1, { value: value2, from: investor1 }).should.be.fulfilled;
      });
    });
  });*/

})