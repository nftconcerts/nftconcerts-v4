import React, { useState, useEffect } from "react";
import "./Row.css";
import YouTube from "react-youtube";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
import { GetUSDExchangeRate } from "../api";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { db } from "./../../firebase";
import ReactPlayer from "react-player";

function Row({ title, isLargeRow, concertData, concerts }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [singleConcert, setSingleConcert] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
    },
  };

  const handleClick = (concert) => {
    if (trailerUrl) {
      setTrailerUrl("");
      setSingleConcert([]);
    } else {
      setTrailerUrl("full");
      setSingleConcert(concert);
    }
  };

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, [singleConcert]);

  useEffect(() => {
    var concertPrice = parseFloat(concertData[singleConcert]?.concertPrice);
    if (0.05) {
      var newPrice = concertPrice * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else setPriceInUSD("err");
  }, [singleConcert, usdExRate]);

  return (
    <div className={`row ${isLargeRow && "row1"}`}>
      <h2 className="row__title">{title}</h2>
      {/* container -> posters */}

      {concertData && (
        <div className="row__posters">
          {/* {concerts.map((concertID) => (
          // <div className="token__box">
          //   <div className="token__header">
          //     <div className="first__third">
          //       <p>
          //         {dateFormat(
          //           concertData[concertID]?.concertPerformanceDate,
          //           "m/d/yyyy"
          //         )}
          //       </p>
          //     </div>
          //     <div className="col__thirds">
          //       <div className="missing__tab" />
          //     </div>
          //     <div className="last__third">
          //       <p>TOTAL QTY: {concertData[concertID]?.concertSupply}</p>
          //     </div>
          //   </div>
          //   <div className="token__thumbnail__box">
          //     <img
          //       src={
          //         concertData[concertID]?.concertThumbnailImage + "?not-cache"
          //       }
          //       height="300px"
          //     />
          //   </div>
          //   <div className="token__footer">
          //     <div className="token__concert__name">
          //       {concertData[concertID]?.concertName}
          //     </div>
          //     <div className="token__concert__name token__artist__name">
          //       {concertData[concertID]?.concertArtist}
          //     </div>
          //     <img
          //       src="/media/nftc-logo.png"
          //       className="center__logo token__logo"
          //       alt="NFT Concerts Logo"
          //     />
          //   </div>
          // </div>
        ))} */}
          {concerts.map((concert) => (
            <img
              key={concert}
              onClick={() => handleClick(concert)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={concertData[concert]?.concertTokenImage}
              alt={"Babs.0 NFT Concert"}
            />
          ))}
        </div>
      )}
      {concertData && trailerUrl && (
        <div className="click__preview">
          <div>
            <h1 className="preview__title">
              {concertData[singleConcert]?.concertName} -{" "}
              {concertData[singleConcert]?.concertArtist}
            </h1>
            <p className="performance__info">
              {concertData[singleConcert]?.concertRecordingType}
            </p>

            {(concertData[singleConcert]?.concertPromoClip && (
              <div className="row__media__player">
                <ReactPlayer
                  config={{
                    file: {
                      attributes: {
                        onContextMenu: (e) => e.preventDefault(),
                        controlsList: "nodownload",
                      },
                    },
                  }}
                  url={concertData[singleConcert]?.concertPromoClip}
                  width="100%"
                  height="100%"
                  playing={true}
                  controls={true}
                  muted={true}
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              </div>
            )) || (
              <>
                <div className="row__media__player no__media__player__row">
                  {" "}
                  <h3 className="promo__h3">No Promo Clip.</h3>
                  <p>
                    Only token owners will have access to the show recording.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="preview__contents">
            <div className="two__col">
              <div className="halfs performance__date">
                <p>
                  Performance Date:
                  <br className="desktop__hide" />{" "}
                  <b className="emph">
                    {concertData[singleConcert]?.concertPerformanceDate}
                  </b>
                </p>
              </div>
              <div className="halfs venue">
                <p>
                  Venue: <br className="desktop__hide" />{" "}
                  <b className="emph">
                    {concertData[singleConcert]?.concertVenue}
                  </b>
                </p>
              </div>
            </div>

            <div className="row_col2">
              <div className="three__col">
                <div className="thirds quantity">
                  <p>
                    Total Qty: <br className="desktop__hide" />{" "}
                    <b className="blow__up">
                      {concertData[singleConcert]?.concertSupply}
                    </b>
                  </p>
                </div>
                <div className="thirds remaining">
                  <p>
                    Remaining: <br className="desktop__hide" />{" "}
                    <b className="blow__up">
                      {concertData[singleConcert]?.concertSupply}
                    </b>
                  </p>
                </div>
                <div className="thirds price">
                  <p>
                    Price: <br className="desktop__hide" />{" "}
                    <b className="blow__up">
                      <img
                        src="/media/eth-logo.png"
                        height={25}
                        className="c__eth__logo"
                      />
                      {parseFloat(concertData[singleConcert]?.concertPrice)}
                    </b>
                    <span className="converted__currency">
                      {" "}
                      (${priceInUSD}){" "}
                    </span>
                  </p>
                </div>
              </div>
              <div className="buttons__box preview__buttons__box">
                <button
                  className="my__button preview__button"
                  onClick={() => navigate(`/concert?id=${singleConcert}`)}
                >
                  Learn More
                </button>
                <button className="buy__now my__button preview__button">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Row;
