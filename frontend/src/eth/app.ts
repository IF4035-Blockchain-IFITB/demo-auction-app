import Web3 from "web3";
import MewAuctionApp from "../abi/MewAuctionApp.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function getContract(web3: Web3) {
  return new web3.eth.Contract(MewAuctionApp.abi, CONTRACT_ADDRESS);
}

export async function bid(web3: Web3, account: string, value: number) {
  const contract = getContract(web3);

  return contract.methods.newBid().send({
    from: account,
    value: web3.utils.toWei(value.toString(), "ether"),
  });
}

export async function withdraw(web3: Web3, account: string) {
  const contract = getContract(web3);

  return contract.methods.withdraw().send({
    from: account,
  });
}

export async function endAuction(web3: Web3, account: string) {
  const contract = getContract(web3);

  return contract.methods.endAuction().send({
    from: account,
  });
}

export async function getWinner(web3: Web3) {
  const contract = getContract(web3);

  return contract.methods.getWinner().call() as Promise<string>;
}

export async function getMaxBidAmount(web3: Web3) {
  const contract = getContract(web3);

  const result =
    Number(await contract.methods.getMaxBidAmount().call()) / 10 ** 18;

  return result;
}

export async function getGasPrice(web3: Web3) {
  return web3.eth.getGasPrice();
}
