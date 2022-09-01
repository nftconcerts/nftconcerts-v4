import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";

import "./upload/Confirmation.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db, fetchCurrentUser } from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import dateFormat from "dateformat";
import { useAddress } from "@thirdweb-dev/react";
import checkProductionTeam from "../scripts/checkProductionTeam";
import FormBox from "./form/FormBox";
import { useEditionDrop } from "@thirdweb-dev/react";
import { editionDropAddress } from "./../scripts/getContract.mjs";

const Player = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let concertID = parseInt(searchParams.get("id"));
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [validUser, setValidUser] = useState(false);
  const [userData, setUserData] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [owned, setOwned] = useState(0);
  const address = useAddress();

  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //download concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/" + concertID + "/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, [concertID]);

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

  //check if user is admin or uploader
  useEffect(() => {
    if (userData?.userType === "admin") {
      setValidUser(true);
    } else if (userData?.userType === "artist") {
      if (userData?.walletID === concertData?.uploaderWalletID) {
        setValidUser(true);
      }
    } else if (owned > 0) {
      setValidUser(true);
    }
  }, [currentUser, userData, owned]);

  //check if user owns the proper token
  const editionDropped = useEditionDrop(editionDropAddress);

  const checkIfOwned = async (userAddress) => {
    try {
      const balance = await editionDropped.balanceOf(userAddress, concertID);
      const balanceNum = parseInt(balance.toString());

      setOwned(balanceNum);
      if (balanceNum > 0) setValidUser(true);
    } catch (err) {
      console.log("Fucked up check.");
    }
  };

  useEffect(() => {
    if (address) {
      checkIfOwned(address);
    }
  }, [address]);

  //display the setlist
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

  //darken the background for better streaming exp
  const turnOffLights = () => {
    document.getElementsByClassName("player__page")[0].style.backgroundColor =
      "black";
    setDarkMode(true);
  };

  //chagne the background back to grey
  const turnOnLights = () => {
    document.getElementsByClassName("player__page")[0].style.backgroundColor =
      "#373737";
    setDarkMode(false);
  };

  //tweet link that user is watching this performance
  var twitterLink =
    "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Watching%20an%20insane%20performance%20by%20" +
    encodeURI(concertData?.concertArtist) +
    "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%3Fid%3D" +
    concertID +
    "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

  //check if user is holding production team NFT
  const [productionTeam, setProductionTeam] = useState(false);

  const productionCheck = async () => {
    if (address) {
      var checkResult = await checkProductionTeam(address);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    } else if (!address && userData?.walletID) {
      var checkResultMobile = await checkProductionTeam(userData.walletID);
      if (checkResultMobile[0] > 0) {
        setProductionTeam(true);
      } else if (checkResultMobile[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    }
  };

  useEffect(() => {
    productionCheck();
  }, [address, userData]);

  return (
    <>
      {!productionTeam && (
        <FormBox>
          <div className="not__production__div">
            {" "}
            <h3>
              {" "}
              You must be a member of the production team to view this site.
            </h3>
            <img
              src="/media/production-team.jpg"
              className="production__team__image__two"
              alt="NFT Concerts Production Team NFT"
            />
            <button
              onClick={() => {
                navigate("/");
              }}
              className="login__button"
            >
              Join Now
            </button>
          </div>
        </FormBox>
      )}
      {productionTeam && (
        <div className="player__page">
          <div className="media__player__div">
            {(validUser && (
              <ReactPlayer
                config={{
                  file: {
                    attributes: {
                      onContextMenu: (e) => e.preventDefault(),
                      controlsList: "nodownload",
                    },
                  },
                }}
                width="100%"
                height="100%"
                playing={false}
                controls={true}
                url={concertData?.concertRecording}
              />
            )) || (
              <div className="not__valid__watcher">
                <h3 className="not__valid__watcher__text">
                  You must own the token to watch the content.
                </h3>
                <input
                  type="button"
                  value="Go To Marketplace"
                  className="buy__now my__button preview__button buy__now__button"
                  onClick={() => {
                    navigate("/concert?id=" + concertID);
                  }}
                />
              </div>
            )}
          </div>
          <div className="split__col">
            <div className="concert__info__div">
              <div className="underplayer__buttons__div">
                {!darkMode && (
                  <button
                    className="fa-solid fa-lightbulb player__icon__button"
                    onClick={turnOffLights}
                  />
                )}
                {darkMode && (
                  <button
                    className="fa-solid fa-lightbulb player__icon__button"
                    onClick={turnOnLights}
                  />
                )}

                <a href={twitterLink} target="_blank" rel="noreferrer">
                  <button className="fa-brands fa-twitter player__icon__button" />
                </a>
                <button
                  className="fa-solid fa-dollar-sign player__icon__button"
                  onClick={() => {
                    navigate("/concert?id=" + concertID);
                  }}
                />
              </div>
              <h1 className="c__name">{concertData?.concertName}</h1>
              {owned > 1 && (
                <h3 className="owned__info">
                  {owned}x Copies Owned of {concertData?.concertSupply}
                </h3>
              )}
              {owned === 1 && (
                <h3 className="owned__info">
                  {owned} Copy Owned of {concertData?.concertSupply}
                </h3>
              )}
              {owned === 0 && (
                <h3 className="owned__info">Mint to access the show.</h3>
              )}
              <h3 className="c__detail">
                <i class="fa-solid fa-user c__icons" title="Artist" />
                {concertData?.concertArtist}
              </h3>
              <h3 className="c__detail">
                <i
                  class="fa-solid fa-calendar c__icons"
                  title="Performance Date"
                />
                {dateFormat(
                  concertData.concertPerformanceDate,
                  "m/d/yyyy, h:MM TT"
                )}
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
            <div className="token__div player__token__div">
              <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
              <img
                src={concertData?.concertTokenImage}
                className="token__image__image"
                alt="NFT Concert Token Preview"
              />

              <div className="final__buy__button__div">
                <button
                  className="buy__now my__button preview__button buy__now__button"
                  onClick={() => {
                    navigate(`/concert?id=${concertID}`);
                  }}
                >
                  <div className="inside__button__div">
                    <div>Go To Marketplace</div>{" "}
                  </div>
                </button>
              </div>
              <div className="marketplace__icons__div token__div__icons">
                <div
                  className="marketplace__icon__div"
                  onClick={() => {
                    window.open(
                      `https://looksrare.org/collections/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${concertID}`
                    );
                  }}
                >
                  <img
                    src="/media/looksrare-logo.png"
                    className="marketplace__icon invert__icon"
                    alt="LooksRare Logo"
                  />
                </div>
                <div
                  className="marketplace__icon__div"
                  onClick={() => {
                    window.open(
                      `https://opensea.io/assets/ethereum/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${concertID}`
                    );
                  }}
                >
                  <img
                    src="/media/opensea-logo.png"
                    className="marketplace__icon"
                    alt="OpenSea Logo"
                  />
                </div>
                <div
                  className="marketplace__icon__div"
                  onClick={() => {
                    window.open(
                      `https://x2y2.io/eth/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${concertID}`
                    );
                  }}
                >
                  <img
                    src="/media/x2y2-logo.png"
                    className="marketplace__icon"
                    alt="X2Y2 Logo"
                  />
                </div>
                <div
                  className="marketplace__icon__div"
                  onClick={() => {
                    window.open(
                      `https://etherscan.io/token/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a?a=${concertID}`
                    );
                  }}
                >
                  <img
                    src="/media/etherscan-logo.png"
                    className="marketplace__icon"
                    alt="Etherscan Logo"
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
      )}
    </>
  );
};

export default Player;
