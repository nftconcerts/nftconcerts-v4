import React, { useEffect, useState } from "react";
import {
  db,
  fetchCurrentUser,
  logout,
  truncateAddress,
  resetMobileMode,
} from "./../../firebase";
import FormBox from "../form/FormBox";
import Contract from "../form/Contract";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";
import { ref as dRef, onValue } from "firebase/database";
import {
  useAddress,
  useMetamask,
  useOwnedNFTs,
  useContract,
} from "@thirdweb-dev/react";
import editionDrop, { editionDropAddress } from "../../scripts/getContract.mjs";
import checkProductionTeam from "../../scripts/checkProductionTeam";

const MyAccount = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //logout user
  const inlineLogout = () => {
    logout();
    setCurrentUser(null);
    navigate("/");
    window.location.reload();
  };

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

  //download concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, [currentUser]);

  //check if user is holding production team NFT
  const [productionTeam, setProductionTeam] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [ptBalance, setPtBalance] = useState(0);
  const [plBalance, setPlBalance] = useState(0);

  const productionCheck = async () => {
    if (address) {
      var checkResult = await checkProductionTeam(address);

      setPtBalance(checkResult[0]);
      setPlBalance(checkResult[1]);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    } else if (!address && userData?.walletID) {
      var checkResult = await checkProductionTeam(userData.walletID);

      setPtBalance(checkResult[0]);
      setPlBalance(checkResult[1]);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    }
  };
  useEffect(() => {
    productionCheck();
  }, [address, userData]);

  //get owned NFTs by user
  const { contract } = useContract(editionDropAddress);
  const {
    data: ownedNFTs,
    isLoading3,
    error3,
  } = useOwnedNFTs(contract, userData?.walletID);

  //show users owned concerts
  const showConcerts = () => {
    var arrayLength = ownedNFTs.length;

    const nfts = [];
    for (var i = 0; i < arrayLength; i++) {
      let ownedID = ownedNFTs[i].metadata.id.toString();
      nfts.push(
        <div className="single__concert__box">
          <div className="single__concert__container">
            <div
              className="single__concert__div"
              name={ownedID}
              onClick={(i) => {
                console.log(i);
                navigate("/player/" + i.target.name);
              }}
            >
              <div className="single__concert__qty">
                You Own {ownedNFTs[i].quantityOwned.toString()} of{" "}
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
              >
                <div className="library__button__inner">
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

  //userbanner
  const banner = userData?.userBanner || "/media/banner.jpg";
  return (
    <>
      <>
        {currentUser === null && (
          <FormBox>
            <div className="no__user">
              <h3>No Current User. </h3>
              <p>Please Register or Login </p>
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
        )}
        {currentUser && userData && (
          <div className="user__page">
            {/* <div className="account__name">
            <p className="user__name">{currentUser.user.name}</p>
          </div>
          <div className="account__info">
            <p className="user__email">{currentUser.user.email}</p>
            <p className="logged__in__walletID">
              {truncateAddress(currentUser.user.photoURL)}
            </p>
          </div> */}
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
                      navigate("/my-account/settings");
                    }}
                  >
                    Edit Profile
                  </button>
                  {(userData?.userType === "artist" && (
                    <>
                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          navigate("/my-account/artist");
                        }}
                      >
                        Artist View{" "}
                      </button>
                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          navigate("/upload");
                        }}
                      >
                        Upload{" "}
                      </button>
                    </>
                  )) || (
                    <button
                      className="library__button user__info__button"
                      onClick={() => {
                        navigate("/apply");
                      }}
                    >
                      Artist Application
                    </button>
                  )}
                  {userData?.userType === "admin" && (
                    <>
                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          navigate("/admin");
                        }}
                      >
                        Admin View{" "}
                      </button>
                    </>
                  )}
                  <button
                    className="library__button user__info__button"
                    onClick={inlineLogout}
                  >
                    Logout{" "}
                  </button>
                </div>
              </div>
              <div className="name__div">
                <span className="bold__text welcome__text account__details hide__600">
                  Welcome {userData?.name}
                </span>
                <br />
                <div className="contained__library">
                  <h3 className="library__heading">Your Library</h3>
                  {(ownedNFTs && ownedNFTs.length > 0 && (
                    <>
                      <div className="concert__library">
                        {concertData && showConcerts()}
                      </div>
                    </>
                  )) || (
                    <div className="no__owned__shows__div">
                      {" "}
                      <p>There are no NFT Concerts in your wallet.</p>
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
        )}
      </>
    </>
  );
};

export default MyAccount;
