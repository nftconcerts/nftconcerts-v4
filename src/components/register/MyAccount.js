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
              <div className="concert__id">#{tempConcert?.concertId}</div>
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
              <div className="concert__play__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/player?id=" + i.target.name);
                  }}
                  className="fa-solid fa-play icon__button"
                />
              </div>
              <div className="concert__token__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/concert?id=" + i.target.name);
                  }}
                  className="fa-solid fa-file-invoice-dollar icon__button"
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
  const {
    data: ownedNFTs,
    isLoading3,
    error3,
  } = useOwnedNFTs(editionDrop, address);

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
              navigate("/player?id=" + i.target.name);
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
      {!productionTeam && (
        <FormBox>
          <div className="not__production__div">
            {" "}
            <h3>
              {" "}
              You must be a member of the production team to view this site.
            </h3>
            <img
              src="/media/production-team.jpg"
              className="production__team__image__two"
            />
            <button
              onClick={() => {
                navigate("/");
              }}
              className="login__button"
            >
              Join Now
            </button>
          </div>
        </FormBox>
      )}
      {productionTeam && (
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
              {ownedNFTs && ownedNFTs.length > 0 && (
                <>
                  <h3>Owned Concerts</h3>
                  <div className="concert__library">
                    {concertData && showConcerts()}
                  </div>
                </>
              )}
              {userData?.submittedConcerts && (
                <>
                  <h3>Submitted Concerts</h3>
                  <div className="submitted__concerts__table">
                    <div className="concert__table__headers">
                      <div className="concert__id">ID </div>
                      <div className="concert__thumbnail">IMG</div>
                      <div className="concert__name">Name</div>
                      <div className="concert__perf__date">
                        Performance Date
                      </div>
                      <div className="concert__listing__approval">
                        Listing Approval
                      </div>
                      <div className="header__expand__button">
                        <i className="fa-solid fa-file-signature" />
                      </div>
                      <div className="header__play__button">
                        <i className="fa-solid fa-play" />
                      </div>
                      <div className="header__token__button">
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                      </div>
                    </div>
                    {userData && concertData && submittedConcertTable(userData)}
                    <div className="submitted__concert__row">
                      <div className="submitted__concert__name"></div>
                    </div>
                  </div>
                </>
              )}
              <div className="account__buttons__div"></div>

              <div className="admin__button__div">
                {!address && (
                  <button
                    className="login__button admin__button"
                    onClick={() => {
                      resetMobileMode();
                      connectWithMetamask();
                    }}
                  >
                    Connect to Metamask
                  </button>
                )}
                {admin && (
                  <>
                    {" "}
                    <button
                      className="login__button admin__button"
                      onClick={() => {
                        navigate("/admin");
                      }}
                    >
                      Admin View
                    </button>
                    <button
                      className="login__button admin__button"
                      onClick={() => {
                        inlineLogout();
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

              <div className="user__info__div">
                <div className="name__div">
                  <span className="bold__text">User</span>
                  <br />
                  {userData?.name}
                </div>
                {userData && (
                  <div className="wallet__div">
                    <span className="bold__text">Wallet</span>
                    <br />
                    {truncateAddress(userData?.walletID)}
                  </div>
                )}
              </div>
            </Contract>
          )}
        </>
      )}
    </>
  );
};

export default MyAccount;
