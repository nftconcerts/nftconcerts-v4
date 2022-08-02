import React from "react";
import "./FooterTop.css";

function FooterTop() {
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
              <a href="/login">
                <button className="my__button">Log In</button>
              </a>
              <a href="/register">
                <button className="buy__now my__button">Register</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterTop;
