const NudiCoin = artifacts.require("./NudiCoin.sol");
const NudiCoinCrowdsale = artifacts.require("./NudiCoinCrowdsale.sol");

const duration = {
  seconds: function(val){ return val;},
  minutes: function(val){ return val = this.seconds(60);},
  hours: function(val){ return val = this.minutes(60);},
  days: function(val){ return val = this.hours(24);},
  weeks: function(val){ return val = this.days(7);},
  years: function(val){ return val = this.days(365);}
}

module.exports = async function(deployer, network, accounts) {
  const _name = "Nudi Coin";
  const _symbol = "NUDI";
  const _decimals = 18;

  await deployer.deploy(NudiCoin, _name, _symbol, _decimals);
  const deployedToken = await NudiCoin.deployed();
  console.log("Token Address:", deployedToken.address)

  const rate = 1000; // 1 ETH = 1000 NUDI
  const wallet = accounts[0];
  const timeNow = Math.floor(Date.now() / 1000);
  const opentingTime = timeNow + duration.seconds(30);
  const closingTime = timeNow + duration.hours(5);
  const cap = web3.utils.toWei("100");
  const goal = web3.utils.toWei("50");
  //console.log(cap, typeof cap)
  //console.log(goal, typeof goal)

  console.log("NudiCoinCrowdsale", opentingTime, closingTime, rate, wallet, cap, deployedToken.address, goal)

  //await deployer.deploy(NuidCoinCroudsale, rate, wallet, deployedToken.address, opentingTime, closingTime,)
  await deployer.deploy(NudiCoinCrowdsale, opentingTime, closingTime, rate, wallet, cap, deployedToken.address, goal)/*c*/
};
