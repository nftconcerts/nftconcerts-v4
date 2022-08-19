import editionDrop from "./getContract";
import { useState } from "react";

export default async function checkConcertOwner(address, tokenId) {
  const nftBalance = await editionDrop.balanceOf(address, tokenId);
  const nftNumber = parseInt(nftBalance.toString());
  return nftNumber;
}
