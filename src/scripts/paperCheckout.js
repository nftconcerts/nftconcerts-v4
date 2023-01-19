const paperCheckout = async (token, wallet, email, mintQty) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_PAPER_API}`,
      origin: "https://nftconcerts.com",
    },
    body: JSON.stringify({
      quantity: mintQty,
      metadata: {},
      expiresInMinutes: 15,
      usePaperKey: false,
      hideApplePayGooglePay: false,
      walletAddress: wallet,
      contractArgs: { tokenId: token.toString() },
      email: email,
      contractId: "0ccff489-72f0-489b-a885-dc50129c2f45",
    }),
  };
  console.log(options);
  return fetch(
    "https://cors-anywhere.herokuapp.com/https://paper.xyz/api/2022-08-12/checkout-sdk-intent",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response.sdkClientSecret;
    })
    .catch((err) => console.error(err));
};

export default paperCheckout;
