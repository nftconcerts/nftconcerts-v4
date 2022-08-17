import editionDrop from "./getContract.mjs";

const createNFT = async (
  concertName,
  concertArtist,
  concertDescription,
  ipfsUrl
) => {
  try {
    var dropData = [
      {
        name: `${concertName}`,
        artist: `${concertArtist}`,
        description: `${concertDescription}`,
        image: `${ipfsUrl}`,
      },
    ];

    console.log(dropData);
    const mint = await editionDrop.createBatch(dropData);
    console.log("✅ Successfully created a new NFT! #");
    console.log("mint", mint);
    return mint;
  } catch (error) {
    console.error("Failed to create the new NFT. Error: ", error);
    return alert("Failed to create the new NFT. Error: ", error);
  }
};

export default createNFT;
