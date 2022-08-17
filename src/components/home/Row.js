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

  const routeChange = (concert) => {
    console.log("learn to change pages idiot");
  };
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
    console.log(concert);
  };

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
    if (0.05) {
      var newPrice = 0.05 * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

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
              onClick={() => handleClick()}
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
            <h1 className="preview__title">Babs.0 NFT Concert</h1>
            <p className="performance__info">
              SingleCam Video - 17 mins 09 secs
            </p>
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
                url="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/private%2FKDMcAsrw7PNgCyKZW9Q9qWz5Q0u1%2FPromoClip%2FOfQ1F-babspoint0%20nft%20concert%20promo%20clip%20v2.mp4?alt=media&token=15cb0612-9809-4e06-a4be-a7bf53af7102"
                width="100%"
                height="100%"
                playing={false}
                controls={true}
              />
            </div>
          </div>
          <div className="preview__contents">
            <div className="two__col">
              <div className="halfs performance__date">
                <p>
                  Performance Date:
                  <br className="desktop__hide" />{" "}
                  <b className="emph">11/12/2021</b>
                </p>
              </div>
              <div className="halfs venue">
                <p>
                  Venue: <br className="desktop__hide" />{" "}
                  <b className="emph">Babs.0 Home Studio</b>
                </p>
              </div>
            </div>

            <div className="row_col2">
              <div className="three__col">
                <div className="thirds quantity">
                  <p>
                    Total Qty: <br className="desktop__hide" />{" "}
                    <b className="blow__up">100</b>
                  </p>
                </div>
                <div className="thirds remaining">
                  <p>
                    Remaining: <br className="desktop__hide" />{" "}
                    <b className="blow__up">100</b>
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
                      0.05
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
                  onClick={() => navigate("/concert?id=8")}
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
