import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, truncateAddress, fetchCurrentUser } from "../../firebase";
import { ref as dRef, onValue } from "firebase/database";
import "./MyAccount.css";
import FormBox from "../form/FormBox";
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import CheckProductionTeam from "../../scripts/checkProductionTeam";
import { editionDropAddress } from "../../scripts/getContract";
import dateFormat from "dateformat";
import "./PublicProfile.css";

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

  let currentUrl = window.location.pathname;
  const banner = userData?.userBanner || "/media/banner.jpg";

  //check if user is in production team
  const [productionTeam, setProductionTeam] = useState(false);
  const [userPt, setUserPt] = useState(0);
  const [userPl, setUserPl] = useState(0);

  const userProdCheck = CheckProductionTeam(userData?.walletID);
  userProdCheck.then(function (result) {
    setUserPt(result[0]);
    setUserPl(result[1]);
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
  const {
    data: ownedNFTs,
    isLoading3,
    error3,
  } = useOwnedNFTs(contract, userData?.walletID);

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
  return (
    <>
      {(userData && (
        <div className="user__page">
          <div
            className="user__banner"
            style={{
              backgroundImage: `url(${banner})`,
            }}
          >
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
                {userData?.name} -{" "}
                <span className="capitalize__text">
                  {userData?.userType} Account
                </span>
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
                <h3 className="library__heading">{userData?.name}'s Library</h3>
                {(ownedNFTs && ownedNFTs.length > 0 && (
                  <>
                    <div className="concert__library">
                      {concertData && showConcerts()}
                    </div>
                  </>
                )) || (
                  <div className="no__owned__shows__div">
                    {" "}
                    <p>There are no NFT Concerts in this wallet.</p>
                    <p>
                      Mint or purchase a NFT Concert to unlock full concert
                      performances.
                    </p>
                    <button
                      className="shop__now__button"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Shop Now
                    </button>
                  </div>
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
