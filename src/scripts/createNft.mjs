import editionDrop from "./getContract.mjs";

const createNFT = async (
  concertName,
  concertArtist,
  concertDescription,
  ipfsUrl,
  concertReleaseDate,
  concertPerformanceDate,
  concertVenue,
  concertLocation,
  concertRecordingType,
  concertNumSongs
) => {
  try {
    var releaseDate = new Date(concertReleaseDate);
    var releaseDateTime = releaseDate.getTime();
    var performanceDate = new Date(concertPerformanceDate);
    var performanceDateTime = performanceDate.getTime();
    var dropData = [
      {
        name: `${concertName} by ${concertArtist}`,
        description: `${concertDescription}`,
        image: `${ipfsUrl}`,
        external_url: "https://nftconcerts.com",
        attributes: [
          {
            trait_type: "Artist",
            value: `${concertArtist}`,
          },
          {
            display_type: "date",
            trait_type: "NFT Concert Release Date",
            value: `${releaseDateTime}`,
          },
          {
            display_type: "date",
            trait_type: "Live Performance Date",
            value: `${performanceDateTime}`,
          },
          {
            trait_type: "Venue",
            value: `${concertVenue}`,
          },
          {
            trait_type: "Location",
            value: `${concertLocation}`,
          },
          {
            trait_type: "Recording Type",
            value: `${concertRecordingType}`,
          },
          {
            display_type: "number",
            trait_type: "Number of Songs",
            value: `${concertNumSongs}`,
          },
        ],
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
