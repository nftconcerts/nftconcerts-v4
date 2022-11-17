import React from "react";

const paperCheckoutProduction = async (token, wallet, email, mintQty) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_PAPER_API}`,
    },
    body: JSON.stringify({
      quantity: mintQty,
      metadata: {},
      expiresInMinutes: 15,
      usePaperKey: false,
      hideApplePayGooglePay: false,
      walletAddress: wallet,
      contractArgs: { listingId: token.toString() },
      email: email,
      contractId: "42cf3c44-e30b-4931-b1c8-50580fb4d633",
    }),
  };
  console.log(options);
  return fetch("https://paper.xyz/api/2022-08-12/checkout-sdk-intent", options)
    .then((response) => response.json())
    .then((response) => {
      return response.sdkClientSecret;
    })
    .catch((err) => console.error(err));
};

export default paperCheckoutProduction;
