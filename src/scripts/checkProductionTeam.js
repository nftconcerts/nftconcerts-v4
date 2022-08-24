import editionDrop from "./getProductionContract";
import { useState } from "react";

export default async function checkProductionTeam(address) {
  try {
    const ptBalance = await editionDrop.balanceOf(address, 0);
    const plBalance = await editionDrop.balanceOf(address, 1);
    const ptNumber = parseInt(ptBalance.toString());
    const plNumber = parseInt(plBalance.toString());
    const results = [ptNumber, plNumber];
    return results;
  } catch (err) {
    console.log("Production Check is Fucked Up", err);
    return;
  }
}
