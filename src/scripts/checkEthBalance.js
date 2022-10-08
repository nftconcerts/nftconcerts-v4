import React from "react";
import { ethers } from "ethers";
const network = "homestead";

const provider = new ethers.getDefaultProvider(network, {
  infura: "fcd4dab547d1439890dab8df19f4f457",
});
const checkEthBalance = async (wallet) => {
  let balance = await provider.getBalance(wallet);
  balance = ethers.utils.formatEther(balance, 18);

  return balance.toString();
};

export default checkEthBalance;
