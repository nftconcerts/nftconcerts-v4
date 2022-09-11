import React from "react";
import { ethers } from "ethers";
const network = "homestead";

const provider = new ethers.getDefaultProvider(network, {
  infura: "fcd4dab547d1439890dab8df19f4f457",
});
const checkEns = async (wallet) => {
  var name = await provider.lookupAddress(wallet);
  console.log("ENS Name", name);
  return name;
};

export default checkEns;
