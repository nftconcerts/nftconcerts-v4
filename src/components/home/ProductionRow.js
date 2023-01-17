import React, { useState, useEffect } from "react";
import "./ProductionRow.css";
import { GetUSDExchangeRate } from "../api";
import CheckProductionTeam from "../../scripts/checkProductionTeam";
import { editionDropAddress } from "../../scripts/getProductionContract";
import { useContract } from "@thirdweb-dev/react";

const ProductionRow = ({
  setShowProductionPop,
  productionID,
  setProductionID,
  intro,
}) => {
  const [showProductionLead, setShowProductionLead] = useState(false);
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  const [remainingPT, setRemainingPT] = useState();
  const [remainingPL, setRemainingPL] = useState();

  const address = "0x478bF0bedd29CA15cF34611C965F6F39FEcebF7F";

  const results = CheckProductionTeam(address);

  results.then(function (result) {
    setRemainingPT(result[0] - 100);
    setRemainingPL(result[1] - 2);
  });

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  return (
    <div className="production__row__container">
      <div className="production__row__fade"> </div>
      <div className="production__row__title__div">
        <h3 className="production__row__title">{intro}</h3>
        <h3 className="production__row__subtitle">Join the Production Team</h3>
      </div>
      <div className="production__row__div">
        {(!productionID && (
          <>
            <div className="production__row__two__col">
              <div className="production__row__first__col">
                <div className="prouction__team__image__div pt__image__div">
                  <img
                    alt="production team image"
                    src="/media/production-team.jpg"
                    className="production__team__image"
                    onClick={() => {
                      setShowProductionPop(true);
                    }}
                  />
                </div>
                <div className="marketplace__icons__div token__div__icons">
                  <div
                    className="marketplace__icon__div pt__market__icon"
                    onClick={() => {
                      window.open(
                        `https://etherscan.io/token/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30?a=${productionID}`
                      );
                    }}
                  >
                    <img
                      src="/media/etherscan-logo.png"
                      className="marketplace__icon"
                      alt="Etherscan Logo"
                    />
                  </div>{" "}
                  <div
                    className="marketplace__icon__div pt__market__icon"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/ethereum/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/${productionID}`
                      );
                    }}
                  >
                    <img
                      src="/media/opensea-logo.png"
                      className="marketplace__icon"
                      alt="OpenSea Logo"
                    />
                  </div>{" "}
                  <div
                    className="marketplace__icon__div pt__market__icon"
                    onClick={() => {
                      window.open(
                        `https://looksrare.org/collections/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/${productionID}`
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
                    className="marketplace__icon__div pt__market__icon"
                    onClick={() => {
                      window.open(
                        `https://x2y2.io/eth/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/${productionID}`
                      );
                    }}
                  >
                    <img
                      src="/media/x2y2-logo.png"
                      className="marketplace__icon"
                      alt="X2Y2 Logo"
                    />
                  </div>
                </div>
              </div>
              <div className="production__row__second__col">
                <div className="second__col__inner">
                  <div className="full__w pt__button__row">
                    <button
                      className="buy__now my__button preview__button buy__now__button production__button"
                      onClick={() => {
                        setShowProductionPop(true);
                      }}
                    >
                      <div className="inside__button__div">
                        <div>JOIN NOW</div>{" "}
                        <div className="button__price">
                          <img
                            alt="eth logo"
                            src="/media/eth-logo.png"
                            height={25}
                            className="c__eth__logo pt__eth__logo"
                          />
                          0.05{" "}
                          <span className="c__price__in__usd button__usd__price">
                            (${(0.05 * usdExRate).toFixed(2)})
                          </span>
                        </div>
                      </div>
                    </button>
                    <div className="production__row__sub__button__text">
                      <p className="production__row__remain">
                        [{remainingPT || "Loading..."}/5000 Available]
                      </p>
                    </div>
                  </div>
                  <div className=" production__row__highlights">
                    <h3 className="inner__pt__title">Production Team NFT</h3>
                    <div className="full__w">
                      <p className="pt__stat pt__stat__1">
                        Total QTY:<span className="pt__emph"> 5,000</span>
                      </p>
                      <p className="pt__stat pt__stat__2">
                        Price: <span className="pt__emph">0.05 ETH </span>
                      </p>
                    </div>
                    <p className="pt__point">
                      6-Hour Early Access to Mint Future NFT Concerts
                    </p>
                    <p className="pt__point underline">
                      Support the Build & Join the Community
                    </p>
                    <div className="full__w">
                      <p> Want a bigger role? </p>
                      <button
                        className="empty__pt__button"
                        onClick={() => {
                          setProductionID(1);
                        }}
                      >
                        Become a Production Lead
                        <i className="fa-solid fa-plus empty__icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )) || (
          <>
            <>
              <div className="production__row__two__col">
                <div className="production__row__first__col">
                  <div className="prouction__team__image__div pt__image__div">
                    <img
                      alt="production team image"
                      src="/media/production-lead.jpg"
                      className="production__team__image pt__image"
                      onClick={() => {
                        setShowProductionPop(true);
                      }}
                    />
                  </div>
                  <div className="marketplace__icons__div token__div__icons">
                    <div
                      className="marketplace__icon__div pt__market__icon"
                      onClick={() => {
                        window.open(
                          `https://etherscan.io/token/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30?a=${productionID}`
                        );
                      }}
                    >
                      <img
                        src="/media/etherscan-logo.png"
                        className="marketplace__icon"
                        alt="Etherscan Logo"
                      />
                    </div>
                    <div
                      className="marketplace__icon__div pt__market__icon"
                      onClick={() => {
                        window.open(
                          `https://opensea.io/assets/ethereum/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/${productionID}`
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
                      className="marketplace__icon__div pt__market__icon"
                      onClick={() => {
                        window.open(
                          `https://looksrare.org/collections/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/${productionID}`
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
                      className="marketplace__icon__div pt__market__icon"
                      onClick={() => {
                        window.open(
                          `https://x2y2.io/eth/0x9b45c979d1ffe99aae1aa5a9b27888e6b9c39c30/${productionID}`
                        );
                      }}
                    >
                      <img
                        src="/media/x2y2-logo.png"
                        className="marketplace__icon"
                        alt="X2Y2 Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="production__row__second__col">
                  <div className="second__col__inner">
                    <div className="full__w pt__button__row">
                      <button
                        className="buy__now my__button preview__button buy__now__button production__button"
                        onClick={() => {
                          setShowProductionPop(true);
                        }}
                      >
                        <div className="inside__button__div">
                          <div>SECURE NOW</div>{" "}
                          <div className="button__price">
                            <img
                              alt="eth logo"
                              src="/media/eth-logo.png"
                              height={25}
                              className="c__eth__logo pt__eth__logo"
                            />
                            0.5{" "}
                            <span className="c__price__in__usd button__usd__price">
                              (${(0.5 * usdExRate).toFixed(2)})
                            </span>
                          </div>
                        </div>
                      </button>
                      <div className="production__row__sub__button__text">
                        <p className="production__row__remain">
                          [{remainingPL || "Loading..."}/55 Available]
                        </p>
                      </div>
                    </div>
                    <div className=" production__row__highlights">
                      <h3 className="inner__pt__title">Production Lead NFT</h3>
                      <div className="full__w">
                        <p className="pt__stat pt__stat__1">
                          Total QTY:<span className="pt__emph"> 55</span>
                        </p>
                        <p className="pt__stat pt__stat__2">
                          Price: <span className="pt__emph">0.5 ETH </span>
                        </p>
                      </div>
                      <p className="pt__point">
                        Private Telegram Chat with NFT Concerts Team
                      </p>
                      <p className="pt__point underline">
                        Determine the Future of Live Music
                      </p>
                      <div className="full__w">
                        <p> Too much commitment? </p>
                        <button
                          className="empty__pt__button"
                          onClick={() => {
                            setProductionID(0);
                          }}
                        >
                          Join the Production Team
                          <i className="fa-solid fa-minus empty__icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </>
        )}
      </div>
      <div className="production__row__bottom__fade"> </div>
    </div>
  );
};

export default ProductionRow;
