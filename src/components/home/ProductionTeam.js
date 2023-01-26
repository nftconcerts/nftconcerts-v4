import React, { useState, useEffect } from "react";
import Contract from "../form/Contract";
import "./ProductionTeam.css";
import { GetUSDExchangeRate } from "./../api";
import { useNavigate } from "react-router-dom";
import CheckProductionTeam from "../../scripts/checkProductionTeam";
import { truncateAddress, fetchCurrentUser, db } from "../../firebase";

import { Helmet } from "react-helmet";
import { ref as dRef, onValue } from "firebase/database";
import ProductionPop from "../popup/ProductionPop";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const ProductionTeam = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [remainingPT, setRemainingPT] = useState();
  const [remainingPL, setRemainingPL] = useState();

  //see how many pt items remain in nftconcerts.eth wallet
  const nftcaddress = "0x478bF0bedd29CA15cF34611C965F6F39FEcebF7F";
  const results = CheckProductionTeam(nftcaddress);
  results.then(function (result) {
    setRemainingPT(result[0] - 100);
    setRemainingPL(result[1] - 1);
  });

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

  //check if user is in production team
  const [productionTeam, setProductionTeam] = useState(false);
  const [userPt, setUserPt] = useState(0);
  const [userPl, setUserPl] = useState(0);

  const userProdCheck = CheckProductionTeam(userData?.walletID);
  userProdCheck.then(function (result) {
    setUserPt(result[0]);
    setUserPl(result[1]);
  });

  useEffect(() => {
    if (userPt > 0) {
      setProductionTeam(true);
    } else if (userPl > 0) {
      setProductionTeam(true);
    }
  }, [userPt, userPl]);
  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  const [leadPriceInUSD, setLeadPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  //price formatting
  useEffect(() => {
    if (usdExRate) {
      var newPrice = 0.05 * usdExRate;

      var leadPrice = 0.5 * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      let leadRoundedPrice = leadPrice.toFixed(2);
      setPriceInUSD(roundedPrice);

      setLeadPriceInUSD(leadRoundedPrice);
    } else setPriceInUSD("err");
  }, [usdExRate]);

  //show check results after delay
  const [showResult, setShowResult] = useState(false);
  const slowResultReveal = async () => {
    await delay(500);
    setShowResult(!showResult);
  };

  var buyPrice = parseFloat(0.05).toFixed(2);
  var leadBuyPrice = parseFloat(0.5).toFixed(1);

  //production pop + production id
  const [showProductionPop, setShowProductionPop] = useState(false);
  const [productionID, setProductionID] = useState(0);

  return (
    <>
      {showProductionPop && (
        <ProductionPop
          currentUser={currentUser}
          productionID={productionID}
          setProductionID={setProductionID}
          setShowProductionPop={setShowProductionPop}
          setCurrentUser={setCurrentUser}
        />
      )}
      <Contract>
        <Helmet>
          <title>NFT Concerts Production Team</title>
          <meta
            name="description"
            content="Join the NFT Concerts Production Team to unlock early access to future NFT Concerts"
          />
        </Helmet>
        <h1 className="welcome__title">
          Join the NFT Concerts Production Team
        </h1>

        <div className="two__column__div">
          <div className="first__column">
            <div
              className="prouction__team__image__div"
              onClick={() => {
                setProductionID(0);
                setShowProductionPop(true);
              }}
            >
              <img
                alt="production team"
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
                  setProductionID(0);
                  setShowProductionPop(true);
                }}
              >
                <div className="inside__button__div">
                  <div>Join NOW</div>{" "}
                  <div className="button__price">
                    <img
                      alt="eth logo"
                      src="/media/eth-logo.png"
                      height={25}
                      className="c__eth__logo white__eth__logo"
                    />
                    {buyPrice}{" "}
                    <span className="c__price__in__usd button__usd__price">
                      (${priceInUSD})
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="qty__div align__end">
              <p>[{remainingPT}/5000 Available]</p>
            </div>

            <div className="highlights right__highlights">
              <p>
                <span className="high_emp">Production Team NFT</span>
              </p>
              <p>
                Price: <span className="high_emp">0.05 ETH </span>
              </p>
              <p>
                Total QTY:<span className="high_emp"> 5,000</span>
              </p>
              <p>Early Access to Future NFT Concerts</p>

              <p className="pt__no__underline">
                Support the Build and Enjoy Lifetime Production Access to the
                NFT Concerts Platform
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
            <img
              src="/media/x2y2-logo.png"
              className="marketplace__icon"
              alt="X2Y2 Logo"
            />
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
              alt="LooksRare Logo"
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
            <img
              src="/media/opensea-logo.png"
              className="marketplace__icon"
              alt="OpenSea Logo"
            />
          </div>
          <div
            className="marketplace__icon__div"
            onClick={() => {
              window.open(
                "https://etherscan.io/token/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30?a=0"
              );
            }}
          >
            <img
              src="/media/etherscan-logo.png"
              className="marketplace__icon"
              alt="Etherscan Logo"
            />
          </div>
        </div>
        <div className="wristband__div">
          <div
            className="member__verification__div"
            onClick={() => {
              if (!currentUser) {
                navigate("/login");
              } else {
                slowResultReveal();
              }
            }}
          >
            Already a Production Member?{" "}
            <button
              className="verify__button"
              onClick={() => {
                if (!currentUser) {
                  navigate("/login");
                } else {
                  slowResultReveal();
                }
              }}
            >
              Verify Holding
            </button>
          </div>
          {showResult && !productionTeam && (
            <p className="none__detected">
              Connected as {truncateAddress(userData?.walletID || "")} - No
              Production Team NFTs Detected.
            </p>
          )}
          {showResult && productionTeam && (
            <p className="none__detected">
              Connected as {truncateAddress(userData?.walletID)} -{" "}
              {!userPl && <>Production Team Detected.</>}
              {userPl > 0 && <>Production Lead Detected.</>}{" "}
              {!currentUser && (
                <>
                  <a href="/Register">Register</a> or <a href="/Login">Login</a>
                </>
              )}
              {currentUser && <a href="/lounge">Enter Lounge</a>}
            </p>
          )}
        </div>
        <h3 className="prod__lead__title">
          Want a bigger role? Become a Production Lead.
        </h3>

        <div className="two__column__div">
          <div className="second__column">
            <div className="prouction__team__image__div mobile__show__two">
              <img
                src="/media/production-lead.jpg"
                className="production__team__image"
                alt="Production Lead"
              />
            </div>
            <div className="no__clip__button right__no__clip__button">
              <button
                onClick={() => {
                  setProductionID(1);
                  setShowProductionPop(true);
                }}
                className="buy__now my__button preview__button buy__now__button"
              >
                <div className="inside__button__div">
                  <div>Secure Now</div>{" "}
                  <div className="button__price">
                    <img
                      src="/media/eth-logo.png"
                      height={25}
                      className="c__eth__logo white__eth__logo"
                      alt="ETH Logo"
                    />
                    {leadBuyPrice}{" "}
                    <span className="c__price__in__usd button__usd__price">
                      (${leadPriceInUSD})
                    </span>
                  </div>
                </div>
              </button>
            </div>
            <div className="qty__div align__start">
              [{remainingPL}/55 Available]
            </div>
            <div className="highlights left__highlights">
              <p>
                <span className="high_emp">Production Lead NFT</span>
              </p>
              <p>
                Price: <span className="high_emp">0.5 ETH </span>
              </p>
              <p>
                Max QTY:<span className="high_emp"> 55</span>
              </p>
              <p>Backstage Access to NFT Concerts</p>

              <p className="pt__no__underline">
                Receive Direct Access to the NFT Concerts Team and Determine the
                Future of Live Music
              </p>
            </div>
          </div>
          <div className="first__column">
            <div
              className="prouction__team__image__div mobile__hide__two"
              onClick={() => {
                setProductionID(1);
                setShowProductionPop(true);
              }}
            >
              <img
                src="/media/production-lead.jpg"
                className="production__team__image"
                alt="Production Lead"
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
            <img
              src="/media/x2y2-logo.png"
              className="marketplace__icon"
              alt="X2Y2 Logo"
            />
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
              alt="LooksRare Logo"
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
            <img
              src="/media/opensea-logo.png"
              className="marketplace__icon"
              alt="OpenSea Logo"
            />
          </div>
          <div
            className="marketplace__icon__div"
            onClick={() => {
              window.open(
                "https://etherscan.io/token/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30?a=1"
              );
            }}
          >
            <img
              src="/media/etherscan-logo.png"
              className="marketplace__icon"
              alt="Etherscan Logo"
            />
          </div>
        </div>
        <div className="contract__footer__div">
          <h3 className="prod__lead__title">
            Determine the Future of Live Music
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
                window.location.href = "/blog";
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
    </>
  );
};

export default ProductionTeam;
