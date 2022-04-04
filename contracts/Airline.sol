// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract Airline {
    address public owner;
    struct Customer {
        uint256 loyaltyPoints;
        uint256 totalFlights;
    }

    struct Flight {
        string name;
        uint256 price;
    }

    uint256 etherPerPoint = 0.0005 ether;

    Flight[] public flights;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint256) public customerTotalFlights;

    event FlightPurchased(
        address indexed customer,
        uint256 price,
        string flight
    );

    constructor() public {
        owner = msg.sender;
        flights.push(Flight("Tokio", 0.004 ether));
        flights.push(Flight("Munich", 0.003 ether));
        flights.push(Flight("Madrid", 0.003 ether));
    }

    function buyFlight(uint256 flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price, "Incorrect price");

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender]++;

        emit FlightPurchased(msg.sender, flight.price, flight.name);
    }

    function getTotalFlights() public view returns (uint256) {
        return flights.length;
    }

    function getRefundableEther() public view returns (uint256) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint256 etherToRefound = etherPerPoint * customer.loyaltyPoints;

        require(
            address(this).balance > etherToRefound,
            "No hay suficiente ether en el contrato para devolver"
        );
        msg.sender.transfer(etherToRefound);

        customer.loyaltyPoints = 0;
    }

    function getAirlineBalance() public view isOwner returns (uint256) {
        return address(this).balance;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
}
