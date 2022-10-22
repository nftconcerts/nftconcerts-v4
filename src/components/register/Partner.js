import React, { useState, useEffect } from "react";
import "./Partner.css";
import Contract from "../form/Contract";
import makeid from "../../scripts/makeid";
import Banner from "../home/Banner";
import Popup from "../form/Popup";

const PromoTeam = () => {
  const [partnerCode, setPartnerCode] = useState();
  const [tempCode, setTempCode] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();

  const generateCode = () => {
    let code = makeid(5);
    setTempCode(code);
  };
  const [showInfo, setShowInfo] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (tempCode) {
      if (tempCode.length > 3) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
  }, [tempCode]);

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <div className="promo__page">
      {showPopup && (
        <Popup setShowPurchased={setShowPopup}>
          <h3 className="pop__up__title">Let's Make Music History</h3>
          <div className="pop__up__code__div">
            <button className="my__button code__button" onClick={generateCode}>
              Geneate Random Code
            </button>
            <p> Or.. </p>
            <div>
              <p className="pop__up__subtitle">Choose Your Referral Code</p>

              <input
                type="text"
                className="referral__code__input"
                value={tempCode}
                onChange={(e) => {
                  setTempCode(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter Custom Code"
                maxLength={8}
                minLength={4}
              />
            </div>
          </div>
          <button
            className="my__button code__button play__now__button"
            onClick={() => {
              setPartnerCode(tempCode);
              setShowPopup(false);
            }}
            disabled={!approved}
          >
            Confirm Partnership
          </button>
          <p>
            Questions? <a href="/contact">Get in Touch</a>
          </p>
        </Popup>
      )}
      {(!partnerCode && (
        <>
          <Banner
            title="Become a Partner"
            subtitle="Stack ETH by Recruiting Artists to NFT Concerts"
          >
            {" "}
            <div className="top__partner__button">
              <button
                onClick={() => {
                  setShowPopup(true);
                }}
                className="my__button play__now__button partner__button"
              >
                Become a Partner
              </button>
            </div>
          </Banner>

          <div className="promo__page__content__full">
            <div className="promo__page__content">
              {" "}
              <p className="promo__text ">
                The only risk-free thing in crypto! Promote the NFT Concerts
                platform to Artists and earn a{" "}
                <span className="bold italics red__text">10% finders fee</span>{" "}
                on every minted NFT Concert in your network.
              </p>
              {showInfo && (
                <div className="promo__statement">
                  All Promo Fees are paid from the NFT Concerts Fee. <br />
                  Artists recieve their full share.
                </div>
              )}
              <div className="percentage__info">
                <i
                  className="fa-solid fa-info percentage__info__button "
                  onClick={() => {
                    setShowInfo(!showInfo);
                  }}
                />
              </div>
              <div className="percentage__pies__div">
                <div className="standard__percentage__div">
                  <h3 className="percentage__title">Standard Fee Breakdown</h3>
                  <img src="/media/standard-pie.png" className="pie__image" />
                </div>
                <div className="partner__percentage__div">
                  <h3 className="percentage__title">Partner Fee Breakdown</h3>
                  <img src="/media/partner-pie.png" className="pie__image" />
                </div>
              </div>
              <div className="percentage__pie__div"></div>
              {/* <div className="percentage__div">
                <div className="percentage__artist__div">
                  {" "}
                  80%
                  <br /> Artist
                </div>

                <div className="percentage__nftconcerts__div">
                  <p>
                    20% <br />
                    <span className="promo__mobile__hide">NFT Concerts</span>
                    <span className="promo__mobile__show">NFTC</span>
                  </p>
                </div>
              </div>
              <h3 className="percentage__title">Partner Fee Breakdown</h3>
              <div className="percentage__div">
                <div className="percentage__artist__div">
                  {" "}
                  80% <br /> Artist
                </div>

                <div className="percentage__nftconcerts__div .percentage__nftconcerts__div2">
                  <p>
                    10% <br /> <span className="promo__mobile__hide">NFTC</span>
                    <span className="promo__mobile__show">Us</span>
                  </p>
                </div>

                <div className="percentage__promoter__div">
                  10% <br /> YOU
                </div>
              </div> */}
              <h3 className="percentage__title percentage__title__space">
                Ready to earn by growing NFT Concerts?
              </h3>
              <button
                onClick={() => {
                  setShowPopup(true);
                }}
                className="my__button play__now__button partner__button"
              >
                Become a Partner
              </button>
              <p className="promo__disclaimer">
                Finders fees are paid out weekly every Friday in a single
                transaction to reduce gas cost.
              </p>
            </div>
          </div>
        </>
      )) || (
        <>
          <Banner
            title="Welcome Partner"
            subtitle={"Your Partner Code: " + partnerCode}
          />
          <h1 className="promo__title">Welcome Partner!</h1>
          <h3>
            Your Promo Code:{" "}
            <span className="promo__code__emp">{partnerCode}</span>
          </h3>
          <p>
            Your Custom Link -{" "}
            <a href={"https://nftconcerts.com/apply?r=" + partnerCode}>
              https://nftconcerts.com/apply?r={partnerCode}
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default PromoTeam;
