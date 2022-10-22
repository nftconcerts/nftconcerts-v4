import React from "react";
import { ethers } from "ethers";
import editionDrop from "./getContract";
import { useActiveClaimCondition } from "@thirdweb-dev/react";

const CheckClaimCondition = async ({ id }) => {
  console.log("Checking #", id);
  let bigId = ethers.BigNumber.from(id);
  const { data: activeClaimCondition } = useActiveClaimCondition(
    editionDrop,
    bigId
  );

  return activeClaimCondition;
};

export default CheckClaimCondition;
