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

const ArtistAccount = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();
  const [validUser, setValidUser] = useState(false);
  const [admin, setAdmin] = useState(false);
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
    var concertDataRef = dRef(db, "submittedConcerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
    submittedConcertTable();
  }, [currentUser]);

  //Check if user is admin or was uploader
  useEffect(() => {
    if (userData?.userType === "admin") {
      setValidUser(true);
      setAdmin(true);
    } else if (userData?.userType === "fan") {
      if (userData?.walletID === concertData?.uploaderWalletID) {
        setValidUser(true);
      }
    } else setValidUser(false);
  }, [currentUser, userData]);

  //pull users submitted concerts
  const submittedConcertTable = () => {
    if (userData?.submittedConcerts) {
      var concertArray = Object.keys(userData?.submittedConcerts);

      var arrayLength = concertArray.length;

      const rows = [];
      for (var i = 0; i < arrayLength; i++) {
        var row = [];
        var tempConcertId = parseInt(concertArray[i]);
        var tempConcert = concertData[tempConcertId];

        var contractStr = JSON.stringify(tempConcertId);

        rows.push(
          <>
            <div className="concert__row">
              <div className="concert__id">L-{tempConcert?.concertId}</div>
              <div className="concert__thumbnail">
                <img
                  src={tempConcert?.concertThumbnailImage}
                  className="account__page__concert__thumbnail"
                />
              </div>
              <div className="concert__name">{tempConcert?.concertName}</div>
              <div className="concert__perf__date">
                {tempConcert?.concertPerformanceDate}
              </div>
              <div className="concert__listing__approval">
                {tempConcert?.listingApproval}
              </div>
              <div className="concert__expand__button">
                <button
                  type="submit"
                  className="fa-solid fa-file-signature icon__button"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/contract?id=" + i.target.name);
                  }}
                />
              </div>
              {/* <div className="concert__play__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/player/" + i.target.name);
                  }}
                  className="fa-solid fa-play icon__button"
                />
              </div>
              <div className="concert__token__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/concert/" + i.target.name);
                  }}
                  className="fa-solid fa-file-invoice-dollar icon__button"
                />
              </div> */}
            </div>
          </>
        );
      }

      return rows;
    }
  };

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
  } = useOwnedNFTs(contract, address);

  //show users owned concerts
  const showConcerts = () => {
    var arrayLength = ownedNFTs.length;

    const nfts = [];
    for (var i = 0; i < arrayLength; i++) {
      nfts.push(
        <div className="single__concert__container">
          <div
            className="single__concert__div"
            name={ownedNFTs[i].metadata.id.toString()}
            onClick={(i) => {
              console.log(i);
              navigate("/player/" + i.target.name);
            }}
          >
            <img
              src={ownedNFTs[i].metadata.image}
              className="single__concert__image"
              name={ownedNFTs[i].metadata.id.toString()}
            />
            <i className="fa-solid fa-play hidden__play__icon" />
          </div>
          <div className="single__concert__qty">
            You Own {ownedNFTs[i].quantityOwned.toString()} of{" "}
            {ownedNFTs[i].supply.toString()} Copies
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
        {currentUser && (
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
            <div className="artist__buttons__div">
              <button
                className="artist__account__button"
                onClick={() => {
                  navigate("/my-account");
                }}
              >
                <div className="inner__button">
                  Back to My Account{" "}
                  <i className="fa-solid fa-circle-arrow-right artist__button__arrow" />
                </div>
              </button>
            </div>
            {userData?.submittedConcerts && (
              <>
                <h3 className="library__heading">Submitted Concerts</h3>
                <div className="submitted__concerts__table">
                  <div className="concert__table__headers">
                    <div className="concert__id">L-ID </div>
                    <div className="concert__thumbnail">IMG</div>
                    <div className="concert__name">Name</div>
                    <div className="concert__perf__date">Performance Date</div>
                    <div className="concert__listing__approval">
                      Listing Approval
                    </div>
                    <div className="header__expand__button">
                      <i className="fa-solid fa-file-signature" />
                    </div>
                    {/* <div className="header__play__button">
                        <i className="fa-solid fa-play" />
                      </div>
                      <div className="header__token__button">
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                      </div> */}
                  </div>
                  {userData && concertData && submittedConcertTable(userData)}
                  <div className="submitted__concert__row">
                    <div className="submitted__concert__name"></div>
                  </div>
                </div>
              </>
            )}
            <div className="account__buttons__div"></div>

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

export default ArtistAccount;
