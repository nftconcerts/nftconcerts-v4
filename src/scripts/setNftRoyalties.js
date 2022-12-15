import editionDrop from "./getContract.mjs";

const setNFTroyalties = async (tokenId, resalefee, uploaderAddress) => {
  var fee = parseInt(resalefee) * 100;
  var realFee = fee + 500;
  await (
    await editionDrop
  ).royalties.setTokenRoyaltyInfo(tokenId, {
    seller_fee_basis_points: realFee,
    fee_recipient: "0x478bF0bedd29CA15cF34611C965F6F39FEcebF7F",
  });
  console.log("royalties updated");
};

export default setNFTroyalties;
