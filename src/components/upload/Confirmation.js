import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import Contract from "../form/Contract";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import "./Confirmation.css";
import "./../form/FormBox.css";
import dateFormat from "dateformat";
import { GetUSDExchangeRate, GetETHExchangeRate } from "./../api";
import { db, fetchCurrentUser } from "../../firebase";
import { ref as dRef, set, runTransaction } from "firebase/database";

const Confirmation = ({ prevStep, values }) => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  const resaleFee = parseFloat(values.concertResaleFee) + 5;

  const [formatPrice, setFormatPrice] = useState("");

  useEffect(() => {
    if (parseFloat(values.concertPrice) < 1) {
      setFormatPrice("0" + values.concertPrice);
    } else setFormatPrice(values.concertPrice);
  }, []);

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
    if (parseFloat(values.concertPrice)) {
      var newPrice = parseFloat(values.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (values.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [values.concertPrice, usdExRate]);

  //displays the individual songs for the setlist coonfirmation
  const displaySongs = () => {
    var songRows = [];
    var rowNums = parseInt(values.concertNumSongs);
    if (values.concertNumSongs === "") {
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
                  {""} {values.concertSetList[n - 1]}
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

  // pushes formdata to database

  const pushFormData = async (concertId) => {
    var uploadDate = new Date();
    var uploadDateString = dateFormat(uploadDate, "m/d/yyyy, h:MM TT Z ");
    set(dRef(db, "concerts/" + concertId), {
      concertId: concertId,
      concertRecording: values.concertRecording,
      concertName: values.concertName,
      concertArtist: values.concertArtist,
      concertPerformanceDate: dateFormat(
        values.concertPerformanceDate,
        "m/d/yyyy, h:MM TT "
      ),
      concertVenue: values.concertVenue,
      concertLocation: values.concertLocation,
      concertTourName: values.concertTourName,
      concertLiveAttendance: values.concertLiveAttendance,
      concertRecordingType: values.concertRecordingType,
      concertDescription: values.concertDescription,
      concertNumSongs: values.concertNumSongs,
      concertSetList: values.concertSetList,
      concertThumbnailImage: values.concertThumbnailImage,
      concertPromoClip: values.concertPromoClip,
      concertPromoContent: "",
      concertSupply: values.concertSupply,
      concertPrice: values.concertPrice,
      concertResaleFee: values.concertResaleFee,
      concertReleaseDate: dateFormat(
        values.concertReleaseDate,
        "m/d/yyyy, h:MM TT "
      ),
      concertListingPrivacy: values.concertListingPrivacy,
      concertCompliance: "approved",
      listingApproval: "Awaiting Review",
      uploaderWalletID: currentUser.user.photoURL,
      uploaderUID: currentUser.user.uid,
      uploaderEmail: currentUser.user.email,
      uploadTime: uploadDateString,
    })
      .then(() => {
        set(
          dRef(
            db,
            "users/" + currentUser.user.uid + "/submittedConcerts/" + concertId
          ),
          {
            concertId: concertId,

            concertName: values.concertName,

            uploadTime: uploadDateString,
          }
        )
          .then(() => {
            console.log("data uploaded to db");
            alert("Listing Submitted");
            navigate("/my-account");
          })
          .catch((error) => {
            console.log(error);
            alert("Unsucccessful. Error: ", error);
          });
      })
      .catch((error) => {
        console.log("error");
        alert("Unsucccessful. Error: ", error);
      });
  };

  //pulls concert ID and increments, then attaches concert ID to form data and uploads.

  const [myConcertID, setMyConcertID] = useState("");

  const pushData = async () => {
    var concertIdRef = dRef(db, "concertID");
    runTransaction(concertIdRef, (concertID) => {
      if (concertID) {
        console.log("pushing form data with ID ", concertID);
        pushFormData(concertID);
        concertID++;
      }
      return concertID;
    });
  };

  return (
    <Contract>
      <h2>Please Review This Listing Contract Carefully</h2>
      <div className="keep__left">
        <div className="review__content__div">
          <div className="col1">
            <h3>Concert Recording (Private)</h3>
            <ReactPlayer
              url={values.concertRecording}
              width={315}
              height={200}
              playing={false}
              controls={true}
            />
          </div>
          <div className="col2">
            <h3>Promo Clip (Public)</h3>
            {!values.concertPromoClip && (
              <div className="no__promo__clip">
                <div className="pad__me">
                  <span className="with__emp">Missing Promo Clip</span>
                </div>
                <br />
                This is not required but it is recommended.
              </div>
            )}
            {values.concertPromoClip && (
              <ReactPlayer
                url={values.concertPromoClip}
                width={315}
                height={200}
                playing={false}
                controls={true}
              />
            )}
          </div>
        </div>
        <div className="my__columns">
          <div className="text__info__div">
            <p className="text__info__header">
              This is a listing contract for:
              <br />
              <span className="with__emp">{values.concertName}</span>
            </p>
            <div className="text__info__scroll__area">
              <p>
                Performance Date: <br />
                <span className="with__emp">
                  {dateFormat(
                    values.concertPerformanceDate,
                    "m/d/yyyy, h:MM TT "
                  )}{" "}
                </span>
              </p>
              <p>
                Venue: <br />
                <span className="with__emp">{values.concertVenue}</span>
              </p>
              <p className="no__overflow">
                Location: <br />
                <span className="with__emp">{values.concertLocation}</span>
              </p>
              {values.concertTourName && (
                <p>
                  Tour Name: <br />
                  <span className="with__emp">{values.concertTourName}</span>
                </p>
              )}
              {values.concertLiveAttendance && (
                <p>
                  Live Attendance: <br />
                  <span className="with__emp">
                    {values.concertLiveAttendance}
                  </span>
                </p>
              )}
              <p>
                Recording Type:
                <br />
                <span className="with__emp">
                  {" "}
                  {values.concertRecordingType}
                </span>
              </p>

              {values.concertDescription && (
                <p>
                  Description: <br />
                  <span className="with__emp">{values.concertDescription}</span>
                </p>
              )}

              <p className="setlist__title">
                Setlist - {values.concertNumSongs} Songs{" "}
              </p>
              {displaySongs()}

              <p>
                NFT Supply: <br />
                <span className="with__emp">{values.concertSupply}</span>
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
                  {values.concertResaleFee > 0 && (
                    <>({values.concertResaleFee}% Artist Fee + 5% </>
                  )}
                  NFT Concerts Fee{values.concertResaleFee > 0 && <>)</>}
                </span>
              </p>
              <p>
                NFT Drop Date and Time: <br />
                <span className="with__emp">
                  {dateFormat(
                    values.concertReleaseDate,
                    "m/d/yyyy, h:MM TT Z "
                  )}
                </span>
              </p>

              <p>
                Listing Privacy: <br />
                <span className="with__emp">
                  {values.concertListingPrivacy}
                </span>
              </p>
            </div>
          </div>
          <div className="token__div">
            <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
            <div className="token__box">
              <div className="token__header">
                <div className="first__third">
                  <p>{dateFormat(values.concertPerformanceDate, "m/d/yyyy")}</p>
                </div>
                <div className="col__thirds">
                  <div className="missing__tab" />
                </div>
                <div className="last__third">
                  <p>TOTAL QTY: {values.concertSupply}</p>
                </div>
              </div>
              <div className="token__thumbnail__box">
                <img
                  src={values.concertThumbnailImage + "?not-cache"}
                  height="300px"
                />
              </div>
              <div className="token__footer">
                <div className="token__concert__name">{values.concertName}</div>
                <div className="token__concert__name token__artist__name">
                  {values.concertArtist}
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
          value="Back to Edit"
          className="login__button c__back__button"
          onClick={prevStep}
        />
        <input
          type="button"
          value="Confirm with MetaMask"
          onClick={pushData}
          className="login__button c__confirm__button"
        />
      </div>
    </Contract>
  );
};

export default Confirmation;
