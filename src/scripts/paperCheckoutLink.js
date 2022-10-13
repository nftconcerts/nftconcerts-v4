import { resolveObjectURL } from "buffer";
import React from "react";

const paperCheckoutLink = async (token, wallet, email, mintQty) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_PAPER_API}`,
    },
    body: JSON.stringify({
      metadata: {},
      expiresInMinutes: 15,
      usePaperKey: false,
      hideNativeMint: true,
      hidePaperWallet: true,
      hideExternalWallet: true,
      hidePayWithCard: false,
      hideApplePayGooglePay: false,
      hidePayWithCrypto: true,
      hidePayWithAfterpay: true,
      hidePayWithIdeal: true,
      sendEmailOnTransferSucceeded: true,
      limitPerTransaction: 5,
      redirectAfterPayment: false,
      contractId: "425d58db-9462-408f-900c-468469faaf0e",
      title: "NFT Concerts Checkout",
      walletAddress: wallet,
      email: email,
      quantity: mintQty,
      contractArgs: { tokenId: token.toString() },
    }),
  };
  console.log(options);
  return fetch("https://paper.xyz/api/2022-08-12/checkout-link-intent", options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      window.open(response);
      return response;
    })
    .catch((err) => console.error(err));
};

export default paperCheckoutLink;
