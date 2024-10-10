// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./MewToken.sol";

contract MewTokenAuctionApp  {
    address private admin;
    address private winner;

    uint256 private maxbidAmount;
    address private currentWinner = address(0);
    MewToken private token;
    bool private ended = false;

    mapping(address => uint256) private bidAccount;

    constructor(address _admin, uint256 _minimalBid, MewToken _token) {
        admin = _admin;
        maxbidAmount = _minimalBid;
        token = _token;
    }

    event MewAuctionEnd(address winner);
    event MewAuctionNewBid(address user, uint256 amount);

    error MewPermissionNotAllowed();
    error MewBidAmountLessEqThanMaxBid(uint256 currentMax);
    error MewNoBalanceToWithdraw();
    error MewAuctionEnded();

    function endAuction() public {
        if (ended){
            revert MewAuctionEnded();
        }

        if (msg.sender != admin) {
            revert MewPermissionNotAllowed();
        }

        winner = msg.sender;

        emit MewAuctionEnd(winner);
        ended = true;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function getMaxBidAmount() public view returns (uint256) {
        return maxbidAmount;
    }

    function newBid(uint256 bidAmount) public {
        if (ended){
            revert MewAuctionEnded();
        }

        if (bidAmount <= maxbidAmount) {
            revert MewBidAmountLessEqThanMaxBid(maxbidAmount);
        }
        
        if (currentWinner != address(0)) {
            bidAccount[currentWinner] += maxbidAmount;
        }

        maxbidAmount = bidAmount;
        currentWinner = msg.sender;

        emit MewAuctionNewBid(currentWinner, maxbidAmount);
        
        token.transfer(address(this), bidAmount);
    }

    function withdraw() public { 
        if (bidAccount[msg.sender] == 0) {
            revert MewNoBalanceToWithdraw();
        }

        uint256 amount = bidAccount[msg.sender];
        bidAccount[msg.sender] = 0;

        token.transfer(msg.sender, amount);
    }
}