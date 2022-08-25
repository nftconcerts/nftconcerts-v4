import editionDrop from "./getContract.mjs";

const setNFTclaim = async (tokenId, claimConditions) => {
  try {
    await editionDrop.claimConditions.set(tokenId, claimConditions);
    console.log("Claim conditions set");
  } catch (error) {
    console.log("Failed to set claim conditions.");
  }
};

export default setNFTclaim;
