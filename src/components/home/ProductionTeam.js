import React, { useState, useEffect } from "react";
import Contract from "../form/Contract";
import "./ProductionTeam.css";
import { GetUSDExchangeRate } from "./../api";
import { useNavigate } from "react-router-dom";
import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
  useMarketplace,
} from "@thirdweb-dev/react";
import checkProductionTeam from "../../scripts/checkProductionTeam";
import {
  truncateAddress,
  fetchCurrentUser,
  db,
  getMobileMode,
} from "../../firebase";
import { PaperCheckout } from "@paperxyz/react-client-sdk";

import { ref as dRef, onValue, set } from "firebase/database";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const ProductionTeam = () => {
  let navigate = useNavigate();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const connectWithMetamask = useMetamask();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [pageMobileMode, setPageMobileMode] = useState(false);
  const markeplace = useMarketplace(
    "0x7B03004643624FE3013D7f9DeAf3958B5Fb7c337"
  );

  const [purchasing, setPurchasing] = useState(false);
  const [teamRemaining, setTeamRemaining] = useState(4905);
  const [leadRemaining, setLeadRemaining] = useState(53);
  //show and set quantity of of nfts ordered
  const [showQty, setShowQty] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [showLeadQty, setShowLeadQty] = useState(false);
  const [leadOrderQty, setLeadOrderQty] = useState(1);

  useEffect(() => {
    grabRemaining();
  }, [purchasing]);

  useEffect(() => {
    setPageMobileMode(getMobileMode());
  }, [networkMismatch]);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  //download User Data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  const [leadPriceInUSD, setLeadPriceInUSD] = useState("0.00");
  const [orderPriceInUSD, setOrderPriceInUSD] = useState("0.00");
  const [leadOrderPriceInUSD, setLeadOrderPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

  //check for remaining number of team and lead tokens available for sale
  const grabRemaining = async () => {
    const teamListing = await markeplace.getListing(0);
    const teamListingRemaing = teamListing?.quantity.toString();
    setTeamRemaining(teamListingRemaing);
    const leadListing = await markeplace.getListing(1);
    const leadListingRemaing = leadListing?.quantity.toString();
    setLeadRemaining(leadListingRemaing);
  };
  //price formatting
  useEffect(() => {
    if (usdExRate) {
      var newPrice = 0.005 * usdExRate;
      var orderPrice = newPrice * orderQty;
      var leadPrice = 0.5 * usdExRate;
      var leadOrderPrice = leadPrice * leadOrderQty;
      let orderRoundedPrice = orderPrice.toFixed(2);
      let roundedPrice = newPrice.toFixed(2);
      let leadRoundedPrice = leadPrice.toFixed(2);
      let leadOrderRoundedPrice = leadOrderPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
      setOrderPriceInUSD(orderRoundedPrice);
      setLeadPriceInUSD(leadRoundedPrice);
      setLeadOrderPriceInUSD(leadOrderRoundedPrice);
    } else setPriceInUSD("err");
  }, [usdExRate, orderQty, leadOrderQty]);

  //check if user is holding production team NFT
  const [productionTeam, setProductionTeam] = useState(false);
  const address = useAddress();
  const [showResult, setShowResult] = useState(false);
  const [ptBalance, setPtBalance] = useState(0);
  const [plBalance, setPlBalance] = useState(0);

  const productionCheck = async () => {
    if (address) {
      var checkResult = await checkProductionTeam(address);
      setPtBalance(checkResult[0]);
      setPlBalance(checkResult[1]);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    } else if (!address && pageMobileMode && userData?.walletID) {
      var checkResult = await checkProductionTeam(userData.walletID);

      setPtBalance(checkResult[0]);
      setPlBalance(checkResult[1]);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    }
  };

  useEffect(() => {
    productionCheck();
  }, [userData, address]);

  //purchasing switches and functions

  const [purchased, setPurchased] = useState(false);
  const [plPurchased, setPlPurchased] = useState(false);
  const [txReceipt, setTxReceipt] = useState();
  const [txError, setTxError] = useState(false);
  const [minting, setMinting] = useState(false);

  //purchase Production Team NFT using Metamask
  const purchasePtNft = async () => {
    setTxError(false);
    setPurchased(false);
    setPlPurchased(false);
    setPurchasing(true);
    setMinting(true);

    slowSwitchPurchasing();
    try {
      const tx = await markeplace.direct.buyoutListing(0, orderQty);
      const receipt = tx.receipt;
      setPurchasing(false);
      setPurchased(true);
      setTxReceipt(receipt);
      setMinting(false);
    } catch (thisError) {
      setPurchased(true);
      setTxError(true);
      setMinting(false);
    }
  };

  //purchase Production Lead NFT using Metamask
  const purchasePlNft = async () => {
    setTxError(false);
    setPlPurchased(false);
    setPurchased(false);
    setPurchasing(true);
    setMinting(true);
    setMinting(true);

    slowSwitchPurchasing();
    try {
      const tx = await markeplace.direct.buyoutListing(1, leadOrderQty);
      const receipt = tx.receipt;
      setPurchasing(false);
      setPlPurchased(true);
      setTxReceipt(receipt);
      setMinting(false);
    } catch (thisError) {
      setPlPurchased(true);
      setTxError(true);
      setMinting(false);
    }
  };

  const slowResultReveal = async () => {
    await delay(500);
    setShowResult(!showResult);
  };

  const slowSwitchPurchasing = async () => {
    await delay(15000);
    setPurchasing(false);
  };

  const [metamaskDetected, setMetamaskDetected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

  var txLink = "https://etherscan.io/tx/" + txReceipt?.transactionHash;

  var buyPrice = parseFloat(0.005 * orderQty).toFixed(3);
  var leadBuyPrice = parseFloat(0.5 * leadOrderQty).toFixed(1);

  const paperOptions = [
    {
      width: 600,
      height: 800,
      quantity: orderQty,
      borderRadius: 6,
      fontFamily: "Saira",
    },
  ];

  return (
    <Contract>
      <h1 className="welcome__title">
        The NFT Concerts Beta will open 9/1/2022
      </h1>
      <h3 className="welcome__disclaimer ">
        Beta Access is restricted to Production Team Members.
      </h3>
      {purchased && (
        <div className="purchased__message__div">
          {txError && <>Error with Transaction.</>}
          {txReceipt && (
            <>
              Purchase Complete. Transaction #
              <a href={txLink} className="transaction__link">
                {truncateAddress(txReceipt.transactionHash)}
              </a>
            </>
          )}
        </div>
      )}
      <div className="two__column__div">
        <div className="first__column">
          <div
            className="prouction__team__image__div"
            onClick={() => {
              if (!address) {
                connectWithMetamask();
              }
              if (networkMismatch) {
                switchNetwork(ChainId.Mainnet);
              } else {
                setPurchasing(true);
                purchasePtNft();
              }
            }}
            disabled={purchasing || minting}
          >
            <img
              alt="production team image"
              src="/media/production-team.jpg"
              className="production__team__image"
            />
          </div>
        </div>
        <div className="second__column">
          <div className="no__clip__button">
            {metamaskDetected && (
              <div className="quantity__div">
                <input
                  type="number"
                  min="1"
                  max="25"
                  defaultValue="1"
                  className="qantity__input"
                  onChange={(x) => {
                    setOrderQty(parseInt(x.target.value));
                  }}
                />
              </div>
            )}
            {!metamaskDetected && (
              <PaperCheckout
                checkoutId="73baf406-11e0-4b74-8b3e-300908c7b0ee"
                display="DRAWER"
                options={paperOptions}
              >
                <div className="no__clip__button">
                  <button
                    className="buy__now my__button preview__button buy__now__button"
                    disabled={purchasing || minting}
                  >
                    <div className="inside__button__div">
                      <div>buy</div>{" "}
                      <div className="button__price">
                        <img
                          alt="eth logo"
                          src="/media/eth-logo.png"
                          height={25}
                          className="c__eth__logo white__eth__logo"
                        />
                        {buyPrice}{" "}
                        <div className="usd__paper"> (${priceInUSD})</div>
                      </div>
                    </div>
                  </button>
                </div>
              </PaperCheckout>
            )}
            {metamaskDetected && (
              <button
                className="buy__now my__button preview__button buy__now__button"
                onClick={() => {
                  if (!address) {
                    connectWithMetamask();
                  }
                  if (networkMismatch) {
                    switchNetwork(ChainId.Mainnet);
                  } else {
                    setPurchasing(true);
                    purchasePtNft();
                  }
                }}
                disabled={purchasing || minting}
              >
                <div className="inside__button__div">
                  <div>BUY</div>{" "}
                  <div className="button__price">
                    <img
                      alt="eth logo"
                      src="/media/eth-logo.png"
                      height={25}
                      className="c__eth__logo white__eth__logo"
                    />
                    {buyPrice}{" "}
                    <span className="c__price__in__usd button__usd__price">
                      (${orderPriceInUSD})
                    </span>
                  </div>
                </div>
              </button>
            )}
          </div>

          <div className="qty__div align__end">
            {metamaskDetected && <div className="spacer__div"> </div>}
            <p>[{teamRemaining}/5000 Available]</p>
          </div>

          <div className="highlights right__highlights">
            <p>
              <span className="high_emp">Production Team NFT</span>
            </p>
            <p>
              Price: <span className="high_emp">0.005 ETH </span>
              <span className="matic__price__in__usd">
                ($
                {priceInUSD})
              </span>
            </p>
            <p>
              Max QTY:<span className="high_emp"> 5,000</span>
            </p>
            <p>Closed Beta Access</p>
            <p>Lifetime Production Access</p>
            <p className="no__underline">
              Get in early and enjoy Production Access to the NFT Concerts
              Platform
            </p>
          </div>
        </div>
      </div>

      <div className="marketplace__icons__div">
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://x2y2.io/eth/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/0"
            );
          }}
        >
          <img src="/media/x2y2-logo.png" className="marketplace__icon" />
        </div>
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://looksrare.org/collections/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/0"
            );
          }}
        >
          <img
            src="/media/looksrare-logo.png"
            className="marketplace__icon invert__icon"
          />
        </div>
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://opensea.io/assets/ethereum/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/0"
            );
          }}
        >
          <img src="/media/opensea-logo.png" className="marketplace__icon" />
        </div>
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://etherscan.io/token/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30?a=0"
            );
          }}
        >
          <img src="/media/etherscan-logo.png" className="marketplace__icon" />
        </div>
        {metamaskDetected && (
          <PaperCheckout
            checkoutId="73baf406-11e0-4b74-8b3e-300908c7b0ee"
            display="DRAWER"
            options={paperOptions}
          >
            <div className="marketplace__icon__div">
              <img src="/media/cc-logo.png" className="marketplace__icon" />
            </div>
          </PaperCheckout>
        )}
      </div>
      <div className="wristband__div">
        <div
          className="member__verification__div"
          onClick={() => {
            if (!address) {
              connectWithMetamask();
            }
            if (networkMismatch) {
              switchNetwork(ChainId.Mainnet);
            } else {
              productionCheck();
              slowResultReveal();
            }
          }}
        >
          Already a Production Member?{" "}
          <button
            className="verify__button"
            onClick={() => {
              if (!address) {
                connectWithMetamask();
              }
              if (networkMismatch) {
                switchNetwork(ChainId.Mainnet);
              } else {
                productionCheck();
              }
            }}
          >
            Verify Holding
          </button>
        </div>
        {showResult && !productionTeam && address && (
          <p className="none__detected">
            Connected as {truncateAddress(address || "")} - No Production Team
            NFTs Detected.
          </p>
        )}
        {showResult && address && productionTeam && (
          <p className="none__detected">
            Connected as {truncateAddress(address || "")} -{" "}
            {!plBalance && <>Production Team Detected.</>}
            {plBalance > 0 && <>Production Lead Detected.</>}{" "}
            {!currentUser && (
              <>
                <a href="/Register">Register</a> or <a href="/Login">Login</a>
              </>
            )}
            {currentUser && <a href="/">Enter on Sept 1st</a>}
          </p>
        )}
        {pageMobileMode && !currentUser && (
          <p className="none__detected">
            Mobile Mode Enabled. <a href="/login">Login</a>
          </p>
        )}
        {pageMobileMode && currentUser && userData && !productionTeam && (
          <p className="none__detected">
            Connected as {truncateAddress(userData?.walletID)} - No Production
            Team NFTs Detected
          </p>
        )}
        {pageMobileMode && currentUser && productionTeam && (
          <p className="none__detected">
            Mobile Mode Enabled. {!plBalance && <>Production Team Detected.</>}
            {plBalance > 0 && <>Production Lead Detected.</>}{" "}
            <a href="/">Enter on September 1st</a>
          </p>
        )}
      </div>
      <h3 className="welcome__disclaimer">
        Want to be more involved? Secure your spot as a Production Lead.
      </h3>
      {plPurchased && (
        <div className="purchased__message__div">
          {txError && <>Error with Transaction.</>}
          {txReceipt && (
            <>
              Purchase Complete. Transaction #
              <a href={txLink} className="transaction__link">
                {truncateAddress(txReceipt.transactionHash)}
              </a>
            </>
          )}
        </div>
      )}

      <div className="two__column__div">
        <div className="second__column">
          <div className="prouction__team__image__div mobile__show__two">
            <img
              src="/media/production-lead.jpg"
              className="production__team__image"
            />
          </div>
          <div className="no__clip__button right__no__clip__button">
            {metamaskDetected && (
              <div className="quantity__div">
                <input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue="1"
                  className="qantity__input"
                  onChange={(x) => {
                    setLeadOrderQty(parseInt(x.target.value));
                  }}
                />
              </div>
            )}
            {!metamaskDetected && (
              <PaperCheckout
                checkoutId="9a0dbaad-b550-493e-b630-c4f9a3b84539"
                display="DRAWER"
                options={paperOptions}
              >
                <div className="no__clip__button">
                  <button
                    className="buy__now my__button preview__button buy__now__button"
                    disabled={purchasing || minting}
                  >
                    <div className="inside__button__div">
                      <div>buy</div>{" "}
                      <div className="button__price">
                        <img
                          src="/media/eth-logo.png"
                          height={25}
                          className="c__eth__logo white__eth__logo"
                        />
                        0.005{" "}
                        <div className="usd__paper">(${leadPriceInUSD})</div>
                      </div>
                    </div>
                  </button>
                </div>
              </PaperCheckout>
            )}
            {metamaskDetected && (
              <button
                disabled={purchasing || minting}
                onClick={() => {
                  if (!address) {
                    connectWithMetamask();
                  }
                  if (networkMismatch) {
                    switchNetwork(ChainId.Mainnet);
                  } else {
                    setPurchasing(true);
                    purchasePlNft();
                  }
                }}
                className="buy__now my__button preview__button buy__now__button"
              >
                <div className="inside__button__div">
                  <div>buy</div>{" "}
                  <div className="button__price">
                    <img
                      src="/media/eth-logo.png"
                      height={25}
                      className="c__eth__logo white__eth__logo"
                    />
                    {leadBuyPrice}{" "}
                    <span className="c__price__in__usd button__usd__price">
                      (${leadOrderPriceInUSD})
                    </span>
                  </div>
                </div>
              </button>
            )}
          </div>
          <div className="qty__div align__start">
            {metamaskDetected && <div className="spacer__div"> </div>} [
            {leadRemaining}/55 Available]
          </div>
          <div className="highlights left__highlights">
            <p>
              <span className="high_emp">Production Lead NFT</span>
            </p>
            <p>
              Price: <span className="high_emp">0.5 ETH </span>
              <span className="matic__price__in__usd">
                ($
                {leadPriceInUSD})
              </span>
            </p>
            <p>
              Max QTY:<span className="high_emp"> 55</span>
            </p>
            <p>Closed Beta Access</p>
            <p>Lifetime Backstage Access</p>
            <p className="no__underline">
              Determine the future of NFT Concerts with this leadership role.
            </p>
          </div>
        </div>
        <div className="first__column">
          <div
            className="prouction__team__image__div mobile__hide__two"
            onClick={() => {
              if (!address) {
                connectWithMetamask();
              }
              if (networkMismatch) {
                switchNetwork(ChainId.Mainnet);
              } else {
                setPurchasing(true);
                purchasePlNft();
              }
            }}
          >
            <img
              src="/media/production-lead.jpg"
              className="production__team__image"
            />
          </div>
        </div>
      </div>
      <div className="marketplace__icons__div">
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://x2y2.io/eth/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/1"
            );
          }}
        >
          <img src="/media/x2y2-logo.png" className="marketplace__icon" />
        </div>
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://looksrare.org/collections/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/1"
            );
          }}
        >
          <img
            src="/media/looksrare-logo.png"
            className="marketplace__icon invert__icon"
          />
        </div>
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://opensea.io/assets/ethereum/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/1"
            );
          }}
        >
          <img src="/media/opensea-logo.png" className="marketplace__icon" />
        </div>
        <div
          className="marketplace__icon__div"
          onClick={() => {
            window.open(
              "https://etherscan.io/token/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30?a=1"
            );
          }}
        >
          <img src="/media/etherscan-logo.png" className="marketplace__icon" />
        </div>
        {metamaskDetected && (
          <PaperCheckout
            checkoutId="9a0dbaad-b550-493e-b630-c4f9a3b84539"
            display="DRAWER"
            options={paperOptions}
          >
            <div className="marketplace__icon__div">
              <img src="/media/cc-logo.png" className="marketplace__icon" />
            </div>
          </PaperCheckout>
        )}
      </div>
      <div className="contract__footer__div">
        <h3 className="welcome__disclaimer">
          NFT Concerts will be open to the public shortly.
        </h3>
        <div className="three__button__div">
          <button
            className="buy__now my__button production__footer__button"
            onClick={() => {
              window.location.href = "https://nftconcerts.com/about";
            }}
          >
            Learn More
          </button>
          <button
            className="buy__now my__button production__footer__button"
            onClick={() => {
              window.location.href = "https://nftconcerts.com/blog";
            }}
          >
            Read the Blog
          </button>
          <button
            className="buy__now my__button production__footer__button"
            onClick={() => {
              navigate("/contact");
            }}
          >
            Get in Touch
          </button>
        </div>
      </div>
    </Contract>
  );
};

export default ProductionTeam;
