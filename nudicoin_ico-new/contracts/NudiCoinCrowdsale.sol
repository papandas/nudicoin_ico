pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract NudiCoinCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale{

  uint256 public investorMinCap = 2000000000000000;
  uint256 public investorHardCap = 50000000000000000000;
  mapping(address => uint256) public contributions;

  constructor(uint256 _rate, address payable _wallet, ERC20 _token, uint256 _cap) 
    Crowdsale(_rate, _wallet, _token) 
    CappedCrowdsale(_cap)
    public 
  {
    
  }

  /*function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    uint256 _existingContribution = contributions[_beneficiary];
    uint256 _newContribution = _existingContribution.add(_weiAmount);
    require(_newContribution >= investorMinCap && _newContribution <= investorMinCap);
    contributions[_beneficiary] = _newContribution;
  }*/

}
