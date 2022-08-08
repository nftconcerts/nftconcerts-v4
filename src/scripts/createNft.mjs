import editionDrop from "./getContract.mjs";

const createNFT = async (
  concertID,
  concertName,
  concertArtist,
  concertDescription,
  concertTokenImage
) => {
  try {
    await editionDrop.createBatch([
      {
        name: { concertName },
        artist: { concertArtist },
        description: { concertDescription },
        // Get the NFT from a file uploaded to IPFS
        image: { concertTokenImage },
      },
    ]);
    console.log("✅ Successfully created a new NFT!");
  } catch (error) {
    console.error("Failed to create the new NFT. Error: ", error);
  }
};

export default createNFT;
