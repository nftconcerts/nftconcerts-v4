import { editionDropAddress } from "./getProductionContract";
import { useContract } from "@thirdweb-dev/react";

const CheckProductionTeam = async (address) => {
  const { contract } = useContract(editionDropAddress, "edition");
  try {
    const ptBalance = await contract.balanceOf(address, 0);
    const plBalance = await contract.balanceOf(address, 1);
    const ptNumber = parseInt(ptBalance.toString());
    const plNumber = parseInt(plBalance.toString());
    const results = [ptNumber, plNumber];
    return results;
  } catch (err) {
    return;
  }
};
export default CheckProductionTeam;
