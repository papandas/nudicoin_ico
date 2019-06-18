//import ether from './helpers/ether';

const BigNumber = web3.BigNumber;

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

  beforeEach(async function () {
    this.token = await NudiCoin.new(_name, _symbol, _decimals);
    
    this.crowdsale = await NudiCoinCrowdsale.new(_rate, _wallet, this.token.address);

    // Transfer token ownership to crowdsale
    await this.token.transferOwnership(this.crowdsale.address);
  });

  describe('crowdsale', function() {
    it('tracks the rate', async function() {
      const rate = await this.crowdsale.rate();
      rate.should.be.bignumber.equal(_rate);
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


  describe('minted crowdsale', function() {
    it('mints tokens after purchase', async function() {
      const originalTotalSupply = await this.token.totalSupply();
      await this.crowdsale.sendTransaction({ value: web3.toWei('1', 'ether'), from: investor1 });
      const newTotalSupply = await this.token.totalSupply();
      assert.isTrue(newTotalSupply > originalTotalSupply);
      
    });
  });

  describe('accepting payments', function() {
    it('should accept payments', async function() {
      const value = web3.toWei('1', 'ether');
      const purchaser = investor2;
      await this.crowdsale.sendTransaction({ value: value, from: investor1 }).should.be.fulfilled;
      await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
    });
  });

})