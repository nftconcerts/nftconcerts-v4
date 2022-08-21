import { ThirdwebSDK, ChainId } from "@thirdweb-dev/sdk";

// load your private key in a secure way (env variable, never commited to git)
const privateKey = process.env.REACT_APP_NFTCONCERTS_ETH_PK;
// instantiate the SDK based on your private key, with the desired chain to connect to
const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "mainnet");

// Set variable for the edition drop contract address which can be found after creating an edition drop in the dashboard
export const editionDropAddress = "0x1A36D3eC36e258E85E6aC9c01872C9fF730Fc2E4";
// Initialize the edition drop module with the contract address
const editionDrop = sdk.getEditionDrop(editionDropAddress);

export default editionDrop;
