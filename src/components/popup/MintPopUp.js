import React from "react";
import { useEffect, useState } from "react";
import { ref as dRef, onValue, set, runTransaction } from "firebase/database";
import { db, truncateAddress } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./MintPopUp.css";
import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
  useActiveClaimCondition,
  useContract,
  useCoinbaseWallet,
  useWalletConnect,
} from "@thirdweb-dev/react";
import dateFormat from "dateformat";
import { GetUSDExchangeRate } from "../api";
import { editionDropAddress } from "../../scripts/getContract.mjs";
import { ethers } from "ethers";
import sendMintEmails from "../../scripts/sendMintEmails";
import paperCheckout from "../../scripts/paperCheckout";
import PopRegister from "./PopRegister";
import PopLogin from "./PopLogin";

const MintPopUp = ({
  currentUser,
  concertData,
  concertID,
  setShowMintPopUp,
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

  //handle quantity adjusments
  const [showMaxLimit, setShowMaxLimit] = useState(false);
  const mintPlus = () => {
    if (mintQty < 5) {
      setMintQty(mintQty + 1);
    } else if (mintQty === 5) {
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
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  //price formatting
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice)) {
      var newPrice = parseFloat(concertData?.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (concertData?.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

  const [showPurchased, setShowPurchased] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // Check if user owns the current NFT Concert
  const editionDropped = useContract(editionDropAddress);
  const [owned, setOwned] = useState(0);

  useEffect(() => {
    const checkIfOwned = async (userAddress) => {
      try {
        const balance = await editionDropped.balanceOf(userAddress, concertID);
        const balanceNum = parseInt(balance.toString());
        setOwned(balanceNum);
      } catch (err) {
        console.log("Fucked up check.");
      }
    };
    if (userData?.walletID) {
      checkIfOwned(userData?.walletID);
    }
  }, [userData?.walletID, editionDropped, concertID]);

  //mint the nft, transaction data

  const [claimError, setClaimError] = useState(false);
  const [tx, setTx] = useState();
  var transactionLink =
    "https://etherscan.io/tx/" + tx?.receipt.transactionHash;

  const [claiming, setClaiming] = useState("");
  const { contract } = useContract(editionDropAddress);
  let bigId = ethers.BigNumber.from(concertID);
  const { data: activeClaimCondition } = useActiveClaimCondition(
    contract,
    bigId
  );
  let mintPrice = mintQty * parseFloat(concertData?.concertPrice);
  //claim the nft
  const claimButton = async () => {
    setClaiming(true);
    setClaimError(false);
    try {
      var result = await contract?.claim(concertID, mintQty);
      setTx(result);
      setClaiming(false);
      setPurchased(true);
      setShowPurchased(true);
      setOwned(owned + 1);
      pushAudience(result);
      let currentEmail = userData.email;
      var template_params = {
        artistemail: concertData.uploaderEmail,
        artist: concertData.concertArtist,
        concertName: concertData.concertName,
        buyerName: userData.name,
        buyerEmail: currentEmail,
        mintQty: mintQty,
        mintPrice: mintPrice,
        remaining: activeClaimCondition?.availableSupply,
        concertSupply: concertData.concertSupply,
      };
      sendMintEmails(template_params);
    } catch (error) {
      console.log("Failed to claim. Error: ", error);
      console.log(error.message);
      setClaiming(false);
      setClaimError(true);
    }
  };

  //after transaction, get mint ID then push user to DB based on Mint Qty
  const pushAudience = (tx) => {
    console.log("push Aud with tx: ", tx?.receipt.transactionHash);
    console.log("tx: ", tx);
    var mintIdRef = dRef(db, "concerts/" + concertID + "/mintID");
    for (var i = 0; i < mintQty; i++) {
      runTransaction(mintIdRef, (mintID) => {
        if (mintID) {
          pushAudienceMember(mintID, tx?.receipt.transactionHash);
          mintID++;
        }
        return mintID;
      });
    }
  };

  //push audience member
  const pushAudienceMember = (mintID, tx) => {
    console.log("push AudM with id: ", mintID, " & tx: ", tx);
    var audienceRef = dRef(db, "concerts/" + concertID + "/sales/" + mintID);
    var mintDate = new Date();
    var mintDateString = dateFormat(mintDate, "mm/dd/yyyy, hh:MM:ss TT Z ");
    set(audienceRef, {
      buyerUID: currentUser.user.uid,
      tx: tx,
      date: mintDateString,
    });
  };

  //mint with credit card
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [paperSecret, setPaperSecret] = useState();

  const launchCredit = async () => {
    setShowCreditCard(true);
    setPaperSecret(
      await paperCheckout(
        concertID,
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
        <div className="mint__pop__header">
          <>
            <div className="mint__pop__header__col1">
              <h3 className="purchased__pop__up__heading">
                Congratulations, you've successfully purchased <br />
              </h3>{" "}
              <h1 className="mint__pop__title">
                {concertData?.concertName} by {concertData.concertArtist}
              </h1>
              <img
                src={concertData?.concertTokenImage}
                className="mint__pop__img show__500"
                alt="NFT Concet Token"
              ></img>
            </div>
            <div className="mint__pop__header__col2">
              <img
                src={concertData?.concertTokenImage}
                className="mint__pop__img hide__500"
                alt="NFT Concet Token"
              ></img>
            </div>
          </>
        </div>
        <div className="mint__pop__purchased__div">
          <div className="price__pop__div">
            <h3>You Own the Show</h3>
          </div>
          <p className="motto">
            Out of{" "}
            <span className="bold__text">{concertData?.concertSupply}</span>{" "}
            Copies, You Own <span className="bold__text">{owned}</span>
          </p>
          <button
            className="buy__now my__button preview__button buy__now__button play__now__button mintp__button"
            onClick={() => {
              navigate("/player/" + concertID);
            }}
          >
            <div className="play__now__button__div">
              Play Now <i className="fa-solid fa-play play__now__icon " />
            </div>
          </button>

          {purchased && (
            <div className="tx__link__div">
              <a
                href={transactionLink}
                target="_blank"
                className="tx__link"
                rel="noreferrer"
              >
                View Your Receipt - TX:{" "}
                {(tx && (
                  <>{truncateAddress(tx?.receipt.transactionHash)}</>
                )) || <>{truncateAddress("101010101010101")}</>}
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
                  setShowMintPopUp(false);
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
                <h3 className="mint__pop__logo__title">Welcome to</h3>
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
                          <img
                            src={concertData?.concertTokenImage}
                            className="mint__pop__img show__500"
                            alt="NFT Concet Token"
                          ></img>
                          <h1 className="mint__pop__title">
                            {concertData?.concertName} by{" "}
                            {concertData.concertArtist}
                          </h1>
                        </div>
                        <div className="mint__pop__header__col2">
                          <img
                            src={concertData?.concertTokenImage}
                            className="mint__pop__img hide__500"
                            alt="NFT Concet Token"
                          ></img>
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
                                    {mintQty *
                                      parseFloat(concertData?.concertPrice)}
                                  </span>{" "}
                                  <span className="mint__pop__usd__price">
                                    (${(priceInUSD * mintQty).toFixed(2)})
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
                                        (Max 5)
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
                                      className="buy__now my__button preview__button buy__now__button  mintp__button"
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
                                {mintQty *
                                  parseFloat(concertData?.concertPrice)}{" "}
                                <span className="mint__pop__usd__price credit__usd__price">
                                  (${(priceInUSD * mintQty).toFixed(2)})
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
                                  encodeURIComponent(
                                    concertData?.concertName +
                                      " by " +
                                      concertData?.concertArtist
                                  ) +
                                  "&img=" +
                                  encodeURIComponent(
                                    concertData?.concertTokenImage
                                  ) +
                                  "&price=" +
                                  mintPrice +
                                  "&id=" +
                                  concertID +
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
          </div>
        </div>
      </div>
    </>
  );
};

export default MintPopUp;
