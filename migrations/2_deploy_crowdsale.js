const Nudicoin = artifacts.require("./Nudicoin.sol");

module.exports = function(deployer) {
  const _name = "Nudi Coin";
  const _symbol = "NUDI";
  const _decimals = 18;
  
  deployer.deploy(Nudicoin, _name, _symbol, _decimals);
};
