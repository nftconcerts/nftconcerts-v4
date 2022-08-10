import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { db, fetchCurrentUser } from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import dateFormat from "dateformat";

const Player = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let concertID = parseInt(searchParams.get("id"));
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [recordingSrc, setRecordingSrc] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userData, setUserData] = useState();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //download concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/" + concertID + "/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
      setRecordingSrc(cData.concertRecording);
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
    console.log(userData?.userType);
    if (userData?.userType === "admin") {
      setValidUser(true);
    } else if (userData?.userType === "artist") {
      if (userData?.walletID === concertData?.uploaderWalletID) {
        setValidUser(true);
      }
    } else setValidUser(false);
  }, [currentUser, userData]);

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

  const turnOffLights = () => {
    document.getElementsByClassName("player__page")[0].style.backgroundColor =
      "black";
    setDarkMode(true);
  };

  const turnOnLights = () => {
    document.getElementsByClassName("player__page")[0].style.backgroundColor =
      "#373737";
    setDarkMode(false);
  };

  var twitterLink =
    "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Watching%20an%20insane%20performance%20by%20" +
    encodeURI(concertData?.concertArtist) +
    "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%3Fid%3D" +
    concertID +
    "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

  return (
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

            <a href={twitterLink} target="_blank">
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
          <input
            type="button"
            value="Go To Marketplace"
            className="login__button view__token__button"
            onClick={() => {
              navigate("/concert?id=" + concertID);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
