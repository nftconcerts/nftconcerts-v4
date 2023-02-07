import React, { useState, useEffect } from "react";
import "./Marketplace.css";
import { ref as dRef, onValue } from "firebase/database";
import { db, fetchCurrentUser } from "../../firebase";
import { useNavigate } from "react-router-dom";
import MintPopUp from "../popup/MintPopUp";
import _ from "lodash";
import { Helmet } from "react-helmet";

const Marketplace = () => {
  const [showMintPopUp, setShowMintPopUp] = useState(false);
  const [singleConcert, setSingleConcert] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  let navigate = useNavigate();
  const [concertData, setConcertData] = useState();
  const [userData, setUserData] = useState();
  const [showRecType, setShowRecType] = useState(false);
  const [showNumSongs, setShowNumSongs] = useState(false);
  const [showPerfDate, setShowPerfDate] = useState(false);
  const [showRelDate, setShowRelDate] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showVenues, setShowVenues] = useState(false);

  const [multicamFilter, setMulticamFilter] = useState(false);
  const [singlecamFilter, setSinglecamFilter] = useState(false);

  const [numSongsFilter, setNumSongsFilter] = useState(false);
  const [songFilterError, setSongFilterError] = useState();
  const [minSongs, setMinSongs] = useState(1);
  const [maxSongs, setMaxSongs] = useState(20);
  const [tempMin, setTempMin] = useState();
  const [tempMax, setTempMax] = useState();

  const [sortChoice, setSortChoice] = useState("Release Date");
  const [showSortChange, setShowSortChange] = useState(false);

  const [reverseSort, setReverseSort] = useState(false);
  const [mintingFilter, setMintingFilter] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  const clearFilters = () => {
    setReverseSort(false);
    setNumSongsFilter(false);
    setMulticamFilter(false);
    setSinglecamFilter(false);
    setMintingFilter(false);
  };
  //get concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, []);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  const sidebarArtist = () => {
    var concertArray = Object.values(concertData).filter((n) => n);
    var arrayLength = concertArray.length;
    const artists = [];
    for (var i = 0; i < arrayLength; i++) {
      artists.push(
        <a
          href={"/concert/" + concertArray[i].concertId}
          className="sidebar__item__div sidebar__button sidebar__link"
        >
          <p>{concertArray[i].concertArtist}</p>
          <i className="fa-solid fa-user"></i>
        </a>
      );
    }
    const uniqueArtists = [...new Set(artists)];
    const artistRows = [];
    for (var i = 0; i < uniqueArtists.length; i++) {
      artistRows.push(
        <div className="sidebar__item__div" key={i}>
          <p>{uniqueArtists[i]}</p>
          <i className="fa-solid fa-user"></i>
        </div>
      );
    }
    return artists;
  };

  const sidebarVenue = () => {
    var concertArray = Object.values(concertData).filter((n) => n);
    var arrayLength = concertArray.length;
    const venues = [];
    const venueRows = [];
    for (var i = 0; i < arrayLength; i++) {
      venues.push(
        <a
          href={"/concert/" + concertArray[i].concertId}
          className="sidebar__item__div sidebar__button sidebar__link"
        >
          <p>{concertArray[i].concertVenue}</p>
          <i className="fa-solid fa-warehouse"></i>
        </a>
      );
    }
    const uniqueVenues = [...new Set(venues)];

    for (var i = 0; i < uniqueVenues.length; i++) {
      venueRows.push(
        <div className="sidebar__item__div" key={i}>
          <p>{uniqueVenues[i]}</p>
          <i className="fa-solid fa-warehouse"></i>
        </div>
      );
    }
    return venues;
  };

  const sidebarLocation = () => {
    var concertArray = Object.values(concertData).filter((n) => n);

    const venueRows = [];
    for (var i = 0; i < concertArray.length; i++) {
      venueRows.push(
        <a
          href={"/concert/" + concertArray[i].concertId}
          className="sidebar__item__div sidebar__button sidebar__link"
        >
          <p>{concertArray[i].concertLocation}</p>
          <i className="fa-solid fa-location-crosshairs"></i>
        </a>
      );
    }
    return venueRows;
  };

  //Filter not setup for audio only at this point -- lazy move
  const showMarketConcerts = () => {
    var concertArray = Object.values(concertData).filter((n) => n);
    if (mintingFilter) {
      concertArray = _.filter(concertArray, function (o) {
        let remaining = parseInt(o.concertSupply) - o.mintID + 1;
        if (remaining && remaining > 0) {
          console.log(o.concertName);
          return o;
        } else return null;
      });
    }
    if (multicamFilter && !singlecamFilter) {
      concertArray = _.filter(concertArray, {
        concertRecordingType: "MultiCam Video",
      });
    } else if (singlecamFilter && !multicamFilter) {
      concertArray = _.filter(concertArray, {
        concertRecordingType: "SingleCam Video",
      });
    }
    if (numSongsFilter) {
      concertArray = _.filter(concertArray, function (o) {
        console.log("Num songs: ", parseInt(o.concertNumSongs));
        console.log("Min: ", minSongs, " | Max: ", maxSongs);
        if (
          minSongs <= parseInt(o.concertNumSongs) &&
          parseInt(o.concertNumSongs) <= maxSongs
        ) {
          return o;
        } else return null;
      });
    }

    if (sortChoice === "Price") {
      concertArray = _.sortBy(concertArray, [
        function (o) {
          return parseFloat(o.concertPrice);
        },
      ]);
    }
    if (sortChoice === "Performance Date") {
      concertArray = _.sortBy(concertArray, [
        function (o) {
          return new Date(o.concertPerformanceDate);
        },
      ]);
    }
    if (sortChoice === "Rarity") {
      concertArray = _.sortBy(concertArray, [
        function (o) {
          return parseFloat(o.concertSupply);
        },
      ]);
    }
    if (reverseSort) {
      concertArray = concertArray.reverse();
    }
    var arrayLength = concertArray.length;
    const concerts = [];
    for (var i = 0; i < arrayLength; i++) {
      let tempNum = concertArray[i].concertId;
      concerts.push(
        <div
          className={
            (showSidebar && "market__concert__div stack__concerts") ||
            "market__concert__div"
          }
          key={i}
        >
          <div
            className="market__concert__content"
            onMouseEnter={() => {
              setSingleConcert(concertArray[i].concertId);
            }}
          >
            <h3 className="mp__concert__name">
              {concertArray[i].concertName} by {concertArray[i].concertArtist}
            </h3>

            <img
              src={concertArray[i].concertTokenImage}
              className="mp__token__image"
            />
            <p className="mp__concert__duration">
              {concertArray[i]?.concertRecordingType} -{" "}
              {concertArray[i]?.concertDuration}
            </p>
            <div className="mp__info">
              <div className="mp__concert__info__div">
                <p className="mp__concert__info">
                  {concertArray[i].concertSupply}
                </p>{" "}
                <p className="mp__concert__info__name"> Total Qty</p>
              </div>
              <div className="mp__concert__info__div">
                <p className="mp__concert__info">
                  {parseInt(concertArray[i].concertSupply) -
                    parseInt(concertArray[i]?.mintID) +
                    1}
                </p>
                <p className="mp__concert__info__name">Available</p>
              </div>
              <div className="mp__concert__info__div">
                <p className="mp__concert__info">
                  <img
                    src="/media/eth-logo.png"
                    height="20"
                    class="c__eth__logo white__eth__logo"
                    alt="eth logo"
                  />{" "}
                  {parseFloat(concertArray[i].concertPrice)}
                </p>
                <p className="mp__concert__info__name">Price</p>
              </div>
            </div>
            <div className="mp__buttons__div">
              <button
                className="market__button"
                onClick={(e) => {
                  navigate("/concert/" + tempNum);
                }}
              >
                <div className="mp__button__inner">Info</div>
              </button>
              <button
                className="market__button market__play__button"
                onClick={() => {
                  setSingleConcert(tempNum);
                  setShowMintPopUp(true);
                }}
              >
                <div className="mp__button__inner">
                  <span className="tab__hidden__text"> Mint </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return concerts;
  };

  return (
    <>
      {concertData && (
        <div className="market__page">
          <Helmet>
            <title>NFT Concerts Marketplace</title>
            <meta
              name="description"
              content="Own the Show - Discover, Collect, and Unlock Limited Edition Concert Recordings"
            />
          </Helmet>
          {showMintPopUp && singleConcert && (
            <MintPopUp
              currentUser={currentUser}
              concertData={concertData[singleConcert]}
              concertID={singleConcert}
              setShowMintPopUp={setShowMintPopUp}
              setCurrentUser={setCurrentUser}
            />
          )}
          <div
            className={
              (showSidebar && "market__container stack__market") ||
              "market__container"
            }
          >
            <div
              className={
                (showSidebar && "hide__sidebar hidden__sidebar__col") ||
                "hidden__sidebar__col"
              }
            >
              <i
                className="fa-solid fa-bars reverse__sort__button hidden__sidebar__button"
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              />
            </div>
            <div
              className={
                (showSidebar && "show__hidden__sidebar market__sidebar__col") ||
                "market__sidebar__col"
              }
            >
              <i
                className="fa-regular fa-square-caret-left reverse__sort__button hidden__sidebar__button  main__sidebar__button"
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              />
              <div
                className="sidebar__item__div sidebar__button"
                onClick={() => {
                  setMintingFilter(true);
                }}
              >
                Minting Now
              </div>
              <div
                className="sidebar__item__div sidebar__button"
                onClick={clearFilters}
              >
                Show All
              </div>
              <div className="sidebar__item__spacer" />

              <div
                className="sidebar__item__div sidebar__button"
                onClick={() => {
                  setShowRecType(!showRecType);
                }}
              >
                <h3 className="sidebar__item__title">Recording Type</h3>
                {(showRecType && <i className="fa-solid fa-minus" />) || (
                  <i className="fa-solid fa-plus" />
                )}
              </div>
              {showRecType && (
                <>
                  <div className="sidebar__item__div">
                    <p>MultiCam Video</p>
                    <div
                      className="sidebar__checkbox"
                      onClick={() => {
                        setMulticamFilter(!multicamFilter);
                      }}
                    >
                      {multicamFilter && <i className="fa-solid fa-check" />}
                    </div>
                  </div>
                  <div className="sidebar__item__div">
                    <p>SingleCam Video</p>
                    <div
                      className="sidebar__checkbox"
                      onClick={() => {
                        setSinglecamFilter(!singlecamFilter);
                      }}
                    >
                      {singlecamFilter && <i className="fa-solid fa-check" />}
                    </div>
                  </div>
                  <div className="sidebar__item__div disabled__sidebar__item__div">
                    <p>Audio Only</p> <div className="sidebar__checkbox"></div>
                  </div>
                </>
              )}
              <div className="sidebar__item__spacer" />
              <div
                className="sidebar__item__div sidebar__button"
                onClick={() => {
                  setShowNumSongs(!showNumSongs);
                }}
              >
                <h3 className="sidebar__item__title">Number of Songs</h3>
                {(showNumSongs && <i className="fa-solid fa-minus" />) || (
                  <i className="fa-solid fa-plus" />
                )}
              </div>
              {showNumSongs && (
                <>
                  <div className="sidebar__item__div">
                    <div className="sidebar__input__div">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="sidebar__num__input"
                        placeholder="1"
                        onChange={(e) => {
                          setTempMin(e.target.value);
                        }}
                      />
                    </div>
                    <div className="sidebar__input__split">to</div>
                    <div className="sidebar__input__div">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="sidebar__num__input"
                        placeholder="20"
                        onChange={(e) => {
                          setTempMax(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="sidebar__item__div sidebar__apply__button"
                    onClick={() => {
                      if (!tempMin) {
                        setSongFilterError("Set Minimum Songs");
                      } else if (!tempMax) {
                        setSongFilterError("Set Maxmimum Songs");
                      } else if (tempMin > tempMax) {
                        setSongFilterError("Error - Min > Max");
                      } else {
                        setSongFilterError();
                        setMinSongs(tempMin);
                        setMaxSongs(tempMax);
                        setNumSongsFilter(true);
                      }
                    }}
                  >
                    Apply
                  </div>
                  {songFilterError && (
                    <div className="song__filter__error">{songFilterError}</div>
                  )}
                </>
              )}
              <div className="sidebar__item__spacer" />
              <div
                className="sidebar__item__div sidebar__button"
                onClick={() => {
                  setShowArtists(!showArtists);
                }}
              >
                <h3 className="sidebar__item__title">Artists</h3>
                {(showArtists && <i className="fa-solid fa-minus" />) || (
                  <i className="fa-solid fa-plus" />
                )}
              </div>
              {showArtists && sidebarArtist()}

              <div className="sidebar__item__spacer" />
              <div
                className="sidebar__item__div sidebar__button"
                onClick={() => {
                  setShowVenues(!showVenues);
                }}
              >
                <h3 className="sidebar__item__title">Venues</h3>
                {(showVenues && <i className="fa-solid fa-minus" />) || (
                  <i className="fa-solid fa-plus" />
                )}
              </div>
              {showVenues && sidebarVenue()}

              <div className="sidebar__item__spacer" />
              <div
                className="sidebar__item__div sidebar__button"
                onClick={() => {
                  setShowLocations(!showLocations);
                }}
              >
                <h3 className="sidebar__item__title">Locations</h3>
                {(showLocations && <i className="fa-solid fa-minus" />) || (
                  <i className="fa-solid fa-plus" />
                )}
              </div>
              {showLocations && sidebarLocation()}

              <div className="sidebar__item__spacer" />
            </div>
            <div className="market__col">
              <div className="market__topbar__container">
                <div className="market__topbar">
                  <div className="topbar__filters">
                    <div className="topbar__quantity">
                      {showMarketConcerts().length} NFT Concerts
                    </div>
                    {mintingFilter && (
                      <div
                        className="filter__button"
                        onClick={() => {
                          setMintingFilter(false);
                        }}
                      >
                        Minting Now
                        <i className="fa-solid fa-xmark filter__button__icon" />
                      </div>
                    )}
                    {multicamFilter && (
                      <div
                        className="filter__button"
                        onClick={() => {
                          setMulticamFilter(false);
                        }}
                      >
                        MultiCam Video
                        <i className="fa-solid fa-xmark filter__button__icon" />
                      </div>
                    )}
                    {singlecamFilter && (
                      <div
                        className="filter__button"
                        onClick={() => {
                          setSinglecamFilter(false);
                        }}
                      >
                        SingleCam Video
                        <i className="fa-solid fa-xmark filter__button__icon" />
                      </div>
                    )}
                    {numSongsFilter && (
                      <div
                        className="filter__button"
                        onClick={() => {
                          setNumSongsFilter(false);
                        }}
                      >
                        {minSongs} {maxSongs > minSongs && <>to {maxSongs}</>}{" "}
                        {(maxSongs > 1 && <>Songs</>) || <>Song</>}
                        <i className="fa-solid fa-xmark filter__button__icon" />
                      </div>
                    )}
                  </div>
                  <div className="topbar__sort">
                    <div
                      className="sort__select"
                      onClick={() => {
                        setShowSortChange(!showSortChange);
                      }}
                    >
                      <p>{sortChoice}</p>
                    </div>
                    {(reverseSort && (
                      <i
                        className="fa-solid fa-arrow-up-long reverse__sort__button"
                        onClick={() => {
                          setReverseSort(false);
                        }}
                      />
                    )) || (
                      <i
                        className="fa-solid fa-arrow-down-long reverse__sort__button"
                        onClick={() => {
                          setReverseSort(true);
                        }}
                      />
                    )}
                    {showSortChange && (
                      <div className="sort__pop__container">
                        <div
                          className="sort__pop__option"
                          onClick={() => {
                            setSortChoice("Release Date");
                            setShowSortChange(false);
                          }}
                        >
                          Release Date
                        </div>
                        <div
                          className="sort__pop__option"
                          onClick={() => {
                            setSortChoice("Price");
                            setShowSortChange(false);
                          }}
                        >
                          Price
                        </div>
                        <div
                          className="sort__pop__option"
                          onClick={() => {
                            setSortChoice("Performance Date");
                            setShowSortChange(false);
                          }}
                        >
                          Performance Date
                        </div>
                        <div
                          className="sort__pop__option"
                          onClick={() => {
                            setSortChoice("Rarity");
                            setShowSortChange(false);
                          }}
                        >
                          Rarity
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="marketplace__container">
                {showMarketConcerts()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Marketplace;
