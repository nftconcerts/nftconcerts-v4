import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import "./ListingPage.css";
import "./upload/Confirmation.css";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { db, fetchCurrentUser, truncateAddress } from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import dateFormat from "dateformat";
import { GetUSDExchangeRate } from "./api";
import FormBox from "./form/FormBox";
import { PaperCheckout } from "@paperxyz/react-client-sdk";
import {
  useActiveClaimCondition,
  useEditionDrop,
  useClaimNFT,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import editionDrop from "../scripts/getContract.mjs";
import { useAddress } from "@thirdweb-dev/react";

const ListingPage = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let concertID = parseInt(searchParams.get("id"));
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [recordingSrc, setRecordingSrc] = useState("");
  const [formatPrice, setFormatPrice] = useState("");
  const [validListing, setValidListing] = useState(false);
  const [metamaskDetected, setMetamaskDetected] = useState(false);
  const {
    data: activeClaimCondition,
    isLoading,
    error,
  } = useActiveClaimCondition(editionDrop, concertID);
  let address = useAddress();

  const { mutate: claimNft, isLoading: isClaiming } = useClaimNFT(editionDrop);

  //check claim conditions
  useEffect(() => {
    console.log("ACC: ", activeClaimCondition);
    console.log("NFT");
  }, [activeClaimCondition]);

  //format concert eth price
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice) < 1) {
      setFormatPrice(parseFloat(concertData?.concertPrice));
    } else setFormatPrice(parseFloat(concertData?.concertPrice));
  }, [concertData]);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  //price formatting
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
    });
    console.log("CD", concertData);
  }, [currentUser, concertID]);

  //check if listing is valid

  useEffect(() => {
    if (concertData?.listingApproval === "Approved") {
      setValidListing(true);
    }
  }, [concertData]);

  //custom twitter share link
  var twitterLink =
    "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Listen%20to%20this%20insane%20performance%20by%20" +
    encodeURI(concertData?.concertArtist) +
    "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%3Fid%3D" +
    concertID +
    "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

  //displays the songs.
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

  //claim button

  const editionDropped = useEditionDrop(
    "0x1A36D3eC36e258E85E6aC9c01872C9fF730Fc2E4"
  );

  // State to track when a user is claiming an NFT
  const [claiming, setClaiming] = useState(false);
  const [tx, setTx] = useState();
  const [purchased, setPurchased] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);
  var transactionLink =
    "https://etherscan.io/tx/" + tx?.receipt.transactionHash;

  // Claim our NFT with the claim method - (token id, quantity)
  const claimButton = async () => {
    setClaiming(true);
    try {
      var result = await editionDropped?.claim(concertID, 1);
      setTx(result);
      console.log("claimed", result);
      setClaiming(false);
      setPurchased(true);
      setShowPurchased(true);
      setOwned(owned + 1);
    } catch (error) {
      console.log("Failed to claim. Error: ", error);
      setClaiming(false);
    }
  };
  const [owned, setOwned] = useState(0);
  const checkIfOwned = async (userAddress) => {
    try {
      const balance = await editionDropped.balanceOf(userAddress, concertID);
      const balanceNum = parseInt(balance.toString());
      console.log("User owns ", balanceNum);
      setOwned(balanceNum);
    } catch (err) {
      console.log("Fucked up check.");
    }
  };

  const {
    data: ownedNFTs,
    isLoading3,
    error3,
  } = useOwnedNFTs(editionDrop, address);

  useEffect(() => {
    if (ownedNFTs) {
      console.log("users owns :", ownedNFTs);
      console.log("User has ", owned, " of id #", concertID);
    }
  }, [ownedNFTs, owned]);

  useEffect(() => {
    if (address) {
      checkIfOwned(address);
    }
  }, [address]);
  return (
    <>
      {concertData && showPurchased && (
        <div className="purchased__pop__up__overlay__div">
          <div className="purchased__pop__up__div">
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
              {concertData.concertName} by {concertData.concertArtist}
            </h1>
            <img
              src={concertData.concertTokenImage}
              className="purchased__token__img"
            ></img>
            <h3 className="motto">You Own the Show</h3>
            <p className="motto">
              Out of{" "}
              <span className="bold__text">{concertData?.concertSupply}</span>{" "}
              Copies, You Own <span className="bold__text">{owned}</span>
            </p>
            <button
              className="buy__now my__button preview__button buy__now__button play__now__button"
              onClick={() => {
                navigate("/player?id=" + concertID);
              }}
              disabled={!owned}
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
                >
                  View Your Receipt - TX:{" "}
                  {truncateAddress(tx?.receipt.transactionHash)}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      {validListing && (
        <div className="player__page">
          {(concertData?.concertPromoClip && (
            <>
              <div className="promo__clip__disclaimer">
                Enjoy this promo clip. Purchase the NFT Concert to unlock the
                full performance recording.{" "}
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
                <div className="buy__button__box">
                  <button
                    className="buy__now my__button preview__button buy__now__button"
                    onClick={claimButton}
                    disabled={claiming}
                  >
                    <div className="inside__button__div">
                      <div>Mint</div>{" "}
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
                  {purchased && (
                    <div className="transaction__result">
                      Purchase Completed - TX:{" "}
                      <a href={transactionLink} target="_blank">
                        {truncateAddress(tx?.receipt.transactionHash)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="c__token__info__div">
            <div className="c__token__info__box">
              <div className="c__token__remaining">
                Available:
                <br className="mobile__show" />{" "}
                {activeClaimCondition?.availableSupply}
              </div>
              <div className="c__token__supply">
                Total Supply:
                <br className="mobile__show" /> {concertData?.concertSupply}
              </div>
              <div className="c__token__price">
                Price: <br className="mobile__show" />
                <img
                  src="/media/eth-logo.png"
                  height={20}
                  className="c__eth__logo white__eth__logo"
                />
                {formatPrice}{" "}
                <span className="c__price__in__usd mobile__hide">
                  (${priceInUSD})
                </span>
              </div>
            </div>
          </div>
          <div className="split__col">
            <div className="concert__info__div">
              {(concertData?.concertPromoClip && (
                <div className="buy__button__box__left">
                  <button
                    className="buy__now my__button preview__button buy__now__button"
                    onClick={claimButton}
                    disabled={claiming}
                  >
                    <div className="inside__button__div">
                      <div>Mint</div>{" "}
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
                  {purchased && (
                    <div className="transaction__result">
                      Purchase Completed - TX:{" "}
                      <a href={transactionLink} target="_blank">
                        {truncateAddress(tx?.receipt.transactionHash)}
                      </a>
                    </div>
                  )}
                </div>
              )) || <></>}

              <h1 className="c__name">{concertData?.concertName}</h1>
              {owned > 1 && (
                <h3 className="owned__info">
                  {owned}x Copies Owned of {concertData?.concertSupply}
                </h3>
              )}
              {owned == 1 && (
                <h3 className="owned__info">
                  {owned} Copy Owned of {concertData?.concertSupply}
                </h3>
              )}
              {owned == 0 && (
                <h3 className="owned__info">Mint to access the show.</h3>
              )}
              <div className="underplayer__buttons__div listing__buttons__div">
                <a href={twitterLink} target="_blank">
                  <button className="fa-brands fa-twitter player__icon__button" />
                </a>
                <button
                  className="fa-solid fa-play player__icon__button"
                  onClick={() => {
                    navigate("/player?id=" + concertID);
                  }}
                  disabled={!owned}
                />
              </div>
              <h3 className="c__detail">
                <i class="fa-solid fa-user c__icons" title="Artist" />
                {concertData?.concertArtist}
              </h3>
              <h3 className="c__detail">
                <i
                  class="fa-solid fa-calendar c__icons"
                  title="Performance Date"
                />
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
              <p className="c__description">
                {concertData?.concertDescription}
              </p>
              <div className="setlist__div">
                <h3 className="c__detail player__setlist__title">
                  Setlist - {concertData?.concertNumSongs} Songs
                </h3>
                {displaySongs()}
              </div>
            </div>
            <div className="token__div__container">
              <div className="token__div player__token__div">
                <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
                <img
                  src={concertData?.concertTokenImage}
                  className="token__image__image"
                />

                <div className="final__buy__button__div">
                  <button
                    className="buy__now my__button preview__button buy__now__button"
                    onClick={claimButton}
                    disabled={claiming}
                  >
                    <div className="inside__button__div">
                      <div>Mint</div>{" "}
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
                  {purchased && (
                    <div className="transaction__result">
                      Purchase Completed - TX:{" "}
                      <a
                        href={transactionLink}
                        target="_blank"
                        className="dark__link"
                      >
                        {truncateAddress(tx?.receipt.transactionHash)}
                      </a>
                    </div>
                  )}
                </div>
                <div className="marketplace__icons__div token__div__icons">
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://x2y2.io/eth/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/x2y2-logo.png"
                      className="marketplace__icon"
                    />
                  </div>
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://looksrare.org/collections/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/looksrare-logo.png"
                      className="marketplace__icon invert__icon"
                    />
                  </div>
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/ethereum/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30/${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/opensea-logo.png"
                      className="marketplace__icon"
                    />
                  </div>
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://etherscan.io/token/0x9B45C979D1FfE99aAe1aa5A9b27888E6b9C39c30?a=${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/etherscan-logo.png"
                      className="marketplace__icon"
                    />
                  </div>
                  {/* {metamaskDetected && (
                  <PaperCheckout
                    checkoutId="73baf406-11e0-4b74-8b3e-300908c7b0ee"
                    display="DRAWER"
                    options={{
                      width: 400,
                      height: 800,
                      colorBackground: "#131313",
                      colorPrimary: "#b90000",
                      colorText: "#b90000",
                      borderRadius: 6,
                      fontFamily: "Saira",
                    }}
                  >
                    <div className="marketplace__icon__div">
                      <img
                        src="/media/cc-logo.png"
                        className="marketplace__icon"
                      />
                    </div>
                  </PaperCheckout>
                )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {!validListing && (
        <FormBox>
          <div className="not__valid__listing__div">
            <h3>This is not a valid listing.</h3>
            <button onClick={() => navigate("/")} className="login__button">
              Go Home
            </button>
            <button
              onClick={() => navigate("/my-account")}
              className="login__button"
            >
              My Account
            </button>
          </div>
        </FormBox>
      )}
    </>
  );
};

export default ListingPage;
