import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import "./ListingPage.css";
import "./upload/Confirmation.css";
import { useNavigate, useParams } from "react-router-dom";
import { db, fetchCurrentUser, truncateAddress } from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import dateFormat from "dateformat";
import FormBox from "./form/FormBox";
import { useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
import { editionDropAddress } from "./../scripts/getContract.mjs";
import { Helmet } from "react-helmet";
import { GetUSDExchangeRate } from "./api";
import MintPopUp from "./MintPopUp";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const Player = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  let concertID = id;
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [validUser, setValidUser] = useState(false);
  const [userData, setUserData] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [owned, setOwned] = useState(0);
  const [validListing, setValidListing] = useState(false);
  const [formatPrice, setFormatPrice] = useState();
  const resaleFee = parseFloat(concertData?.concertResaleFee) + 5;
  const { contract } = useContract(editionDropAddress);

  const { data: activeClaimCondition } = useActiveClaimCondition(
    contract,
    concertID
  );
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  //format concert eth price
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice) < 1) {
      setFormatPrice(parseFloat(concertData?.concertPrice));
    } else setFormatPrice(parseFloat(concertData?.concertPrice));
  }, [concertData]);

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
    }
  }, [
    currentUser,
    userData,
    owned,
    userData?.walletID,
    concertData?.uploaderWalletID,
  ]);

  const checkIfOwned = async (userAddress) => {
    try {
      const balance = await contract.balanceOf(userAddress, concertID);
      const balanceNum = parseInt(balance.toString());
      setOwned(balanceNum);
      if (balanceNum > 0) {
        setValidUser(true);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (userData?.walletID) {
      checkIfOwned(userData?.walletID);
    }
    delayCheck();
  }, [userData, concertID, concertData]);

  const delayCheck = async () => {
    await delay(1000);
    if (userData?.walletID) {
      checkIfOwned(userData?.walletID);
    }
  };

  const [showMintPopUp, setShowMintPopUp] = useState(false);

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

  //displays the splits.
  const displaySplits = () => {
    var splitRows = [];
    var rowNums = parseInt(concertData?.splits.members);

    for (var i = 1; i <= rowNums; i++) {
      const splitDiv = (n) => {
        const tempSplit = concertData?.splits[n];

        return (
          <div className=" player__song__div">
            <p className="player__percent__num">{tempSplit.percent}%</p>
            <p className=" player__split__n">
              <span className="song__emp">{tempSplit.name}</span>
            </p>
            <p className=" player__split__a">
              <span className="song__emp">
                <a
                  href={"https://etherscan.io/address/" + tempSplit.address}
                  target="_blank"
                  rel="noreferrer"
                >
                  {truncateAddress(tempSplit.address)}
                </a>
              </span>
            </p>
          </div>
        );
      };
      splitRows.push(splitDiv(i));
    }

    return splitRows;
  };
  //show notification when url is copied
  const [copyNoti, setCopyNoti] = useState(false);

  const showCopyNoti = async () => {
    setCopyNoti(true);
    await delay(1500);
    setCopyNoti(false);
  };
  //darken the background for better streaming exp
  const turnOffLights = () => {
    document.getElementsByClassName("player__page")[0].style.backgroundColor =
      "black";
    document.getElementsByClassName("lp__info__bot__fade")[0].style.background =
      "linear-gradient(#00000000, #000 80%)";
    document.getElementsByClassName("lp__info__top__fade")[0].style.background =
      "linear-gradient(#000000 35%, #00000000 100%)";
    document.getElementsByClassName("lp__info__columns")[0].style.background =
      "#101010aa";
    document.getElementsByClassName("pp__info__container")[0].style.background =
      "#000000cc";
    setDarkMode(true);
  };

  //chagne the background back to grey
  const turnOnLights = () => {
    document.getElementsByClassName("player__page")[0].style.backgroundColor =
      "#101010";
    document.getElementsByClassName("lp__info__bot__fade")[0].style.background =
      "linear-gradient(#10101000, #101010 80%)";
    document.getElementsByClassName("lp__info__top__fade")[0].style.background =
      "linear-gradient(#101010 35%, #10101000 100%)";
    document.getElementsByClassName("lp__info__columns")[0].style.background =
      "none";
    document.getElementsByClassName("pp__info__container")[0].style.background =
      "#none";
    setDarkMode(false);
  };

  //tweet link that user is watching this performance
  var twitterLink =
    "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Watching%20an%20insane%20performance%20by%20" +
    encodeURI(concertData?.concertArtist) +
    "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%2F" +
    concertID +
    "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

  var mailLink =
    "mailto:?subject=Check Out this NFT Concert - " +
    concertData?.concertName +
    " by " +
    concertData?.concertArtist +
    "&body=This performance is amazing - https://nftconcerts.com/concert/" +
    concertID;

  //check if listing is valid

  useEffect(() => {
    if (concertData?.listingApproval === "Approved") {
      setValidListing(true);
    }
  }, [concertData]);

  //control the list maximum
  const [maxList, setMaxList] = useState(8);
  const [showExpandList, setShowExpandList] = useState(true);
  const [listView, setListview] = useState(false);

  //show the audience list based on spply and sales data
  const showAudienceList = () => {
    var audienceRows = [];

    if (concertData?.concertSupply === "") {
      return (
        <div className="no__songs__error">Please set the number of tokens.</div>
      );
    } else {
      for (var i = 1; i <= maxList; i++) {
        const singlesale = concertData.sales[i];

        const rowDiv = (n) => {
          var saledate;
          var buyerData;
          if (singlesale) {
            saledate = new Date(singlesale.date);
            var buyerDataRef = dRef(db, "users/" + singlesale.buyerUID);
            onValue(buyerDataRef, (snapshot) => {
              var data = snapshot.val();
              buyerData = data;
            });
          }
          return (
            <div className=" audience__list__div">
              <p className="list__token__num">{n}:</p>
              <p className=" list__tx__date">
                <span className="song__emp">
                  {" "}
                  {(singlesale && (
                    <>
                      {saledate.toLocaleTimeString() +
                        ", " +
                        saledate.toLocaleDateString()}
                    </>
                  )) ||
                    "Not Minted"}
                </span>
              </p>
              <p className=" list__audience__name">
                <span className="song__emp">{buyerData?.name}</span>
              </p>
              <div className="list__audience__member__image__div">
                {(singlesale && (
                  <img
                    src={buyerData?.image}
                    className="audience__member__image list__audience__member__image"
                    alt="Buyer Thumbnail"
                  />
                )) || (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fmissing%20m1.jpg?alt=media&token=3d1222d8-711f-4bc4-a074-b7d4f77268a1"
                    className="audience__member__image list__audience__member__image empty__member"
                    alt="Empty Buyer Placeholder"
                  />
                )}
              </div>
              <div className="marketplace__icon__div list__icon__div">
                {(singlesale && (
                  <a
                    href={"https://etherscan.io/tx/" + singlesale.tx}
                    className="marketplace__icon__div list__icon__div"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="/media/etherscan-logo.png"
                      className="marketplace__icon"
                      alt="Etherscan Logo"
                    />
                  </a>
                )) || (
                  <img
                    src="/media/etherscan-logo.png"
                    className="marketplace__icon"
                    alt="Etherscan Logo"
                  />
                )}
              </div>
            </div>
          );
        };
        audienceRows.push(rowDiv(i));
      }
      return audienceRows;
    }
  };

  //show the audience based on the supply and sales data

  const [maxAudience, setMaxAudience] = useState(10);
  const [showExpandAudience, setShowExpandAudience] = useState(true);
  const [width, setWidth] = useState();

  useEffect(() => {
    if (!showExpandAudience) {
    } else if (maxAudience > parseInt(concertData?.concertSupply)) {
      setMaxAudience(concertData.concertSupply);
      setShowExpandAudience(false);
    } else if (width > 2016) {
      setMaxAudience(18);
    } else if (width > 1686) {
      setMaxAudience(15);
    } else if (width > 1356) {
      setMaxAudience(16);
    } else if (width > 1026) {
      setMaxAudience(12);
    } else if (width > 936) {
      setMaxAudience(15);
    } else if (width > 756) {
      setMaxAudience(16);
    } else if (width > 576) {
      setMaxAudience(12);
    } else {
      setMaxAudience(10);
    }
  }, [width, concertData]);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };
  const showAudience = () => {
    var audienceRows = [];
    for (var i = 1; i <= maxAudience; i++) {
      const sale = concertData?.sales[i];

      const audience = (i) => {
        var saledate;
        var buyerData;
        if (sale) {
          saledate = new Date(sale.date);
          var buyerDataRef = dRef(db, "users/" + sale.buyerUID);
          onValue(buyerDataRef, (snapshot) => {
            var data = snapshot.val();
            buyerData = data;
          });
        }
        return (
          <div className="audience__member__div">
            {(sale && (
              <div className="sales__div">
                <div className="sale__hover__div">
                  <div className="hover__buyer__name">{buyerData?.name}</div>
                  <div className="hover__buyer__date">
                    <div className="hover__date__text">
                      {saledate.toLocaleTimeString() +
                        ", " +
                        saledate.toLocaleDateString()}
                    </div>
                    <div className="hover__eth__logo__div">
                      <a
                        href={"https://etherscan.io/tx/" + sale.tx}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/media/etherscan-logo.png"
                          alt="Etherscan Logo"
                          className="hover__eth__logo"
                        />
                      </a>
                    </div>
                  </div>
                </div>
                {buyerData?.productionRank === "1" && (
                  <div
                    className="audprod__div"
                    onClick={() => {
                      navigate("/production-team");
                    }}
                  >
                    <div className="apt__info__hover apt__team__hover">
                      Production Team
                    </div>
                    <div className="audience__production__team__icon__div">
                      <img
                        src="/media/production-team-icon.jpg"
                        className="audience__production__team__icon"
                        alt="Production Team Icon"
                      />
                    </div>
                  </div>
                )}
                {buyerData?.productionRank === "2" && (
                  <div
                    className="audprod__div"
                    onClick={() => {
                      navigate("/production-team");
                    }}
                  >
                    <div className="apt__info__hover">Production Lead</div>
                    <div className="audience__production__team__icon__div">
                      <img
                        src="/media/production-lead-icon.jpg"
                        className="audience__production__team__icon"
                        alt="Production Lead Icon"
                      />
                    </div>
                  </div>
                )}
                <img
                  src={buyerData?.image}
                  className="audience__member__image"
                  alt="Audience Member"
                />
              </div>
            )) || (
              <div className="sales__div">
                <div className="not__minted__div">
                  <div className="hover__text">Not Minted</div>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fmissing%20m1.jpg?alt=media&token=3d1222d8-711f-4bc4-a074-b7d4f77268a1"
                    className="audience__member__image empty__member"
                    alt="Empty Audience Member"
                  />
                </div>
              </div>
            )}
          </div>
        );
      };

      audienceRows.push(audience(i));
    }

    return (
      <>
        <div className="audience__view__div">
          {(listView && (
            <button
              onClick={() => {
                setListview(false);
                setMaxList(8);
                setShowExpandList(true);
              }}
              className="audience__view__button"
            >
              <i className="fa-solid fa-people-group" />
            </button>
          )) || (
            <button
              onClick={() => {
                setListview(true);
              }}
              className="audience__view__button"
            >
              <i className="fa-solid fa-list" />
            </button>
          )}{" "}
        </div>
        <div className="audience__header">
          <h3>Audience</h3>
        </div>
        {(listView && (
          <div className="list__view__div">
            <div className="list__div">
              <div className="audience__list__header">
                <p className="list__token__header">Mint #</p>
                <p className="list__tx__date__header">Date</p>
                <p className="list__audience__name__header">Collector</p>
                <p className="list__tx__header">Tx</p>
              </div>
              <div className="audience__list__container__div">
                {showAudienceList()}
              </div>
              {(showExpandList && (
                <div className="expand__list__container">
                  <div className="expand__list__div">
                    <button
                      onClick={() => {
                        setMaxList(concertData?.concertSupply);
                        setShowExpandList(false);
                      }}
                      className="expand__list__button"
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                  </div>
                </div>
              )) || (
                <div className="close__list__floating__container">
                  <div className="close__list__floating__div">
                    {" "}
                    <button
                      onClick={() => {
                        setMaxList(8);
                        setShowExpandList(true);
                      }}
                      className="expand__list__button  collapse__list__button"
                    >
                      <i className="fa-solid fa-minus" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )) || (
          <>
            {" "}
            <div className="stadium__view__div">
              {audienceRows}{" "}
              {(showExpandAudience && (
                <div className="expand__audience__container">
                  <div className="expand__audience__div">
                    {" "}
                    <button
                      onClick={() => {
                        setMaxAudience(concertData?.concertSupply);
                        setShowExpandAudience(false);
                      }}
                      className="my__button preview__button buy__now__button lp__buy__button"
                    >
                      Show All{" "}
                      <i className="fa-solid fa-plus in__button__icon" />
                    </button>
                  </div>
                </div>
              )) || (
                <>
                  <div className="close__list__floating__container">
                    <div className="close__list__floating__div">
                      {" "}
                      <button
                        onClick={() => {
                          setMaxAudience(10);
                          setShowExpandAudience(true);
                          setWidth(width + 1);
                        }}
                        className="expand__list__button  collapse__list__button"
                      >
                        <i className="fa-solid fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="expand__audience__container collapse__audience__container">
                    <div className="expand__audience__div">
                      {" "}
                      <button
                        onClick={() => {
                          setMaxAudience(10);
                          setShowExpandAudience(true);
                          setWidth(width + 1);
                        }}
                        className="my__button preview__button buy__now__button lp__buy__button"
                      >
                        Collapse{" "}
                        <i className="fa-solid fa-minus in__button__icon" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {validListing && (
        <>
          {(currentUser === null && (
            <FormBox>
              <div className="no__user">
                <h3>No Current User. </h3>
                <p>
                  Please Register or Login
                  <br /> to Watch the Show{" "}
                </p>
                <button
                  className="login__button"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Go To Login Page
                </button>
                <button
                  className="login__button"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  New User? Sign Up
                </button>
              </div>
            </FormBox>
          )) || (
            <>
              {showMintPopUp && (
                <MintPopUp
                  currentUser={currentUser}
                  concertData={concertData}
                  concertID={concertID}
                  setShowMintPopUp={setShowMintPopUp}
                  setCurrentUser={setCurrentUser}
                />
              )}
              <div className="player__page">
                <Helmet>
                  <title>
                    {concertData?.concertName} by {concertData?.concertArtist} -
                    NFT Concert #{`${concertID} `}
                  </title>
                  <meta
                    name="description"
                    content={concertData?.concertDescription}
                  />
                </Helmet>
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
                        You must own the NFT Concert to unlock the show.
                      </h3>
                      <input
                        type="button"
                        value="Go To Marketplace"
                        className="buy__now my__button preview__button buy__now__button mp__buy__button"
                        onClick={() => {
                          navigate("/concert/" + concertID);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  className="banner__bkg"
                  style={{
                    backgroundImage: `url(${concertData?.concertBanner})`,
                  }}
                >
                  <div className="pp__info__container">
                    <div className="lp__info__top__fade" />
                    <div className="lp__info__header">
                      <h1 className="lp__concert__title">
                        {concertData?.concertName} by{" "}
                        {concertData?.concertArtist}
                      </h1>
                    </div>
                    <div className="lp__info__div">
                      <div className="lp__info__columns">
                        <div className="lp__info__col1">
                          <img
                            src={concertData?.concertTokenImage}
                            className="token__image__image"
                            alt="NFT Concert Token Preview"
                          />

                          <div className="mint__progress__bar__container">
                            <div className="mint__progress__bar__div">
                              <div
                                className="mint__progress__bar__inner"
                                style={{
                                  width: `${
                                    ((concertData?.concertSupply -
                                      activeClaimCondition?.availableSupply) *
                                      100) /
                                    concertData?.concertSupply
                                  }%`,
                                }}
                              />
                            </div>
                            <div className="lp__mint__progress__div">
                              {activeClaimCondition?.availableSupply}/{" "}
                              {concertData?.concertSupply} Available
                            </div>
                          </div>

                          <button
                            className="my__button preview__button buy__now__button lp__buy__button"
                            onClick={() => {
                              setShowMintPopUp(true);
                            }}
                            disabled={!activeClaimCondition}
                          >
                            <div className="inside__button__div">
                              <div>Mint</div>{" "}
                              <div className="button__price">
                                <img
                                  src="/media/eth-logo.png"
                                  height={25}
                                  className="c__eth__logo white__eth__logo"
                                  alt="eth logo"
                                />
                                {parseFloat(formatPrice)}{" "}
                                <span className="c__price__in__usd button__usd__price">
                                  (${(priceInUSD * 1).toFixed(2)})
                                </span>
                              </div>
                            </div>
                          </button>

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
                          </div>
                        </div>
                        <div className="lp__info__col2">
                          {/* {releaseDate > nowDate && (
                  <div className="drop__date__div">
                    <div className="drop__date__highlight">
                      <h3 className="drop__date__header">
                        Minting {productionDate?.toLocaleDateString()}
                      </h3>
                      Production Team -{" "}
                      {dateFormat(productionDate, "h:MM TT Z")}
                      <br />
                      Public Sale - {dateFormat(releaseDate, "h:MM TT Z")}
                    </div>
                  </div>
                )} */}
                          <div className="lp__share__div hide__700">
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
                            <a
                              href={twitterLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <button className="fa-brands fa-twitter player__icon__button" />
                            </a>
                            <a href={mailLink} target="_blank" rel="noreferrer">
                              <button className="fa-solid fa-envelope player__icon__button" />
                            </a>

                            <button
                              className="fa-solid fa-clipboard player__icon__button"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  window.location.href
                                );
                                showCopyNoti();
                              }}
                            />
                          </div>
                          {copyNoti && (
                            <div className="lp__share__div copy__noti">
                              URL Copied
                            </div>
                          )}
                          {(owned === 0 && (
                            <h3 className="c__name">Mint to Unlock the Show</h3>
                          )) || <h3 className="c__name">You Own the Show</h3>}
                          {owned > 1 && (
                            <h3 className="owned__info">
                              {owned}x Copies Owned of{" "}
                              {concertData?.concertSupply}
                            </h3>
                          )}
                          {owned === 1 && (
                            <h3 className="owned__info">
                              {owned} Copy Owned of {concertData?.concertSupply}
                            </h3>
                          )}

                          {(owned === 0 && (
                            <button
                              className="mp__button"
                              onClick={() => {
                                navigate("/concert/" + concertID);
                              }}
                            >
                              <span>
                                Go to Marketplace{" "}
                                <i className="fa-solid fa-dollar-sign lp__play__now__icon" />
                              </span>
                            </button>
                          )) || (
                            <button
                              className=" mp__button"
                              onClick={() => {
                                navigate("/concert/" + concertID);
                              }}
                            >
                              <span>
                                Go to Marketplace{" "}
                                <i className="fa-solid fa-dollar-sign lp__play__now__icon" />
                              </span>
                            </button>
                          )}

                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-user c__icons"
                              title="Artist"
                            />
                            {concertData?.concertArtist}
                          </h3>
                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-video c__icons"
                              title="Recording Type"
                            />
                            {concertData?.concertRecordingType}
                          </h3>
                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-clock-rotate-left c__icons"
                              title="Duration"
                            />
                            {concertData?.concertDuration}
                          </h3>
                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-calendar c__icons"
                              title="Performance Date"
                            />
                            {dateFormat(
                              concertData.concertPerformanceDate,
                              "m/d/yyyy, h:MM TT"
                            )}
                          </h3>

                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-warehouse c__icons"
                              title="Venue"
                            />
                            {concertData?.concertVenue}
                          </h3>
                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-location-crosshairs c__icons"
                              title="Location"
                            />
                            {concertData?.concertLocation}
                          </h3>
                          {concertData?.concertTourName && (
                            <h3 className="c__detail">
                              <i
                                className="fa-solid fa-van-shuttle c__icons"
                                title="Tour"
                              />
                              {concertData?.concertTourName}
                            </h3>
                          )}
                          {concertData?.concertLiveAttendance && (
                            <h3 className="c__detail">
                              <i
                                className="fa-solid fa-users-line c__icons"
                                title="Tour"
                              />
                              {concertData?.concertLiveAttendance}
                            </h3>
                          )}

                          <h3 className="c__detail">
                            <i
                              className="fa-solid fa-chart-pie c__icons"
                              title="Duration"
                            />
                            {resaleFee}% Resale Fee
                          </h3>
                          <p className="c__description tablet__hide">
                            {concertData?.concertDescription}
                          </p>
                          <div className="player__setlist__div tablet__hide">
                            <h3 className="player__setlist__title">
                              Setlist - {concertData?.concertNumSongs} Songs
                            </h3>
                            {displaySongs()}
                          </div>
                          {concertData?.splits && (
                            <div className="player__setlist__div tablet__hide">
                              <h3 className="c__detail player__setlist__title">
                                Splits Contract -{" "}
                                <a
                                  href={
                                    "https://app.0xsplits.xyz/accounts/" +
                                    concertData?.splits.contract
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="splits__link"
                                >
                                  {truncateAddress(
                                    concertData?.splits.contract
                                  )}
                                </a>
                              </h3>
                              {displaySplits()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="tablet__info">
                        <p className="c__description">
                          {concertData?.concertDescription}
                        </p>
                        <div className="player__setlist__div">
                          <h3 className="player__setlist__title">
                            Setlist - {concertData?.concertNumSongs} Songs
                          </h3>
                          {displaySongs()}
                        </div>
                        {concertData?.splits && (
                          <div className="player__setlist__div">
                            <h3 className="c__detail player__setlist__title">
                              Splits Contract -{" "}
                              <a
                                href={
                                  "https://app.0xsplits.xyz/accounts/" +
                                  concertData?.splits.contract
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="splits__link"
                              >
                                {truncateAddress(concertData?.splits.contract)}
                              </a>
                            </h3>
                            {displaySplits()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="c__token__info__div audience__info__div">
                      <p>
                        Mint this NFT Concert for a Permanent Spot in the
                        Audience
                      </p>
                    </div>
                    <div className="lp__info__bot__fade" />
                  </div>
                </div>
                <div className="audience__div">
                  <div className="audience__content">{showAudience()}</div>
                </div>
              </div>
            </>
          )}
        </>
      )}

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

export default Player;
