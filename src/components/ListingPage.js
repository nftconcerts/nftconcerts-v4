import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import "./ListingPage.css";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { db, fetchCurrentUser } from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import dateFormat from "dateformat";
import { GetUSDExchangeRate } from "./api";

const ListingPage = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let concertID = parseInt(searchParams.get("id"));
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [recordingSrc, setRecordingSrc] = useState("");
  const [formatPrice, setFormatPrice] = useState("");
  const [validListing, setValidListing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  //format concert eth price
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice) < 1) {
      setFormatPrice("0" + concertData?.concertPrice);
    } else setFormatPrice(concertData?.concertPrice);
  }, [concertData]);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
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
    if (parseFloat(concertData?.concertPrice)) {
      var newPrice = parseFloat(concertData?.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (concertData?.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

  //pull individual concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/" + concertID + "/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
      console.log("concert Data: ", cData);
      setRecordingSrc(cData.concertRecording);
      if (cData.listingApproval === "Approved") {
      }
    });
  }, [currentUser, concertID]);

  var twitterLink =
    "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Listen%20to%20this%20insane%20performance%20by%20" +
    encodeURI(concertData?.concertArtist) +
    "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%3Fid%3D" +
    concertID +
    "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

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
            <div className=" player__song__div">
              <p className="player__song__num">{n}:</p>
              <p className=" player__song__n">
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
    <div className="player__page">
      {(concertData?.concertPromoClip && (
        <>
          <div className="promo__clip__disclaimer">
            Enjoy this promo clip. Purchase the NFT Concert to unlock the full
            performance recording.{" "}
          </div>
          <div className="media__player__div">
            <ReactPlayer
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                  },
                },
              }}
              url={concertData?.concertPromoClip}
              width="100%"
              height="100%"
              playing={false}
              controls={true}
            />
          </div>
        </>
      )) || (
        <div className="media__player__div">
          <div className="no__clip">
            <h3 className="promo__h3">No Promo Clip.</h3>
            <p>Only token owners will have access to the show recording.</p>
            <div className="buy__button__box no__clip__button">
              <button className="buy__now my__button preview__button buy__now__button">
                <div className="inside__button__div">
                  <div>Buy Now</div>{" "}
                  <div className="button__price">
                    <img
                      src="/media/eth-logo.png"
                      height={25}
                      className="c__eth__logo white__eth__logo"
                    />
                    {formatPrice}{" "}
                    <span className="c__price__in__usd button__usd__price">
                      (${priceInUSD})
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="c__token__info__div">
        <div className="c__token__info__box">
          <div className="c__token__remaining">
            Available: {concertData?.concertSupply}
          </div>
          <div className="c__token__supply">
            Total Supply: {concertData?.concertSupply}
          </div>
          <div className="c__token__price">
            Price:{" "}
            <img
              src="/media/eth-logo.png"
              height={20}
              className="c__eth__logo white__eth__logo"
            />
            {formatPrice}{" "}
            <span className="c__price__in__usd">(${priceInUSD})</span>
          </div>
        </div>
      </div>
      <div className="split__col">
        <div className="concert__info__div">
          {(concertData?.concertPromoClip && (
            <div className="buy__button__box">
              <button className="buy__now my__button preview__button buy__now__button">
                <div className="inside__button__div">
                  <div>Buy Now</div>{" "}
                  <div className="button__price">
                    <img
                      src="/media/eth-logo.png"
                      height={25}
                      className="c__eth__logo white__eth__logo"
                    />
                    {formatPrice}{" "}
                    <span className="c__price__in__usd button__usd__price">
                      (${priceInUSD})
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )) || <></>}

          <h1 className="c__name">{concertData?.concertName}</h1>
          <div className="underplayer__buttons__div listing__buttons__div">
            <a href={twitterLink} target="_blank">
              <button className="fa-brands fa-twitter player__icon__button" />
            </a>
            <button
              className="fa-solid fa-play player__icon__button"
              onClick={() => {
                navigate("/player?id=" + concertID);
              }}
            />
          </div>
          <h3 className="c__detail">
            <i class="fa-solid fa-user c__icons" title="Artist" />
            {concertData?.concertArtist}
          </h3>
          <h3 className="c__detail">
            <i class="fa-solid fa-calendar c__icons" title="Performance Date" />
            {concertData?.concertPerformanceDate}
          </h3>

          <h3 className="c__detail">
            <i class="fa-solid fa-warehouse c__icons" title="Venue" />
            {concertData?.concertVenue}
          </h3>
          <h3 className="c__detail">
            <i
              class="fa-solid fa-location-crosshairs c__icons"
              title="Location"
            />
            {concertData?.concertLocation}
          </h3>
          {concertData?.concertTourName && (
            <h3 className="c__detail">
              <i class="fa-solid fa-van-shuttle c__icons" title="Tour" />
              {concertData?.concertTourName}
            </h3>
          )}
          {concertData?.concertLiveAttendance && (
            <h3 className="c__detail">
              <i class="fa-solid fa-users-line c__icons" title="Tour" />
              {concertData?.concertLiveAttendance}
            </h3>
          )}
          <h3 className="c__detail">
            <i class="fa-solid fa-video c__icons" title="Recording Type" />
            {concertData?.concertRecordingType}
          </h3>
          <p className="c__description">{concertData?.concertDescription}</p>
          <div className="setlist__div">
            <h3 className="c__detail player__setlist__title">
              Setlist - {concertData?.concertNumSongs} Songs
            </h3>
            {displaySongs()}
          </div>
        </div>
        <div className="token__div player__token__div">
          <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
          <div className="token__box">
            <div className="token__header">
              <div className="first__third">
                <p>
                  {dateFormat(concertData?.concertPerformanceDate, "m/d/yyyy")}
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
          <div className="final__buy__button__div mobile__show">
            <button className="buy__now my__button preview__button buy__now__button">
              <div className="inside__button__div">
                <div>Buy Now</div>{" "}
                <div className="button__price">
                  <img
                    src="/media/eth-logo.png"
                    height={25}
                    className="c__eth__logo white__eth__logo"
                  />
                  {formatPrice}{" "}
                  <span className="c__price__in__usd button__usd__price">
                    (${priceInUSD})
                  </span>
                </div>
              </div>
            </button>
          </div>
          <input
            type="button"
            value="View on Opensea"
            className="login__button view__token__button"
            onClick={() => {
              window.open("https://opensea.io/collection/nftconcerts");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
