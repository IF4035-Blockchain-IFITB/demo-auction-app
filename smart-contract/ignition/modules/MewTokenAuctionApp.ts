import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const ONE_GWEI: bigint = 1_000_000_000n;
const ONE_ETH: bigint = 1_000_000_000_000n;

const MewAuctionApp = buildModule("MewAuctionModule", (m) => {
  const adminAddress = ethers.getAddress(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
  const initialToken = 1000n * ONE_ETH;
  const minimalBid = ONE_GWEI;

  const mewToken = m.contract("MewToken", [adminAddress, initialToken]);

  const auctionModule = m.contract("MewTokenAuctionApp", [
    mewToken,
    adminAddress,
    minimalBid,
  ]);

  return { auctionModule, mewToken };
});

export default MewAuctionApp;
