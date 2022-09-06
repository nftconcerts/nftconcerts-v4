import React, { useState, useEffect } from "react";
import "./Row.css";
import { useNavigate } from "react-router-dom";
import { GetUSDExchangeRate } from "../api";
import { truncateAddress } from "./../../firebase";
import ReactPlayer from "react-player";
import { useActiveClaimCondition, useEditionDrop } from "@thirdweb-dev/react";
import editionDrop, { editionDropAddress } from "../../scripts/getContract.mjs";
import dateformat from "dateformat";
import { ethers } from "ethers";

function Row({ title, isLargeRow, concertData, concerts }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [singleConcert, setSingleConcert] = useState([]);
  let navigate = useNavigate();

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
    var newPrice = concertPrice * usdExRate;
    let roundedPrice = newPrice.toFixed(2);
    setPriceInUSD(roundedPrice);
  }, [singleConcert, usdExRate]);

  //get claim conditions for single concert
  let bigId = ethers.BigNumber.from(0);
  const { data: activeClaimCondition } = useActiveClaimCondition(
    editionDrop,
    bigId
  );

  //claim nft with the claim method
  // State to track when a user is claiming an NFT
  const editionDropped = useEditionDrop(editionDropAddress);
  const [claiming, setClaiming] = useState(false);
  const [tx, setTx] = useState();
  const [purchased, setPurchased] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);
  const claimButton = async () => {
    setClaiming(true);
    try {
      var result = await editionDropped.claim(singleConcert, 1);
      setTx(result);
      console.log("claimed", result);
      setClaiming(false);
      setPurchased(true);
      setShowPurchased(true);
    } catch (error) {
      console.log("Failed to claim. Error: ", error);
    }
  };

  var transactionLink =
    "https://etherscan.io/tx/" + tx?.receipt.transactionHash;
  return (
    <>
      {concertData && showPurchased && (
        <div className="home__purchased__pop__up__overlay__div">
          <div className="home__purchased__pop__up__div">
            <div className="close__pop__up__div">
              <i
                onClick={() => {
                  setShowPurchased(false);
                }}
                className="fa-solid fa-xmark close__icon__button"
              />{" "}
            </div>
            <h3 className="purchased__pop__up__heading">
              Congratulations, you've successfuly purchased <br />
            </h3>
            <h1 className="purchased__title">
              {concertData[singleConcert]?.concertName} by{" "}
              {concertData[singleConcert]?.concertArtist}
            </h1>
            <img
              src={concertData[singleConcert]?.concertTokenImage}
              className="home__purchased__token__img"
              alt="Purchased NFT Concert Token Preview"
            ></img>
            <h3 className="motto">You Own the Show</h3>
            <p className="motto">
              You Just Minted 1 Out of{" "}
              <span className="bold__text">
                {concertData[singleConcert]?.concertSupply}
              </span>{" "}
              Copies
            </p>
            <button
              className="buy__now my__button preview__button buy__now__button play__now__button"
              onClick={() => {
                navigate("/player?id=" + singleConcert);
              }}
            >
              <div className="play__now__button__div">
                Play Now <i className="fa-solid fa-play play__now__icon" />
              </div>
            </button>

            {purchased && (
              <div>
                <a
                  href={transactionLink}
                  target="_blank"
                  className="dark__link"
                  rel="noreferrer"
                >
                  View Your Receipt - TX:{" "}
                  {truncateAddress(tx?.receipt.transactionHash)}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={`row ${isLargeRow && "row1"}`}>
        <h2 className="row__title">{title}</h2>
        {/* container -> posters */}

        {concertData && (
          <div className="row__posters">
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
                {concertData[singleConcert]?.concertName} by{" "}
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
                  <div className="no__media__player__row">
                    {" "}
                    {/* <h3 className="promo__h3">No Promo Clip.</h3> */}
                    <img
                      onClick={() => navigate(`/concert?id=${singleConcert}`)}
                      className="no__promo__clip__token"
                      src={concertData[singleConcert]?.concertTokenImage}
                      alt={"Babs.0 NFT Concert"}
                    />
                    <p>Mint to Unlock the Show </p>
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
                      {dateformat(
                        concertData[singleConcert]?.concertPerformanceDate,
                        "m/d/yyyy, h:MM TT"
                      )}
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
                    <div>
                      <p>
                        Available: <br className="desktop__hide" />{" "}
                        <b className="blow__up">
                          {activeClaimCondition?.availableSupply}
                        </b>
                      </p>
                    </div>
                    {!activeClaimCondition?.availableSupply && (
                      <div className="dots__div">
                        <div class="dot-flashing"></div>
                      </div>
                    )}
                  </div>
                  <div className="thirds price">
                    <p>
                      Price: <br className="desktop__hide" />{" "}
                      <b className="blow__up">
                        <img
                          src="/media/eth-logo.png"
                          height={25}
                          className="c__eth__logo"
                          alt="eth logo"
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
                  <div className="preview__buttons__div">
                    <button
                      className="my__button preview__button"
                      onClick={() => navigate(`/concert?id=${singleConcert}`)}
                    >
                      Learn More
                    </button>
                    <button
                      className="buy__now my__button preview__button"
                      onClick={claimButton}
                      disabled={claiming || !activeClaimCondition}
                    >
                      Mint
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Row;
