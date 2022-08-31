import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// load your private key in a secure way (env variable, never commited to git)
const privateKey = process.env.REACT_APP_NFTCONCERTS_ETH_PK;
// instantiate the SDK based on your private key, with the desired chain to connect to
const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "mainnet");

// Set variable for the edition drop contract address which can be found after creating an edition drop in the dashboard
export const editionDropAddress = "0x878D3F87C163951Ef2923D09859Aff45Dc34a45a";
// Initialize the edition drop module with the contract address
const editionDrop = sdk.getEditionDrop(editionDropAddress);

export default editionDrop;
