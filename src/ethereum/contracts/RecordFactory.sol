//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

import "./Record.sol";

contract RecordFactory {
    // Definition of the owner address and the array with the created records
    address public owner;
    address[] records;

    // Checks if the owner is the one who calls the contract
    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    // Sign the owner to the one who calls the contract
    constructor() {
        owner = msg.sender;
    }

    // Storage the record data
    struct HospitalRecord {
        string disease;
        string hospital;
        string date;
        string time;
    }

    event NewRecord(address);

    // Bind the address to the record datas defined
    mapping(address => HospitalRecord[]) public hospitalRecords;

    // Generate the record based on the record data structure defined
    function generateRecord(
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

    // Get all the information storaged on a specific record
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

    // NFT mint with the photo and metadate of the record to IPFS
    function createRecord(string memory _ipfsLink) public isOwner {
        Record mintRecord = new Record(_ipfsLink, owner);

        emit NewRecord(address(mintRecord));

        records.push(address(mintRecord));
    }

    // Get all the addresses of the records created
    function viewRecords() public view isOwner returns (address[] memory) {
        return (records);
    }
}
