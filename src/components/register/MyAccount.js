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
import CheckProductionTeam from "../../scripts/checkProductionTeam";
import AccountPage from "./AccountPage";

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
        <AccountPage>
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
                        You Own {userPl} of 55 Production Lead NFTs
                      </p>
                      <p className="ptlead__subheading">
                        You are a valued leader of NFT Concerts
                      </p>

                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          window.open("https://t.me/+jwqk92uzZxc1M2Fh");
                        }}
                      >
                        Join Telegram Chat
                      </button>
                    </div>
                  </div>
                </>
              )) || (
                <>
                  <h3 className="library__heading">Production Team Member</h3>
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
                      You Own {userPt} of 5000 Production Team NFTs
                    </p>
                    <p className="ptlead__subheading">
                      You are building the future of live music.
                    </p>

                    <button
                      className="library__button user__info__button"
                      onClick={() => {
                        navigate("/production-lounge");
                      }}
                    >
                      Enter Lounge
                    </button>
                  </div>
                </div>
              )}
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
                className="shop__now__button"
                onClick={() => {
                  navigate("/");
                }}
              >
                Shop Now
              </button>
            </div>
          )}
        </AccountPage>
      )}
    </>
  );
};

export default MyAccount;
