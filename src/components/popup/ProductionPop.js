import React from "react";
import { useEffect, useState } from "react";
import { ref as dRef, onValue } from "firebase/database";
import { db, truncateAddress } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./MintPopUp.css";
import "./ProductionPop.css";
import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
  useContract,
  useCoinbaseWallet,
  useWalletConnect,
} from "@thirdweb-dev/react";
import { GetUSDExchangeRate } from "../api";
import { marketplaceAddress } from "../../scripts/getProductionContract";
import sendProductionMintEmails from "../../scripts/sendProductionMintEmails";
import paperCheckoutProduction from "../../scripts/paperCheckoutProduction";
import PopLogin from "./PopLogin";
import PopRegister from "./PopRegister";

const ProductionPop = ({
  currentUser,
  productionType,
  productionID,
  setShowProductionPop,
  setCurrentUser,
}) => {
  let navigate = useNavigate();
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const networkMistmatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState();
  const [mintQty, setMintQty] = useState(1);
  const [newUser, setNewUser] = useState(false);
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithWalletConnect = useWalletConnect();

  //scroll to top to keep in view
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  //download User Data
  useEffect(() => {
    if (currentUser) {
      var userDataRef2 = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef2, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  // handle the quantity toggle
  const [showMaxLimit, setShowMaxLimit] = useState(false);
  const [maxLimit, setMaxLimit] = useState(25);
  const mintPlus = () => {
    if (mintQty < maxLimit) {
      setMintQty(mintQty + 1);
    } else if (mintQty === maxLimit) {
      setShowMaxLimit(true);
    }
  };
  const mintMinus = () => {
    setShowMaxLimit(false);
    if (mintQty > 1) {
      setMintQty(mintQty - 1);
    }
  };

  //eth to usd api call

  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setPriceInUSD(parseFloat(res));
    });
  }, []);

  const [showPurchased, setShowPurchased] = useState(false);
  const [purchased, setPurchased] = useState(false);

  //mint the nft, transaction data
  const { contract } = useContract(marketplaceAddress, "marketplace");
  const [claimError, setClaimError] = useState(false);
  const [tx, setTx] = useState();
  var transactionLink =
    "https://etherscan.io/tx/" + tx?.receipt.transactionHash;

  const [claiming, setClaiming] = useState("");

  const [mintPrice, setMintPrice] = useState();
  const [listingID, setListingID] = useState(3);
  const [tokenName, setTokenName] = useState("NFT Concerts Production Team");
  const [tokenSupply, setTokenSupply] = useState(5000);

  useEffect(() => {
    if (productionID === 0) {
      setMintPrice(0.05 * mintQty);
      setListingID(1);
      setTokenName("NFT Concerts Production Team");
      setMaxLimit(25);
      setTokenSupply(5000);
    } else if (productionID === 1) {
      setMintPrice(0.5 * mintQty);
      setListingID(2);
      setTokenName("NFT Concerts Production Lead");
      setMaxLimit(5);
      setTokenSupply(55);
    }
  }, [productionID, mintQty]);
  //claim the nft
  const claimButton = async () => {
    setClaiming(true);
    setClaimError(false);
    try {
      var result = await contract?.buyoutListing(listingID, mintQty);
      setTx(result);
      setClaiming(false);
      setPurchased(true);
      setShowPurchased(true);
      let currentEmail = userData.email;
      var template_params = {
        buyerName: userData.name,
        buyerEmail: currentEmail,
        mintQty: mintQty,
        productionType: productionType,
        mintPrice: mintPrice,
        concertName: tokenName,
        concertSupply: tokenSupply,
      };
      sendProductionMintEmails(template_params);
    } catch (error) {
      console.log("Failed to claim. Error: ", error);
      console.log(error.message);
      setClaiming(false);
      setClaimError(true);
    }
  };

  //mint with credit card
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [paperSecret, setPaperSecret] = useState();

  const launchCredit = async () => {
    setShowCreditCard(true);
    setPaperSecret(
      await paperCheckoutProduction(
        listingID,
        userData?.walletID,
        userData?.email,
        mintQty
      )
    );
  };

  //no user logged in - register or login to continue
  const noUserWelcomePage = () => {
    return (
      <>
        <h3 className="welcome__motto login__motto">
          Register or Login to Mint
        </h3>
        <div className="mp__login__buttons__div">
          <button
            onClick={() => {
              setShowRegister(true);
            }}
            className="buy__now my__button preview__button buy__now__button mintp__button mintp__register__button"
          >
            <div className="play__now__button__div">Register Now</div>
          </button>
          <button
            onClick={() => {
              setShowLogin(true);
            }}
            className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button"
          >
            <div className="play__now__button__div">Login</div>
          </button>
        </div>
        <p>
          On Mobile?{" "}
          <a
            href="https://metamask.app.link/dapp/nftconcerts.com"
            target="_blank"
            rel="noreferrer"
          >
            Open in MetaMask
          </a>
        </p>
      </>
    );
  };

  //show completed purhcase info and invite to watch
  const purchasedInfo = () => {
    return (
      <>
        <div className="mint__pop__purchased__div">
          {(productionID === 0 && (
            <>
              <h3 className="purchased__pop__up__heading">
                Congratulations, you've successfuly joined the
                <br />
              </h3>
              <h1 className="purchased__title">NFT Concerts Production Team</h1>
              <img
                src="/media/production-team.jpg"
                className="production__pop__image"
                alt="NFT Concert Token"
              />
              <h3 className="motto">You Rock!</h3>
              <p className="motto">
                Out of <span className="bold__text">5000</span> Memberships, You
                Own <span className="bold__text">{mintQty}</span>
              </p>
              <button
                className="buy__now my__button preview__button buy__now__button"
                onClick={() => {
                  navigate("/my-account");
                  setShowProductionPop(false);
                }}
              >
                <div className="play__now__button__div">
                  View Account{" "}
                  <i className="fa-solid fa-wrench play__now__icon" />
                </div>
              </button>
            </>
          )) || (
            <>
              <h3 className="purchased__pop__up__heading">
                Congratulations, you''re now a <br />
              </h3>
              <h1 className="purchased__title">NFT Concerts Production Lead</h1>
              <img
                src="/media/production-lead.jpg"
                className="production__pop__image"
                alt="NFT Concert Token"
              />
              <h3 className="motto">You Rock!</h3>
              <p className="motto">
                Out of <span className="bold__text">55</span> Spots, You Control{" "}
                <span className="bold__text">{mintQty}</span>
              </p>
              <button
                className="buy__now my__button preview__button buy__now__button"
                onClick={() => {
                  navigate("/my-account");
                  setShowProductionPop(false);
                }}
              >
                <div className="play__now__button__div">
                  View Account{" "}
                  <i className="fa-solid fa-walkie-talkie play__now__icon" />
                </div>
              </button>
            </>
          )}

          {purchased && (
            <div>
              <a
                href={transactionLink}
                target="_blank"
                className="dark__link"
                rel="noreferrer"
              >
                View Your Receipt - TX:{" "}
                {truncateAddress(tx?.receipt.transactionHash)}
              </a>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="welcome__reveal__div">
        <div className="mint__welcome__pop__up__overlay__div">
          <div className="mint__purchased__pop__up__div">
            <div className="close__pop__up__div">
              <i
                onClick={() => {
                  setShowProductionPop(false);
                  if (newUser) {
                    window.location.reload();
                  }
                }}
                className="fa-solid fa-xmark close__icon__button"
              />{" "}
            </div>
            {showPurchased && purchasedInfo()}

            {(showRegister && !showPurchased && (
              <div className="mint__pop__register__div">
                <img
                  src="/media/nftc-logo.png"
                  className="mint__pop__logo"
                  alt="nftc logo"
                />
                <PopRegister
                  setCurrentUser={setCurrentUser}
                  setShowRegister={setShowRegister}
                  setNewUser={setNewUser}
                  setShowLogin={setShowLogin}
                />
              </div>
            )) || (
              <>
                {!showPurchased && (
                  <>
                    {" "}
                    <div className="mint__pop__header">
                      <>
                        <div className="mint__pop__header__col1">
                          <h1 className="minting__title">Minting</h1>
                          {(productionID === 0 && (
                            <>
                              <img
                                src="/media/production-team.jpg"
                                className="mint__prod__pop__img show__500"
                                alt="NFT Concet Token"
                              ></img>
                              <h1 className="mint__pop__title">
                                NFT Concerts Production Team
                              </h1>
                            </>
                          )) || (
                            <>
                              {" "}
                              <img
                                src="/media/production-lead.jpg"
                                className="mint__prod__pop__img show__500"
                                alt="NFT Concet Token"
                              ></img>
                              <h1 className="mint__pop__title">
                                NFT Concerts Production Lead
                              </h1>
                            </>
                          )}
                        </div>
                        <div className="mint__pop__header__col2">
                          {(productionID === 0 && (
                            <>
                              <img
                                src="/media/production-team.jpg"
                                className="mint__prod__pop__img hide__500"
                                alt="NFT Concet Token"
                              />{" "}
                            </>
                          )) || (
                            <>
                              <img
                                src="/media/production-lead.jpg"
                                className="mint__prod__pop__img hide__500"
                                alt="NFT Concet Token"
                              />
                            </>
                          )}
                        </div>
                      </>
                    </div>
                    {(!showCreditCard && (
                      <div className="mint__pop__content">
                        {(!currentUser && (
                          <>
                            {(showLogin && (
                              <PopLogin
                                setCurrentUser={setCurrentUser}
                                setNewUser={setNewUser}
                                setShowLogin={setShowLogin}
                              />
                            )) ||
                              noUserWelcomePage()}
                          </>
                        )) || (
                          <>
                            {(claiming && (
                              <div className="pop__img__replacement">
                                <div className="row__center">
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                </div>
                              </div>
                            )) || (
                              <>
                                <div className="price__pop__div">
                                  Price:{" "}
                                  <img
                                    src="/media/eth-logo.png"
                                    height={30}
                                    className="c__eth__logo white__eth__logo"
                                    alt="eth logo"
                                  />
                                  <span className="price__pop__price__highlight">
                                    {mintPrice?.toFixed(2)}
                                  </span>{" "}
                                  <span className="mint__pop__usd__price">
                                    (${(priceInUSD * mintPrice).toFixed(2)})
                                  </span>
                                </div>
                                <div className="quantity__pop__div">
                                  <div
                                    className="quantity__pop__button"
                                    onClick={mintMinus}
                                  >
                                    <i className="fa-solid fa-minus" />{" "}
                                  </div>
                                  <div>
                                    Quantity: {mintQty}{" "}
                                    {showMaxLimit && (
                                      <span className="max__limit">
                                        (Max {maxLimit})
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    className="quantity__pop__button"
                                    onClick={mintPlus}
                                  >
                                    <i className="fa-solid fa-plus" />{" "}
                                  </div>
                                </div>
                              </>
                            )}
                            {(userData?.connectionType !== "magic" && (
                              <>
                                <div className="mp__login__buttons__div">
                                  <button
                                    onClick={() => {
                                      launchCredit();
                                    }}
                                    className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button hide__500"
                                  >
                                    <div className="play__now__button__div">
                                      Mint with Credit Card
                                    </div>
                                  </button>
                                  {(networkMistmatch && (
                                    <button
                                      onClick={() =>
                                        switchNetwork(ChainId.Mainnet)
                                      }
                                      className="buy__now my__button preview__button buy__now__button mintp__button"
                                    >
                                      <div className="play__now__button__div">
                                        Switch to Ethereum
                                      </div>
                                    </button>
                                  )) || (
                                    <>
                                      {(address && (
                                        <button
                                          onClick={claimButton}
                                          className="buy__now my__button preview__button buy__now__button mintp__button mintp__register__button "
                                        >
                                          <div className="play__now__button__div">
                                            Mint Now
                                          </div>
                                        </button>
                                      )) || (
                                        <>
                                          {userData?.connectionType ===
                                            "metamask" && (
                                            <button
                                              onClick={connectWithMetamask}
                                              className="buy__now my__button preview__button buy__now__button mint__pop__button metamask__pop__button mintp__button"
                                            >
                                              <div className="play__now__button__div">
                                                Connect to Metamask
                                              </div>
                                            </button>
                                          )}
                                          {userData?.connectionType ===
                                            "walletconnect" && (
                                            <button
                                              onClick={connectWithWalletConnect}
                                              className="buy__now my__button preview__button buy__now__button mint__pop__button walletconnect__pop__button mintp__button"
                                            >
                                              <div className="play__now__button__div">
                                                Connect to Wallet Connect
                                              </div>
                                            </button>
                                          )}
                                          {userData?.connectionType ===
                                            "coinbase" && (
                                            <button
                                              onClick={
                                                connectWithCoinbaseWallet
                                              }
                                              className="buy__now my__button preview__button buy__now__button mint__pop__button coinbase__pop__button mintp__button"
                                            >
                                              <div className="play__now__button__div">
                                                Connect to Coinbase
                                              </div>
                                            </button>
                                          )}
                                        </>
                                      )}
                                      <button
                                        onClick={() => {
                                          launchCredit();
                                        }}
                                        className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button show__500"
                                      >
                                        <div className="play__now__button__div">
                                          Mint with Credit Card
                                        </div>
                                      </button>
                                    </>
                                  )}
                                </div>
                                {claimError && (
                                  <>
                                    <p>
                                      Error with Mint. Please ensure sufficient
                                      ETH balance.
                                    </p>
                                    {userData?.connectionType ===
                                      "metamask" && (
                                      <p>
                                        To Mint on Mobile,{" "}
                                        <a
                                          href="https://metamask.app.link/dapp/nftconcerts.com"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Open in MetaMask
                                        </a>
                                      </p>
                                    )}
                                  </>
                                )}
                              </>
                            )) || (
                              <>
                                {" "}
                                <button
                                  onClick={() => {
                                    launchCredit();
                                  }}
                                  className="buy__now my__button preview__button buy__now__button mintp__button mintp__register__button "
                                >
                                  <div className="play__now__button__div">
                                    Mint Now
                                  </div>
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )) || (
                      <div className="credit__card__div">
                        {(paperSecret && (
                          <>
                            {" "}
                            <div className="credit__info__div">
                              <div className="price__pop__div credit__price">
                                Price:{" "}
                                <img
                                  src="/media/eth-logo.png"
                                  height={25}
                                  className="c__eth__logo"
                                  alt="eth logo"
                                />
                                {mintPrice?.toFixed(2)}{" "}
                                <span className="mint__pop__usd__price credit__usd__price">
                                  (${(priceInUSD * mintPrice).toFixed(2)})
                                </span>{" "}
                                + Gas Fees{" "}
                                <span className="mint__pop__usd__price credit__usd__price">
                                  (TBD)
                                </span>
                              </div>
                              <a
                                href={
                                  "https://checkout.nftconcerts.com/?s=" +
                                  paperSecret +
                                  "&cname=" +
                                  encodeURIComponent("Production Team") +
                                  "&img=" +
                                  encodeURIComponent(
                                    "https://nftconcerts.com/media/production-team.jpg"
                                  ) +
                                  "&price=" +
                                  mintPrice +
                                  "&id=" +
                                  productionID +
                                  "&qty=" +
                                  mintQty
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <button className="buy__now my__button preview__button buy__now__button ">
                                  <div className="play__now__button__div">
                                    Checkout Now
                                  </div>
                                </button>
                              </a>
                            </div>
                          </>
                        )) || (
                          <>
                            <p className="credit__loading__p">
                              Checkout Loading...
                            </p>
                          </>
                        )}

                        <div
                          className="text__only__button"
                          onClick={() => {
                            setShowCreditCard(false);
                            setPaperSecret("");
                          }}
                        >
                          Go Back
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            <p className="motto"> </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductionPop;
