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
import { useAddress, useMetamask, useOwnedNFTs } from "@thirdweb-dev/react";
import editionDrop from "../../scripts/getContract.mjs";
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
  const {
    data: ownedNFTs,
    isLoading3,
    error3,
  } = useOwnedNFTs(editionDrop, userData?.walletID);

  //show users owned concerts
  const showConcerts = () => {
    var arrayLength = ownedNFTs.length;

    const nfts = [];
    for (var i = 0; i < arrayLength; i++) {
      let ownedID = ownedNFTs[i].metadata.id.toString();
      nfts.push(
        <div className="single__concert__container">
          <div
            className="single__concert__div"
            name={ownedID}
            onClick={(i) => {
              console.log(i);
              navigate("/player/" + i.target.name);
            }}
          >
            <img
              src={concertData[ownedID].concertTokenImage}
              className="single__concert__image"
              name={ownedID}
            />
            <i className="fa-solid fa-play hidden__play__icon" />
          </div>
          <div className="single__concert__qty">
            You Own {ownedNFTs[i].quantityOwned.toString()} of{" "}
            {concertData[ownedID].concertSupply} Copies
          </div>
          <div className="library__buttons__div">
            <button
              className="library__button"
              onClick={() => {
                navigate("/concert/" + ownedID);
              }}
            >
              <div className="library__button__inner">
                <span className="mobile__hide"> View in Marketplace </span>
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
                <span className="mobile__hide"> Play Now </span>
                <i className="fa-solid fa-play play__now__icon library__play__now__icon" />
              </div>
            </button>
          </div>
        </div>
      );
    }
    return nfts;
  };

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
          <Contract>
            {/* <div className="account__name">
            <p className="user__name">{currentUser.user.name}</p>
          </div>
          <div className="account__info">
            <p className="user__email">{currentUser.user.email}</p>
            <p className="logged__in__walletID">
              {truncateAddress(currentUser.user.photoURL)}
            </p>
          </div> */}
            {userData?.userType === "artist" && (
              <div className="artist__buttons__div">
                <button
                  className="artist__account__button"
                  onClick={() => {
                    navigate("/my-account/artist");
                  }}
                >
                  <div className="inner__button">
                    Switch to Artist View{" "}
                    <i className="fa-solid fa-circle-arrow-right artist__button__arrow" />
                  </div>
                </button>
              </div>
            )}
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
                  className="login__button admin__button"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Shop Now
                </button>
              </div>
            )}

            <div className="user__info__div">
              <div
                className="name__div account__info__button"
                onClick={() => {
                  navigate("/my-account/settings");
                }}
              >
                <span className="bold__text first__letter">
                  {userData?.userType}
                </span>
                <br />
                {userData?.name}
              </div>
              {userData && (
                <div
                  className="wallet__div account__info__button"
                  onClick={() => {
                    navigate("/my-account/settings");
                  }}
                >
                  <span className="bold__text">Wallet</span>
                  <br />
                  {truncateAddress(userData?.walletID)}
                </div>
              )}
            </div>
          </Contract>
        )}
      </>
    </>
  );
};

export default MyAccount;
