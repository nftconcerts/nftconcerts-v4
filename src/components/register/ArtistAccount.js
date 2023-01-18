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
import "./ArtistAccount.css";
import AccountPage from "./AccountPage";

const ArtistAccount = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();
  const [validUser, setValidUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const [liveConcertData, setLiveConcertData] = useState();

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

  //download submitted concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "submittedConcerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
    submittedConcertTable();
  }, [currentUser]);

  //download actual concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setLiveConcertData(cData);
    });
    approvedConcertTable();
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
            </div>
          </>
        );
      }

      return rows;
    }
  };

  //pull users submitted concerts
  const approvedConcertTable = () => {
    if (userData?.approvedConcerts) {
      var concertArray = Object.keys(userData?.approvedConcerts);

      var arrayLength = concertArray.length;

      const rows = [];
      for (var i = 0; i < arrayLength; i++) {
        var row = [];
        var tempConcertId = parseInt(concertArray[i]);
        var tempConcert = liveConcertData[tempConcertId];

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
        {userData && (
          <AccountPage>
            <h3 className="library__heading">Artist Dashboard</h3>
            <div className="artist__info__div">
              <div className="artist__dashboard__div">
                <div className="artist__info__box">
                  <h5 className="artist__info__box__title">Total Sales</h5>
                  <p className="artist__info__box__info">
                    <span className="artist__info__box__info__res">0</span>
                  </p>
                </div>
                <div className="artist__info__box">
                  <h5 className="artist__info__box__title">
                    Payout <br />
                  </h5>
                  <p className="artist__info__box__info">
                    <img
                      src="/media/eth-logo.png"
                      height={15}
                      className="c__eth__logo"
                      alt="eth logo"
                    />
                    <span className="artist__info__box__info__res">0.000</span>
                  </p>
                </div>
              </div>
            </div>
            {userData?.approvedConcerts && (
              <>
                <h3 className="library__heading artist__acct__heading">
                  Your NFT Concerts
                </h3>
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
                  {userData && concertData && approvedConcertTable(userData)}
                  <div className="submitted__concert__row">
                    <div className="submitted__concert__name"></div>
                  </div>
                </div>
              </>
            )}
            {userData?.submittedConcerts && (
              <>
                <h3 className="library__heading artist__acct__heading">
                  Submitted Concerts
                </h3>
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
          </AccountPage>
        )}
      </>
    </>
  );
};

export default ArtistAccount;
