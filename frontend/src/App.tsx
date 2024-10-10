import { Box, Text, Image, Input, Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import cat from "./assets/cat.png";
import { useWeb3 } from "./hooks/useAccount";
import {
  getGasPrice,
  getMaxBidAmount,
  bid as appBid,
  getWinner,
  withdraw as appWithdraw,
  endAuction as appEndAuction,
} from "./eth/app";

function App() {
  const { account, connect, disconnect, web3 } = useWeb3();
  const [highestPrice, setHighestPrice] = useState("0");
  const [bidAmount, setBidAmount] = useState("");
  const [gasPriceTime, setGasPriceTime] = useState(0);
  const [winner, setWinner] = useState("");

  const toast = useToast();

  async function updatePrice() {
    if (web3) {
      const price = await getMaxBidAmount(web3);
      console.log(price);
      setHighestPrice(price.toString());
    }
  }

  async function updateGasPriceTime() {
    if (web3) {
      const price = await getGasPrice(web3);
      setGasPriceTime(Number(price) / 1_000_000_000);
    }
  }

  async function updateWinner() {
    if (web3) {
      const winner = await getWinner(web3);
      setWinner(winner);
    }
  }

  async function endAuction() {
    if (web3 && account) {
      try {
        await appEndAuction(web3, account);
        toast({
          title: "Auction ended",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } catch (e) {
        console.error(e);
        toast({
          position: "top",
          title: "Error when trying to end the auction",
          description: (e as Error).message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      alert("Please connect your account first");
    }
  }

  async function withdraw() {
    if (web3 && account) {
      try {
        await appWithdraw(web3, account);
        toast({
          title: "Withdraw success",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } catch (e) {
        console.error(e);
        toast({
          position: "top",
          title: "Error when trying to withdraw",
          description: (e as Error).message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      alert("Please connect your account first");
    }
  }

  async function bid() {
    if (web3 && account) {
      if (!bidAmount) {
        toast({
          title: "Please insert your offer",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        await appBid(web3, account, Number(bidAmount));
        toast({
          title: "Bid success",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } catch (e) {
        console.error(e);
        toast({
          position: "top",
          title: "Error when trying to bid",
          description: (e as Error).message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      alert("Please connect your account first");
    }
  }

  useEffect(() => {
    updatePrice();
  }, [web3]);

  useEffect(() => {
    const int = setInterval(() => {
      updateGasPriceTime();
      updatePrice();
      updateWinner();
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, [web3]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center">
      <Box padding={4} backgroundColor="blue.500" color="white" display="flex">
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            Auction App
          </Text>
        </Box>
        <Box marginLeft="auto" display="flex" alignItems="center">
          {account ? (
            <Box>
              <Box>Account: {account}</Box>
            </Box>
          ) : (
            <Box>
              <Button onClick={connect}>Login</Button>
            </Box>
          )}
        </Box>
        {account && (
          <Box marginLeft={2}>
            <Button onClick={disconnect}>Logout</Button>
          </Box>
        )}
      </Box>
      <Box
        padding={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box
          display="flex"
          textAlign="center"
          flexDirection="column"
          marginBottom={4}
        >
          <Text fontSize="2xl" marginBottom={3}>
            Current Auction Object
          </Text>
          <Image src={cat} alt="cat" marginBottom={3} />
          <Text fontSize="2xl">Cat</Text>
          <Text fontSize="2xl">Highest Price : {highestPrice} ETH</Text>
          {winner != "0x0000000000000000000000000000000000000000" && (
            <Text fontSize="xl">Winner : {winner}</Text>
          )}
        </Box>
        <Box minWidth="25%">
          <Text fontSize="2xl" marginBottom={3}>
            Insert your offer
          </Text>
          <Box>
            <Input
              placeholder="Your offer (ETH)"
              value={bidAmount}
              type="number"
              onChange={(e) => setBidAmount(e.target.value)}
            />
          </Box>
          <Text>Gas Price: {gasPriceTime} gwei</Text>
          <Box marginTop={3} display="flex" gap={3}>
            <Button onClick={bid}>Submit</Button>
            <Button onClick={withdraw}>Withdraw</Button>
            <Button onClick={endAuction}>End Auction</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
