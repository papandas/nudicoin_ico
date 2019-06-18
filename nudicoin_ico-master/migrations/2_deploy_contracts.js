const NudiCoin = artifacts.require("./NudiCoin.sol");

module.exports = function(deployer) {
  const _name = "Nudi Coin";
  const _symbol = "NUDI";
  const _decimals = 18;

  deployer.deploy(NudiCoin, _name, _symbol, _decimals);
};
