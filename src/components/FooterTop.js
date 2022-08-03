import React from "react";
import { useNavigate } from "react-router-dom";
import "./FooterTop.css";

function FooterTop() {
  let navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer__top__fade"> </div>
      <div className="top__footer">
        <div className="center__prompt">
          <img
            src="https://nftconcerts.com/wp-content/uploads/2021/02/arc-logo-600x190-White-1.png"
            className="center__logo"
            alt="NFT Concerts Logo"
          />
          <div className="center__prompt__center">
            <h2 className="prompt__text">Ready To Get Started?</h2>

            <div className="buttons__box">
              <button
                className="my__button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log In
              </button>

              <button
                className="buy__now my__button"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterTop;
