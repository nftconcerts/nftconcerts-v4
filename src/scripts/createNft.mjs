import editionDrop from "./getContract.mjs";

const createNFT = async (
  concertName,
  concertArtist,
  concertDescription,
  concertTokenImage
) => {
  try {
    var dropData = {
      name: { concertName },
      artist: { concertArtist },
      description: { concertDescription },
      image: { concertTokenImage },
    };
    var datastring = JSON.stringify(dropData);
    console.log(dropData);
    await editionDrop.createBatch([datastring]);
    console.log("✅ Successfully created a new NFT!");
  } catch (error) {
    console.error("Failed to create the new NFT. Error: ", error);
  }
};

export default createNFT;
