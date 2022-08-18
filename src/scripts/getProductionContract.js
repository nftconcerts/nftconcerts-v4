import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// load your private key in a secure way (env variable, never commited to git)
const privateKey = process.env.REACT_APP_NFTCONCERTS_ETH_PK;
// instantiate the SDK based on your private key, with the desired chain to connect to
const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "mumbai");

// Set variable for the edition drop contract address which can be found after creating an edition drop in the dashboard
export const editionDropAddress = "0x007636bE8297c7511cEAb8A7de296b8708A649b2";
// Initialize the edition drop module with the contract address
const editionDrop = sdk.getEditionDrop(editionDropAddress);

export default editionDrop;
