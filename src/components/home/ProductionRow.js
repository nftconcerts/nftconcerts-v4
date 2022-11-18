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
    setRemainingPL(result[1] - 1);
  });

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  return (
    <div className="production__row__container">
      <div className="production__row__div">
        {(!productionID && (
          <>
            <h3 className="production__row__title">
              {intro} - Join the Production Team
            </h3>
            <div className="production__row__two__col">
              <div className="production__row__first__col">
                <div className="prouction__team__image__div">
                  <img
                    alt="production team image"
                    src="/media/production-team.jpg"
                    className="production__team__image"
                    onClick={() => {
                      setShowProductionPop(true);
                    }}
                  />
                </div>
              </div>
              <div className="production__row__second__col">
                <div className="second__col__inner">
                  <div className="no__clip__button">
                    <button
                      className="buy__now my__button preview__button buy__now__button"
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
                            className="c__eth__logo white__eth__logo"
                          />
                          0.05{" "}
                          <span className="c__price__in__usd button__usd__price">
                            (${(0.05 * usdExRate).toFixed(2)})
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="full__w">
                    <div className="production__row__sub__button__text">
                      <p className="production__row__remain">
                        [{remainingPT || "Loading..."}/5000 Available]
                      </p>
                    </div>
                  </div>
                  <div className=" production__row__highlights">
                    <p>
                      <span className="high_emp">Production Team NFT</span>
                    </p>
                    <p>
                      Price: <span className="high_emp">0.05 ETH </span>
                      <span className="matic__price__in__usd"></span>
                    </p>
                    <p>
                      Total QTY:<span className="high_emp"> 5,000</span>
                    </p>

                    <p>Early Access to Future NFT Concerts</p>
                    <p className="no__underline">
                      Support the Build and Enjoy Lifetime Production Access to
                      the NFT Concerts Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="show__production__lead">
              <p> Want a bigger role? Become a Production Lead </p>
              <i
                className="fa-solid fa-plus lead__icon"
                onClick={() => {
                  setProductionID(1);
                }}
              />
            </div>
          </>
        )) || (
          <>
            <h3 className="production__row__title">
              Determine the Future of NFT Concerts
            </h3>
            <div className="production__row__two__col">
              <div className="production__row__first__col">
                <div className="prouction__team__image__div">
                  <img
                    alt="production team image"
                    src="/media/production-lead.jpg"
                    className="production__team__image"
                    onClick={() => {
                      setShowProductionPop(true);
                    }}
                  />
                </div>
              </div>
              <div className="production__row__second__col">
                <div className="second__col__inner">
                  <div className="no__clip__button">
                    <button
                      className="buy__now my__button preview__button buy__now__button"
                      onClick={() => {
                        setShowProductionPop(true);
                      }}
                    >
                      <div className="inside__button__div">
                        <div>Secure NOW</div>{" "}
                        <div className="button__price">
                          <img
                            alt="eth logo"
                            src="/media/eth-logo.png"
                            height={25}
                            className="c__eth__logo white__eth__logo"
                          />
                          0.5{" "}
                          <span className="c__price__in__usd button__usd__price">
                            (${(0.5 * usdExRate).toFixed(2)})
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="full__w">
                    <div className="production__row__sub__button__text">
                      <p className="production__row__remain">
                        [{remainingPL || "Loading..."}/55 Available]
                      </p>
                    </div>
                  </div>
                  <div className=" production__row__highlights">
                    <p>
                      <span className="high_emp">Production Lead NFT</span>
                    </p>
                    <p>
                      Price: <span className="high_emp">0.5 ETH </span>
                      <span className="matic__price__in__usd"></span>
                    </p>
                    <p>
                      Total QTY:<span className="high_emp"> 55</span>
                    </p>

                    <p>Backstage Access to NFT Concerts</p>
                    <p className="no__underline">
                      Receive Direct Access to the NFT Concerts Team and
                      Determine the Future of Live Music
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="show__production__lead">
              <p> Too much commitment? Join the Production Team </p>
              <i
                className="fa-solid fa-minus lead__icon"
                onClick={() => {
                  setProductionID(0);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionRow;
