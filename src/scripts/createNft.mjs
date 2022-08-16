import editionDrop from "./getContract.mjs";

const createNFT = async (
  concertName,
  concertArtist,
  concertDescription,
  concertTokenImage
) => {
  try {
    var dropData = [
      {
        name: `${concertName}`,
        artist: `${concertArtist}`,
        description: `${concertDescription}`,
        image: `${concertTokenImage}`,
      },
    ];

    console.log(dropData);
    const mint = await editionDrop.createBatch(dropData);
    const firstTokenId = mint[0].id;

    console.log("✅ Successfully created a new NFT! #");
    console.log("mint", mint);
    return mint;
  } catch (error) {
    console.error("Failed to create the new NFT. Error: ", error);
    return alert("Failed to create the new NFT. Error: ", error);
  }
};

export default createNFT;
