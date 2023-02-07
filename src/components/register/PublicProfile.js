import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, truncateAddress, fetchCurrentUser } from "../../firebase";
import { ref as dRef, onValue } from "firebase/database";
import "./MyAccount.css";
import FormBox from "../form/FormBox";
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import CheckProductionTeam from "../../scripts/checkProductionTeam";
import { editionDropAddress } from "../../scripts/getContract";
import "./PublicProfile.css";
import { Helmet } from "react-helmet";
import { GetUSDExchangeRate } from "./../api";
import dateFormat from "dateformat";
import "./../ListingPage.css";
import "./../Player.css";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const PublicProfile = () => {
  let navigate = useNavigate();
  let { slug } = useParams();
  const [uid, setUID] = useState();
  const [userData, setUserData] = useState();
  const [slugRun, setSlugRun] = useState(false);
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //check slug and return uid
  useEffect(() => {
    var slugRef = dRef(db, "userSlugs/" + slug);
    onValue(slugRef, (snapshot) => {
      var sData = snapshot.val();
      setUID(sData);
      setSlugRun(true);
    });
  }, [slug]);

  useEffect(() => {
    if (uid) {
      var profileRef = dRef(db, "users/" + uid);
      onValue(profileRef, (snapshot) => {
        var pData = snapshot.val();
        setUserData(pData);
      });
    }
  }, [uid]);

  const banner = userData?.userBanner || "/media/banner.jpg";

  //check if user is in production team
  const [productionTeam, setProductionTeam] = useState(false);
  const [userPt, setUserPt] = useState(0);
  const [userPl, setUserPl] = useState(0);

  const userProdCheck = CheckProductionTeam(userData?.walletID);
  userProdCheck.then(function (result) {
    setUserPt(result[0] || 0);
    setUserPl(result[1] || 0);
  });

  useEffect(() => {
    if (userPt > 0) {
      setProductionTeam(true);
    } else if (userPl > 0) {
      setProductionTeam(true);
    }
  }, [userPt, userPl]);

  //get owned NFTs by user
  const { contract } = useContract(editionDropAddress);
  const { data: ownedNFTs } = useOwnedNFTs(contract, userData?.walletID);

  //download concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, []);

  //show users owned concerts
  const showConcerts = () => {
    var arrayLength = ownedNFTs.length;

    const nfts = [];
    for (var i = 0; i < arrayLength; i++) {
      let ownedID = ownedNFTs[i].metadata.id.toString();
      nfts.push(
        <div className="single__concert__box">
          <div className="single__concert__container">
            <div className="single__concert__div" name={ownedID}>
              <div className="single__concert__qty">
                Owns {ownedNFTs[i].quantityOwned.toString()} of{" "}
                {concertData[ownedID].concertSupply} Copies
              </div>
              <img
                src={concertData[ownedID].concertTokenImage}
                className="single__concert__image"
                name={ownedID}
                alt="Concert Token"
              />
            </div>

            <div className="library__buttons__div">
              <button
                className="library__button"
                onClick={() => {
                  navigate("/concert/" + ownedID);
                }}
              >
                <div className="library__button__inner">
                  <span className="tab__hidden__text">Marketplace</span>
                  <i className="fa-solid fa-dollar-sign play__now__icon library__play__now__icon" />
                </div>
              </button>
              <button
                className="library__button library__play__button play__now__button"
                onClick={() => {
                  navigate("/player/" + ownedID);
                }}
                disabled={true}
              >
                <div className="library__button__inner play__inner">
                  <span className="tab__hidden__text"> Play Now </span>
                  <i className="fa-solid fa-play play__now__icon library__play__now__icon" />
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return nfts;
  };

  //show notification when url is copied
  const [copyNoti, setCopyNoti] = useState(false);

  const showCopyNoti = async () => {
    setCopyNoti(true);
    await delay(1500);
    setCopyNoti(false);
  };

  //show artists created NFT Concerts and launch mint pop
  const [showMintPopUp, setShowMintPopUp] = useState(false);
  const resaleFee = parseFloat(concertData?.concertResaleFee) + 5;
  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  const showCreatedConcerts = () => {
    const concerts = [];

    if (userData?.approvedConcerts) {
      var concertArray = Object.keys(userData?.approvedConcerts);
      var arrayLength = concertArray.length;

      for (var i = 0; i < arrayLength; i++) {
        var tempConcertId = parseInt(concertArray[i]);
        var tempConcert = concertData[tempConcertId];
        var owned = parseInt(0);
        //custom twitter share link
        var twitterLink =
          "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Listen%20to%20this%20insane%20performance%20by%20" +
          encodeURI(tempConcert?.concertArtist) +
          "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%2F" +
          tempConcertId +
          "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

        var mailLink =
          "mailto:?subject=Check Out this NFT Concert - " +
          tempConcert?.concertName +
          " by " +
          tempConcert?.concertArtist +
          "&body=This performance is amazing - https://nftconcerts.com/concert/" +
          tempConcertId;
        concerts.push(
          <div className="created__container">
            <div className="created__div">
              <div className="lp__info__div">
                <div className="lp__info__columns">
                  <div className="lp__info__col1">
                    <img
                      src={tempConcert.concertTokenImage}
                      className="token__image__image"
                      alt="NFT Concert Token Preview"
                    />

                    <div className="mint__progress__bar__container">
                      <div className="mint__progress__bar__div">
                        <div
                          className="mint__progress__bar__inner"
                          style={{
                            width: `${
                              (tempConcert.mintID * 100) /
                              tempConcert.concertSupply
                            }%`,
                          }}
                        />
                      </div>
                      <div className="lp__mint__progress__div">
                        {tempConcert.concertSupply - tempConcert.mintID + 1} /{" "}
                        {tempConcert.concertSupply} Available
                      </div>
                    </div>

                    <button
                      className="my__button preview__button buy__now__button lp__buy__button"
                      onClick={() => {
                        setShowMintPopUp(true);
                      }}
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
                          {parseFloat(tempConcert.concertPrice)}{" "}
                          <span className="c__price__in__usd button__usd__price">
                            ($
                            {(
                              parseFloat(tempConcert.concertPrice) * usdExRate
                            ).toFixed(2)}
                            )
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="marketplace__icons__div token__div__icons">
                      <div
                        className="marketplace__icon__div"
                        onClick={() => {
                          window.open(
                            `https://looksrare.org/collections/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${tempConcertId}`
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
                            `https://opensea.io/assets/ethereum/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${tempConcertId}`
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
                            `https://x2y2.io/eth/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${tempConcertId}`
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
                            `https://etherscan.io/token/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a?a=${tempConcertId}`
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
                      <a href={twitterLink} target="_blank" rel="noreferrer">
                        <button className="fa-brands fa-twitter player__icon__button" />
                      </a>
                      <a href={mailLink} target="_blank" rel="noreferrer">
                        <button className="fa-solid fa-envelope player__icon__button" />
                      </a>

                      <button
                        className="fa-solid fa-clipboard player__icon__button"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          showCopyNoti();
                        }}
                      />
                    </div>
                    {copyNoti && (
                      <div className="lp__share__div copy__noti">
                        URL Copied
                      </div>
                    )}

                    <h3 className="c__name">{tempConcert?.concertName}</h3>

                    {owned > 1 && (
                      <h3 className="owned__info">
                        {owned}x Copies Owned of {tempConcert?.concertSupply}
                      </h3>
                    )}
                    {owned === 1 && (
                      <h3 className="owned__info">
                        {owned} Copy Owned of {tempConcert?.concertSupply}
                      </h3>
                    )}

                    {(owned === 0 && (
                      <button
                        className="my__button preview__button buy__now__button lp__buy__button "
                        onClick={() => {
                          navigate("/concert/" + tempConcertId);
                        }}
                      >
                        <span>
                          Marketplace{" "}
                          <i className="fa-solid fa-dollar-sign lp__play__now__icon" />
                        </span>
                      </button>
                    )) || (
                      <button
                        className="lp__play__now__button "
                        onClick={() => {
                          navigate("/player/" + tempConcertId);
                        }}
                        disabled={!owned}
                      >
                        <span>
                          Play Now{" "}
                          <i className="fa-solid fa-play lp__play__now__icon" />
                        </span>
                      </button>
                    )}

                    <h3 className="c__detail">
                      <i className="fa-solid fa-user c__icons" title="Artist" />
                      {tempConcert?.concertArtist}
                    </h3>
                    <h3 className="c__detail">
                      <i
                        className="fa-solid fa-video c__icons"
                        title="Recording Type"
                      />
                      {tempConcert?.concertRecordingType}
                    </h3>
                    <h3 className="c__detail">
                      <i
                        className="fa-solid fa-clock-rotate-left c__icons"
                        title="Duration"
                      />
                      {tempConcert?.concertDuration}
                    </h3>
                    <h3 className="c__detail">
                      <i
                        className="fa-solid fa-calendar c__icons"
                        title="Performance Date"
                      />
                      {dateFormat(
                        tempConcert.concertPerformanceDate,
                        "m/d/yyyy, h:MM TT"
                      )}
                    </h3>

                    <h3 className="c__detail">
                      <i
                        className="fa-solid fa-warehouse c__icons"
                        title="Venue"
                      />
                      {tempConcert?.concertVenue}
                    </h3>
                    <h3 className="c__detail">
                      <i
                        className="fa-solid fa-location-crosshairs c__icons"
                        title="Location"
                      />
                      {tempConcert?.concertLocation}
                    </h3>
                    {tempConcert?.concertTourName && (
                      <h3 className="c__detail">
                        <i
                          className="fa-solid fa-van-shuttle c__icons"
                          title="Tour"
                        />
                        {tempConcert?.concertTourName}
                      </h3>
                    )}
                    {tempConcert?.concertLiveAttendance && (
                      <h3 className="c__detail">
                        <i
                          className="fa-solid fa-users-line c__icons"
                          title="Tour"
                        />
                        {tempConcert?.concertLiveAttendance}
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
                      {tempConcert?.concertDescription}
                    </p>
                  </div>
                </div>
                <div className="tablet__info">
                  <p className="c__description tablet__description">
                    {tempConcert?.concertDescription}
                  </p>
                </div>
              </div>

              <div className="c__token__info__div audience__info__div">
                <p>
                  Mint this NFT Concert for a Permanent Spot in the Audience
                </p>
              </div>
            </div>
          </div>
        );
      }
    }
    return concerts;
  };

  return (
    <>
      {(userData && (
        <div className="user__page">
          <Helmet>
            <title>{userData?.name} - NFT Concerts Profile</title>
            <meta
              name="description"
              content={
                "Check out the NFT Concerts collection of " + userData?.name
              }
            />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="https://nftconcerts.com" />
            <meta
              name="twitter:title"
              content={userData?.name + " - NFT Concerts Profile"}
            />
            <meta
              name="twitter:description"
              content={
                "Check out the NFT Concerts collection of " + userData?.name
              }
            />
            <meta name="twitter:image" content={userData?.image} />
          </Helmet>
          <div
            className="user__banner"
            style={{
              backgroundImage: `url(${banner})`,
            }}
          >
            <div className="user__social__div"> </div>
            <div className="user__banner__botfade" />
          </div>

          <div className="user__info__div">
            <div className="user__info__box">
              <div className="user__info__content square">
                <div
                  className="account__image__div"
                  style={{
                    backgroundImage: `url(${userData?.image})`,
                  }}
                />

                <h3 className="user__info__name">{userData?.name}</h3>
                <p className="user__info__address">
                  <a
                    href={`https://etherscan.com/address/${userData?.walletID}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncateAddress(userData?.walletID)}
                  </a>
                </p>
                <div className="small__social__div">
                  {userData?.twitterProfile && (
                    <a
                      href={"https://twitter.com/" + userData.twitterProfile}
                      className="fa fa-twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-hidden="true"
                    >
                      <span>Twitter Profile</span>
                    </a>
                  )}

                  {userData?.spotifyLink && (
                    <a
                      href={userData.spotifyLink}
                      className="fa fa-brands fa-spotify"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-hidden="true"
                    >
                      <span>Spotify Profile</span>
                    </a>
                  )}
                  {userData?.personalLink && (
                    <a
                      href={userData.personalLink}
                      className="fa fa-solid fa-globe"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-hidden="true"
                    >
                      <span>Personal Website</span>
                    </a>
                  )}
                </div>
                <button
                  className="library__button user__info__button"
                  onClick={() => {
                    alert("Feature Coming Soon");
                  }}
                >
                  Follow Profile
                </button>
                {currentUser.user.uid === uid && (
                  <button
                    className="library__button user__info__button"
                    onClick={() => {
                      navigate("/my-account");
                    }}
                  >
                    Back to Account
                  </button>
                )}
              </div>
            </div>
            <div className="name__div">
              <span className="bold__text welcome__text account__details hide__600">
                {userData?.name}
              </span>
              <br />
              <div className="contained__library">
                {productionTeam && (
                  <div className="ptlead__container">
                    {(userPl > 0 && (
                      <>
                        <h3 className="library__heading">Production Lead</h3>
                        <div className="ptlead__container__div">
                          <img
                            src="/media/production-lead.jpg"
                            className="ptlead__image"
                            alt="Production Lead"
                          />
                          <div className="ptlead__info__div">
                            <h3 className="ptlead__heading">Production Lead</h3>
                            <p className="ptlead__qty">
                              {userData?.name} owns {userPl} of 55 Production
                              Lead NFTs
                            </p>
                            <p className="ptlead__subheading">
                              {userData?.name} is a valued leader of NFT
                              Concerts
                            </p>

                            <button
                              className="library__button user__info__button locked__info__button"
                              onClick={() => {
                                navigate("/production-team");
                              }}
                            >
                              <span> Join Telegram Chat</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )) || (
                      <>
                        <h3 className="library__heading">
                          Production Team Member
                        </h3>
                      </>
                    )}
                    {userPl > 0 && userPt > 0 && (
                      <div className="pt__superfan__spacer" />
                    )}
                    {userPt > 0 && (
                      <div className="ptlead__container__div">
                        <img
                          src="/media/production-team.jpg"
                          className="ptlead__image"
                          alt="Production Team"
                        />
                        <div className="ptlead__info__div">
                          <h3 className="ptlead__heading">Production Team</h3>
                          <p className="ptlead__qty">
                            {userData?.name} owns {userPt} of 5000 Production
                            Team NFTs
                          </p>
                          <p className="ptlead__subheading">
                            {userData?.name} is building the future of live
                            music.
                          </p>

                          <button
                            className="library__button user__info__button locked__info__button"
                            onClick={() => {
                              navigate("/production-team");
                            }}
                          >
                            <span>Enter Lounge</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {userData?.approvedConcerts && (
                  <div className="created__library">
                    {" "}
                    <h3 className="library__heading">
                      Created by {userData?.name}
                    </h3>
                    <div>{showCreatedConcerts()}</div>
                  </div>
                )}

                {(ownedNFTs && ownedNFTs.length > 0 && (
                  <>
                    <h3 className="library__heading">
                      {userData?.name}'s Library
                    </h3>
                    <div className="concert__library">
                      {concertData && showConcerts()}
                    </div>
                  </>
                )) || (
                  <>
                    {userData.userType !== "artist" && (
                      <>
                        {" "}
                        <h3 className="library__heading">
                          {userData?.name}'s Library
                        </h3>
                        <div className="no__owned__shows__div">
                          {" "}
                          <p>There are no NFT Concerts in this wallet.</p>
                          <p>
                            Mint or purchase a NFT Concert to unlock full
                            concert performances.
                          </p>
                          <button
                            className="shop__now__button"
                            onClick={() => {
                              navigate("/market");
                            }}
                          >
                            Shop Now
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )) || (
        <>
          {(slugRun && (
            <FormBox>
              <div className="no__user">
                <h3>Not a Valid User </h3>
                <p>Try refreshing the page</p>
                <button
                  className="login__button"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Go to Home
                </button>
                <button
                  className="login__button"
                  onClick={() => {
                    navigate("/contact");
                  }}
                >
                  Contact Support
                </button>
              </div>
            </FormBox>
          )) || (
            <FormBox>
              <div className="no__user">
                <h3>Loading User </h3>
              </div>
            </FormBox>
          )}
        </>
      )}
    </>
  );
};

export default PublicProfile;
