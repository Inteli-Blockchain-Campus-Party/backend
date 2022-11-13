//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Record is ERC1155 {
    address public owner;
    uint256 idCount;

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor(string memory _ipfsLink, address _owner) ERC1155(_ipfsLink) {
        owner = _owner;
        require(_owner == msg.sender);
        _mint(owner, idCount, 1, "");
        idCount += 1;
    }

    function burnNFT(address _address, uint256 _id) public isOwner {
        _burn(_address, _id, 1);
    }
}
