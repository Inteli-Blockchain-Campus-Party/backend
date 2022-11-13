//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract RecordFactory is ERC1155 {
    address public owner;
    address[] reports;

    uint256 idCount;

    struct HospitalRecord {
        string disease;
        string hospital;
        string date;
        string time;
    }

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor(string memory _ipfsLink) ERC1155(_ipfsLink) {
        owner = msg.sender;
    }

    mapping(address => HospitalRecord[]) public hospitalRecords;

    function generateReport(
        string memory _disease,
        string memory _hospital,
        string memory _date,
        string memory _time
    ) public {
        HospitalRecord memory newRecord = HospitalRecord(
            _disease,
            _hospital,
            _date,
            _time
        );
        hospitalRecords[msg.sender].push(newRecord);
    }

    function getRecord(address _address)
        public
        view
        returns (
            string memory disease,
            string memory hospital,
            string memory date,
            string memory time
        )
    {
        HospitalRecord memory record = hospitalRecords[_address];
        return (record.disease, record.hospital, record.date, record.time);
    }

    function createReport() public isOwner {
        idCount += 1;
        require(msg.sender == owner);
        _mint(owner, idCount, 1, "");
    }

    function burnNFT(address _address, uint256 _id) public isOwner {
        _burn(_address, _id, 1);
    }

    function viewReports() public view isOwner returns (address[] memory) {
        return (reports);
    }
}
