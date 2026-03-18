// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {

    enum Role { None, Manufacturer, Distributor, Retailer }

    constructor() {
        // Auto-assign deployer as Manufacturer
        roles[msg.sender] = Role.Manufacturer;
    }

    struct Product {
        uint id;
        string name;
        address manufacturer;
        address currentOwner;
        string location;
    }

    struct History {
        string location;
        uint timestamp;
        address updatedBy;
    }

    mapping(address => Role) public roles;
    mapping(uint => Product) public products;
    mapping(uint => History[]) public productHistory;

    modifier onlyManufacturer() {
        require(roles[msg.sender] == Role.Manufacturer, "Not manufacturer");
        _;
    }

    // Optional: keep if needed
    function assignRole(address user, Role role) public {
        roles[user] = role;
    }

    function addProduct(
        uint _id,
        string memory _name,
        string memory _location
    ) public onlyManufacturer {

        require(products[_id].id == 0, "Product already exists");

        products[_id] = Product({
            id: _id,
            name: _name,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            location: _location
        });

        productHistory[_id].push(
            History(_location, block.timestamp, msg.sender)
        );
    }

    function transferProduct(
        uint _id,
        address _newOwner,
        string memory _location
    ) public {

        require(products[_id].id != 0, "Product not found");

        Product storage p = products[_id];

        // ✅ REMOVED ownership restriction (IMPORTANT FIX)

        // Auto-assign roles dynamically
        if (roles[_newOwner] == Role.None) {
            if (roles[msg.sender] == Role.Manufacturer) {
                roles[_newOwner] = Role.Distributor;
            } else {
                roles[_newOwner] = Role.Retailer;
            }
        }

        p.currentOwner = _newOwner;
        p.location = _location;

        productHistory[_id].push(
            History(_location, block.timestamp, msg.sender)
        );
    }

    function getProduct(uint _id)
        public
        view
        returns(uint,string memory,address,address,string memory)
    {
        Product memory p = products[_id];

        return (
            p.id,
            p.name,
            p.manufacturer,
            p.currentOwner,
            p.location
        );
    }

    function getProductHistory(uint _id)
        public
        view
        returns(History[] memory)
    {
        return productHistory[_id];
    }
}