import React from "react";
import { useNavigate } from "react-router-dom";
import "./FooterTop.css";

function FooterTop({ currentUser }) {
  let navigate = useNavigate();
  return (
    <div className="footer">
      <div className="top__footer">
        <div className="newfooter__top__fade" />
        <div className="center__prompt">
          <div className="prompt__col">
            <img
              src="/media/nftc-logo.png"
              className="center__logo"
              alt="NFT Concerts Logo"
            />
            {(currentUser === null && (
              <div className="center__prompt__center">
                <h2 className="prompt__text">Ready to Get Started?</h2>

                <div className="prompt__buttons__box ">
                  <button
                    className="buy__now my__button no__wrap__button prompt__button prompt__buy__button"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Register
                  </button>
                  <button
                    className="my__button prompt__button"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            )) || (
              <div className="center__prompt__center">
                <h2 className="prompt__text">Thank You for the Support</h2>

                <div className="prompt__buttons__box">
                  <button
                    className="my__button prompt__button"
                    onClick={() => {
                      navigate("/about");
                    }}
                  >
                    Learn More
                  </button>

                  <button
                    className="buy__now my__button no__wrap__button prompt__button prompt__buy__button"
                    onClick={() => {
                      navigate("/blog");
                    }}
                  >
                    Read the Blog
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterTop;
