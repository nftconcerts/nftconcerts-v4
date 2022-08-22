export const GetUSDExchangeRate = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.USD;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const GetETHExchangeRate = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=USD",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.ETH;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const GetMaticUSDExchangeRate = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=MATIC",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.USD;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const getGas = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.REACT_APP_ETHERSCAN_API_TOKEN}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.result.ProposeGasPrice;
    })
    .catch((error) => {
      return "error", error;
    });
};
