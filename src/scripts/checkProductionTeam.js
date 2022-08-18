import editionDrop from "./getProductionContract";
import { useState } from "react";

export default async function checkProductionTeam(address) {
  const ptBalance = await editionDrop.balanceOf(address, 0);
  const plBalance = await editionDrop.balanceOf(address, 1);
  const ptNumber = parseInt(ptBalance.toString());
  const plNumber = parseInt(plBalance.toString());
  const results = [ptNumber, plNumber];
  return results;
}
