import React, { useState, useEffect } from "react";
import "./CountdownBanner.css";
import { useNavigate } from "react-router-dom";
import { GetUSDExchangeRate } from "../api";
import { editionDropAddress } from "../../scripts/getContract.mjs";
import { useActiveClaimCondition, useContract } from "@thirdweb-dev/react";

const CountdownBanner = ({ setShowMintPopUp }) => {
  const [usdExRate, setUsdExRate] = useState();
  let navigate = useNavigate();
  const { contract } = useContract(editionDropAddress);
  const { data: activeClaimCondition } = useActiveClaimCondition(contract, 4);

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);
  return (
    <>
      <div className="countdown__banner__div">
        <div className="countdown__banner__small__logo">
          <img src="/media/nftc-logo.png" className="welcome__logo" />
        </div>
        <div className="countdown__banner__inner">
          <div className="countdown__banner__col1">
            <img
              src="/media/nftc-logo.png"
              className="welcome__logo big__logo"
            />
          </div>
          <div className="countdown__banner__col2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/public%2FToken%20Image%2FToken%20v1.png?alt=media&token=8e44b174-5f0d-48ea-a905-722e72556d8a"
              className="row__poster welcome__poster"
              onClick={() => {
                navigate("/concert/4");
              }}
            />
          </div>
        </div>
        <div className="countdown__banner__content"></div>
        <div className="countdown__banner__bottom__fade" />
      </div>
      <div className="world__calendar__container">
        <div className="world__calendar__div">
          <button
            className="buy__now my__button preview__button buy__now__button production__button open__button cbanner__button"
            onClick={() => {
              setShowMintPopUp(true);
            }}
            disabled={!activeClaimCondition}
          >
            <div className="inside__button__div">
              <div>Mint</div>{" "}
              <div className="button__price">
                <img
                  alt="eth logo"
                  src="/media/eth-logo.png"
                  height={25}
                  className="c__eth__logo pt__eth__logo"
                />
                0.03{" "}
                <span className="c__price__in__usd button__usd__price">
                  (${(0.03 * usdExRate).toFixed(2)})
                </span>
              </div>
            </div>
          </button>
          <div
            className="drop__info"
            onClick={() => {
              navigate("/concert/4");
            }}
          >
            <p className="pt__stat pt__stat__1">
              Total QTY<span className="pt__emph"> 25</span>
            </p>
            <p className="pt__stat pt__stat__2">
              Available{" "}
              <span className="pt__emph">
                {activeClaimCondition?.availableSupply || "LDG"}{" "}
              </span>
            </p>
          </div>
          <div className="zones__div">
            <div className="zone__div zone__div1">
              <h5 className="zone__title">Berlin</h5>
              <p className="zone__info zone__info1">12/22/22</p>
              <p className="zone__info">
                Production Team <span className="zone__data">3PM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">9PM</span>
              </p>
            </div>

            <div className="zone__div zone__div2">
              <h5 className="zone__title">London</h5>
              <p className="zone__info zone__info1">12/22/22</p>
              <p className="zone__info ">
                Production Team <span className="zone__data">2PM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">8PM</span>
              </p>
            </div>

            <div className="zone__div zone__div3">
              <h5 className="zone__title">NYC</h5>
              <p className="zone__info zone__info1">12/22/22</p>
              <p className="zone__info">
                Production Team <span className="zone__data">9AM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">3PM</span>
              </p>
            </div>

            <div className="zone__div zone__div4">
              <h5 className="zone__title">LA</h5>
              <p className="zone__info zone__info1">12/22/22</p>
              <p className="zone__info">
                Production Team <span className="zone__data">6AM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">12PM</span>
              </p>
            </div>
          </div>
          <div className="calendar__buttons">
            <button
              className="empty__pt__button"
              onClick={() => {
                navigate("/concert/4");
              }}
            >
              View Concert Info
              <i className="fa-solid fa-plus empty__icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountdownBanner;
