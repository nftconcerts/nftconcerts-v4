import React, { useState, useEffect } from "react";
import "./CountdownBanner.css";
import { useNavigate } from "react-router-dom";

const CountdownBanner = () => {
  let navigate = useNavigate();
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
          <div
            className="drop__date"
            onClick={() => {
              navigate("/concert/4");
            }}
          >
            Minting <span className="pt__emph">12/22/2022</span>
          </div>
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
              Price <span className="pt__emph">0.03 ETH </span>
            </p>
          </div>
          <div className="zones__div">
            <div className="zone__div zone__div1">
              <h5 className="zone__title">Berlin</h5>
              <p className="zone__info">
                Production Team <span className="zone__data">3PM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">9PM</span>
              </p>
            </div>

            <div className="zone__div zone__div2">
              <h5 className="zone__title">London</h5>
              <p className="zone__info ">
                Production Team <span className="zone__data">2PM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">8PM</span>
              </p>
            </div>

            <div className="zone__div zone__div3">
              <h5 className="zone__title">NYC</h5>
              <p className="zone__info">
                Production Team <span className="zone__data">9AM</span>
              </p>

              <p className="zone__info public__sale__info">
                Public Sale <span className="zone__data">3PM</span>
              </p>
            </div>

            <div className="zone__div zone__div4">
              <h5 className="zone__title">LA</h5>
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
