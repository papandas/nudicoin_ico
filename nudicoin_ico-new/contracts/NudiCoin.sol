pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**contract NudiCoin is ERC20, ERC20Detailed {

    constructor (string memory _name, string memory _symbol, uint8 _decimals) public ERC20Detailed(_name, _symbol, _decimals) {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }
}*/

contract NudiCoin is ERC20, ERC20Mintable, ERC20Detailed {
    constructor (string memory _name, string memory _symbol, uint8 _decimals) public ERC20Detailed(_name, _symbol, _decimals) {
        // solhint-disable-previous-line no-empty-blocks
    }
}

