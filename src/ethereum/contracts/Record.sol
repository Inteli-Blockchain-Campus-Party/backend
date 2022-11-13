//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// Stablish that this contract is an ERC1155 Protocol
contract Record is ERC1155 {
    // Definition of the owner address and the id count
    address public owner;
    uint256 idCount;

    // Checks if the owner is the one who calls the contract
    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    // Officcialy mints the NFT before anything is executed at the contract
    constructor(string memory _ipfsLink, address _owner) ERC1155(_ipfsLink) {
        owner = _owner;
        require(_owner == msg.sender);
        _mint(owner, idCount, 1, "");
        idCount += 1;
    }

    // Burn the NFT
    function burnNFT(address _address, uint256 _id) public isOwner {
        _burn(_address, _id, 1);
    }
}
