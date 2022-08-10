import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db, fetchCurrentUser } from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import Contract from "./form/Contract";
import ReactPlayer from "react-player";
import dateFormat from "dateformat";
import "./upload/Confirmation.css";
import { GetUSDExchangeRate } from "./api";

const ContractPage = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let concertID = parseInt(searchParams.get("id"));
  const [userData, setUserData] = useState();
  const [concertData, setconcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [validUser, setValidUser] = useState(false);

  //Set the current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //format ETH Price
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice) < 1) {
      setFormatPrice("0" + concertData?.concertPrice);
    } else setFormatPrice(concertData?.concertPrice);
  }, [concertData]);

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

  //Check if user is admin or was uploader
  useEffect(() => {
    console.log(userData?.userType);
    if (userData?.userType === "admin") {
      setValidUser(true);
    } else if (userData?.userType === "artist") {
      if (userData?.walletID === concertData?.uploaderWalletID) {
        setValidUser(true);
      }
    } else setValidUser(false);
  }, [currentUser, userData]);

  //download concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/" + concertID + "/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setconcertData(cData);
      console.log("concert Data: ", cData);
    });
  }, [currentUser, concertID]);

  //price formats
  const resaleFee = parseFloat(concertData?.concertResaleFee) + 5;
  const [formatPrice, setFormatPrice] = useState("");

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
      console.log("usd", parseFloat(res));
    });
  }, []);

  useEffect(() => {
    if (parseFloat(concertData?.concertPrice)) {
      var newPrice = parseFloat(concertData?.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (concertData?.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

  //displays the individual songs for the setlist coonfirmation
  const displaySongs = () => {
    var songRows = [];
    var rowNums = parseInt(concertData?.concertNumSongs);
    if (concertData?.concertNumSongs === "") {
      return (
        <div className="no__songs__error">Please set the number of songs.</div>
      );
    } else {
      for (var i = 1; i <= rowNums; i++) {
        const songDiv = (n) => {
          const songPlaceholder = `Song ${n}`;
          return (
            <div className="song__div">
              <p className="song__num">{n}:</p>
              <p className="song__name">
                <span className="song__emp">
                  {""} {concertData?.concertSetList[n - 1]}
                </span>
              </p>
            </div>
          );
        };
        songRows.push(songDiv(i));
      }
      return songRows;
    }
  };

  return (
    <>
      {(validUser && (
        <Contract>
          <h2>This is a copy of your listing contract.</h2>
          <div className="keep__left">
            <div className="review__content__div">
              <div className="col1">
                <h3>Concert Recording (Private)</h3>
                <ReactPlayer
                  url={concertData?.concertRecording}
                  width={315}
                  height={200}
                  playing={false}
                  controls={true}
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              </div>
              <div className="col2">
                <h3>Promo Clip (Public)</h3>
                {!concertData?.concertPromoClip && (
                  <div className="no__promo__clip">
                    <div className="pad__me">
                      <span className="with__emp">Missing Promo Clip</span>
                    </div>
                    <br />
                    This is not required but it is recommended.
                  </div>
                )}
                {concertData?.concertPromoClip && (
                  <ReactPlayer
                    url={concertData?.concertPromoClip}
                    width={315}
                    height={200}
                    playing={false}
                    controls={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
            <div className="my__columns">
              <div className="text__info__div">
                <p className="text__info__header">
                  This is a listing contract for:
                  <br />
                  <span className="with__emp">{concertData?.concertName}</span>
                </p>
                <div className="text__info__scroll__area">
                  <p>
                    Performance Date: <br />
                    <span className="with__emp">
                      {dateFormat(
                        concertData?.concertPerformanceDate,
                        "m/d/yyyy, h:MM TT "
                      )}{" "}
                    </span>
                  </p>
                  <p>
                    Venue: <br />
                    <span className="with__emp">
                      {concertData?.concertVenue}
                    </span>
                  </p>
                  <p className="no__overflow">
                    Location: <br />
                    <span className="with__emp">
                      {concertData?.concertLocation}
                    </span>
                  </p>
                  {concertData?.concertTourName && (
                    <p>
                      Tour Name: <br />
                      <span className="with__emp">
                        {concertData?.concertTourName}
                      </span>
                    </p>
                  )}
                  {concertData?.concertLiveAttendance && (
                    <p>
                      Live Attendance: <br />
                      <span className="with__emp">
                        {concertData?.concertLiveAttendance}
                      </span>
                    </p>
                  )}
                  <p>
                    Recording Type:
                    <br />
                    <span className="with__emp">
                      {" "}
                      {concertData?.concertRecordingType}
                    </span>
                  </p>

                  {concertData?.concertDescription && (
                    <p>
                      Description: <br />
                      <span className="with__emp">
                        {concertData?.concertDescription}
                      </span>
                    </p>
                  )}

                  <p className="setlist__title">
                    Setlist - {concertData?.concertNumSongs} Songs{" "}
                  </p>
                  {displaySongs()}

                  <p>
                    NFT Supply: <br />
                    <span className="with__emp">
                      {concertData?.concertSupply}
                    </span>
                  </p>
                  <p>
                    Price per NFT: <br />
                    <img
                      src="/media/eth-logo.png"
                      height={15}
                      className="c__eth__logo"
                    />
                    <span className="with__emp">{formatPrice}</span>{" "}
                    <span className="c__price__in__usd">(${priceInUSD})</span>
                  </p>
                  <p>
                    Secondary Sale Fee: <br />
                    <span className="with__emp">{resaleFee}%</span>
                    <span className="c__price__in__usd">
                      {concertData?.concertResaleFee > 0 && (
                        <>({concertData?.concertResaleFee}% Artist Fee + 5% </>
                      )}
                      NFT Concerts Fee
                      {concertData?.concertResaleFee > 0 && <>)</>}
                    </span>
                  </p>
                  <p>
                    NFT Drop Date and Time: <br />
                    <span className="with__emp">
                      {dateFormat(
                        concertData?.concertReleaseDate,
                        "m/d/yyyy, h:MM TT Z "
                      )}
                    </span>
                  </p>

                  <p>
                    Listing Privacy: <br />
                    <span className="with__emp">
                      {concertData?.concertListingPrivacy}
                    </span>
                  </p>
                </div>
              </div>
              <div className="token__div">
                <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
                <div className="token__box">
                  <div className="token__header">
                    <div className="first__third">
                      <p>
                        {dateFormat(
                          concertData?.concertPerformanceDate,
                          "m/d/yyyy"
                        )}
                      </p>
                    </div>
                    <div className="col__thirds">
                      <div className="missing__tab" />
                    </div>
                    <div className="last__third">
                      <p>TOTAL QTY: {concertData?.concertSupply}</p>
                    </div>
                  </div>
                  <div className="token__thumbnail__box">
                    <img
                      src={concertData?.concertThumbnailImage + "?not-cache"}
                      height="300px"
                    />
                  </div>
                  <div className="token__footer">
                    <div className="token__concert__name">
                      {concertData?.concertName}
                    </div>
                    <div className="token__concert__name token__artist__name">
                      {concertData?.concertArtist}
                    </div>
                    <img
                      src="/media/nftc-logo.png"
                      className="center__logo token__logo"
                      alt="NFT Concerts Logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="confirmation__button__div">
            <input
              type="button"
              value="Back to My Account"
              className="login__button c__back__button"
              onClick={() => {
                navigate("/my-account");
              }}
            />
            <input
              type="button"
              value="Request Edits"
              className="login__button c__confirm__button"
            />
          </div>
        </Contract>
      )) || <Contract>Only the uploader may view the contact</Contract>}
    </>
  );
};

export default ContractPage;
