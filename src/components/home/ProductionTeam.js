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

import { ref as dRef, onValue } from "firebase/database";
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
    "0x7B3066d24c73966f92F95Ee9585689792E81C692"
  );
  const [metamaskDetected, setMetamaskDetected] = useState(false);

  useEffect(() => {
    setPageMobileMode(getMobileMode());
    console.log("Mobile Mode: ", pageMobileMode);
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
        console.log("ud: ", data);
      });
    }
  }, [currentUser]);
  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");
  const [leadPriceInUSD, setLeadPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
      console.log("metamask detected.");
    }
  }, []);

  //price formatting
  useEffect(() => {
    if (usdExRate) {
      var newPrice = 0.005 * usdExRate;
      var leadPrice = 0.5 * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      let leadRoundedPrice = leadPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
      setLeadPriceInUSD(leadRoundedPrice);
    } else setPriceInUSD("err");
  }, [usdExRate]);

  //check if user is holding production team NFT
  const [productionTeam, setProductionTeam] = useState(false);
  const address = useAddress();
  const [showResult, setShowResult] = useState(false);
  const [ptBalance, setPtBalance] = useState(0);
  const [plBalance, setPlBalance] = useState(0);

  const productionCheck = async () => {
    if (address) {
      var checkResult = await checkProductionTeam(address);
      console.log("PR: ", checkResult);
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
      console.log("PR with User Wallet: ", checkResult);
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
    delay(1000);
    setShowResult(!showResult);
  };

  useEffect(() => {
    productionCheck();
  }, [userData]);

  const purchasePtNft = async () => {
    const tx = await markeplace.direct.buyoutListing(2, 1);
    console.log("Successful purchase");
    console.log("tx: ", tx);
    const receipt = tx.receipt;
    console.log("receipt: ", receipt);
  };

  return (
    <Contract>
      <h1 className="welcome__title">Welcome to NFT Concerts</h1>
      <h3 className="welcome__disclaimer">
        We are currently building. Access is restricted to Prodcution Team
        Members.
      </h3>
      <div className="two__column__div">
        <div className="first__column">
          <div className="prouction__team__image__div">
            <img
              src="/media/production-team.jpg"
              className="production__team__image"
            />
          </div>
        </div>
        <div className="second__column">
          <div className="no__clip__button">
            <button
              className="buy__now my__button preview__button buy__now__button"
              onClick={() => {
                purchasePtNft();
              }}
            >
              <div className="inside__button__div">
                <div>Mint Now</div>{" "}
                <div className="button__price">
                  <img
                    src="/media/eth-logo.png"
                    height={25}
                    className="c__eth__logo white__eth__logo"
                  />
                  0.005{" "}
                  <span className="c__price__in__usd button__usd__price">
                    (${priceInUSD})
                  </span>
                </div>
              </div>
            </button>
          </div>
          <div className="highlights right__highlights">
            <p>
              <span className="high_emp">Polygon ERC-1155 NFT</span>
            </p>
            <p>
              Price: <span className="high_emp">0.005 ETH</span> (WETH)
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
            {/* <PaperCheckout
              checkoutId="338510c3-94cb-4f37-a0c0-a0c64f8a6f62"
              display="DRAWER"
              options={{
                width: 400,
                height: 800,
                colorBackground: "#232323",
                colorPrimary: "#42ff4f",
                colorText: "#f1fde3",
                borderRadius: 6,
                fontFamily: "Open Sans",
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className="opensea__link__div">
        <a
          target="_blank"
          href="https://opensea.io/assets/matic/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/0"
        >
          View NFT on OpenSea
        </a>
      </div>
      <div className="wristband__div">
        <div
          className="member__verification__div"
          onClick={() => {
            console.log("current address :", address);
            if (!address) {
              connectWithMetamask();
            }
            if (networkMismatch) {
              switchNetwork(ChainId.Mumbai);
            } else {
              productionCheck();
            }
          }}
        >
          Already a Production Member?{" "}
          <button
            className="verify__button"
            onClick={() => {
              console.log("current address :", address);
              if (address) {
                connectWithMetamask();
              }
              if (networkMismatch) {
                switchNetwork(ChainId.Mumbai);
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
            {!currentUser && <a href="/login">Login</a>}
            {currentUser && <a href="/home">Enter</a>}
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
            <a href="/home">Enter</a>
          </p>
        )}
      </div>
      <h3 className="welcome__disclaimer">
        Want to be more involved? Secure your spot as a Production Lead.
      </h3>
      <div className="two__column__div">
        <div className="second__column">
          <div className="prouction__team__image__div mobile__show__two">
            <img
              src="/media/production-lead.jpg"
              className="production__team__image"
            />
          </div>
          <div className="no__clip__button right__no__clip__button">
            <button className="buy__now my__button preview__button buy__now__button">
              <div className="inside__button__div">
                <div>Mint Now</div>{" "}
                <div className="button__price">
                  <img
                    src="/media/eth-logo.png"
                    height={25}
                    className="c__eth__logo white__eth__logo"
                  />
                  0.5{" "}
                  <span className="c__price__in__usd button__usd__price">
                    (${leadPriceInUSD})
                  </span>
                </div>
              </div>
            </button>
          </div>
          <div className="highlights left__highlights">
            <p>
              <span className="high_emp">Polygon ERC-1155 NFT</span>
            </p>
            <p>
              Price: <span className="high_emp">0.5 ETH</span> (WETH)
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
          <div className="prouction__team__image__div mobile__hide__two">
            <img
              src="/media/production-lead.jpg"
              className="production__team__image"
            />
          </div>
        </div>
      </div>
      <div className="opensea__link__div">
        <a
          target="_blank"
          href="https://opensea.io/collection/nft-concerts-production-team"
        >
          View Collection on OpenSea
        </a>
      </div>

      <div className="contract__footer__div">
        <h3 className="welcome__disclaimer">
          NFT Concerts will be open to the public shortly.
        </h3>
        <div className="three__button__div">
          <button
            className="buy__now my__button production__footer__button"
            onClick={() => {
              navigate("/about");
            }}
          >
            Learn More
          </button>
          <button
            className="buy__now my__button production__footer__button"
            onClick={() => {
              navigate("/blog");
            }}
          >
            Read the Blog
          </button>
          <button className="buy__now my__button production__footer__button">
            Get in Touch
          </button>
        </div>
      </div>
    </Contract>
  );
};

export default ProductionTeam;
