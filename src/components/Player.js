import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
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

  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
    console.log("Concert ID: ", concertID);
  }, []);

  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/" + concertID + "/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
      console.log("concert Data: ", cData);
      setRecordingSrc(cData.concertRecording);
    });
  }, [currentUser, concertID]);

  useEffect(() => {
    if (currentUser?.user.photoURL == concertData?.uploaderWalletID) {
      setValidUser(true);
    } else setValidUser(false);
  }, [currentUser, concertData, concertID]);

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
      <div className="media__player__div">
        {(validUser && (
          <ReactPlayer
            url={concertData?.concertRecording}
            width="100%"
            height="100%"
            playing={false}
            controls={true}
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
