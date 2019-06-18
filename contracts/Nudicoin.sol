pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//import "http://github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract Nudicoin is ERC20, ERC20Detailed{

    constructor(string memory _name, string memory _symbol, uint8 _decimals) ERC20Detailed(_name, _symbol, _decimals) public
    {
        
    }


  
}