import React, { useEffect, useState } from "react";
import {
  db,
  fetchCurrentUser,
  logout,
  truncateAddress,
} from "./../../firebase";
import FormBox from "../form/FormBox";
import Contract from "../form/Contract";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";
import { ref as dRef, set, get, onValue } from "firebase/database";
import "./Admin.css";
import emailjs from "@emailjs/browser";
import createNFT from "../../scripts/createNft.mjs";
import { useNetworkMismatch, useNetwork, ChainId } from "@thirdweb-dev/react";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(false);
  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();
  const [submittedConcertData, setSubmittedConcertData] = useState();
  const [uploaderEmail, setUploaderEmail] = useState();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [allUserData, setAllUserData] = useState();

  let navigate = useNavigate();

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //Check if user is admin
  useEffect(() => {
    if (userData?.userType === "admin") {
      setAdminUser(true);
    } else setAdminUser(false);
  }, [currentUser, userData]);

  //get user data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
      var allUserDataRef = dRef(db, "users");
      onValue(allUserDataRef, (snapshot) => {
        var data = snapshot.val();
        setAllUserData(data);
      });
    }
  }, [currentUser]);

  //get submitted concert data
  useEffect(() => {
    var submittedConcertDataRef = dRef(db, "submittedConcerts/");
    onValue(submittedConcertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setSubmittedConcertData(cData);
    });
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, [currentUser]);

  //turn concert list into pretty table
  const submittedConcertTable = () => {
    var concertArray = submittedConcertData.filter((n) => n);

    var arrayLength = concertArray.length;

    const rows = [];
    for (var i = 0; i < arrayLength; i++) {
      var row = [];
      var tempConcertId = parseInt(concertArray[i].concertId);
      var tempConcert = submittedConcertData[tempConcertId];

      var contractStr = JSON.stringify(tempConcertId);

      if (tempConcert.listingApproval === "Awaiting Review") {
        rows.push(
          <>
            <div className="concert__row">
              <div className="concert__id">#{tempConcert.concertId}</div>
              <div className="concert__thumbnail">
                <img
                  src={tempConcert.concertThumbnailImage}
                  height="50px"
                  className="account__page__concert__thumbnail"
                />
              </div>
              <div className="concert__name admin__concert__name">
                {tempConcert.concertName}
              </div>
              <div className="concert__perf__date admin__date">
                {tempConcert.uploadTime}
              </div>

              <div className="concert__play__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/player/" + i.target.name);
                  }}
                  class="fa-solid fa-play icon__button"
                />
              </div>

              <div className="concert__approve__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  disabled={networkMismatch}
                  onClick={(i) => {
                    navigate("/contract?id=" + i.target.name);
                  }}
                  className="approve__button"
                >
                  Review
                </button>
              </div>
              <div className="concert__delete__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    rejectConcert(i.target.name);
                  }}
                  class="fa-solid fa-trash icon__button red__icon"
                />
              </div>
            </div>
          </>
        );
      }
    }

    return rows;
  };

  const approvedConcertTable = () => {
    const rows = [];
    for (var concert in concertData) {
      console.log("Concert: ", concert);
      var row = [];

      var tempConcert = concertData[concert];

      if (tempConcert.listingApproval === "Approved") {
        rows.push(
          <>
            <div className="concert__row">
              <div className="concert__id">#{tempConcert.concertId}</div>
              <div className="concert__thumbnail">
                <img
                  src={tempConcert.concertThumbnailImage}
                  height="50px"
                  className="account__page__concert__thumbnail"
                />
              </div>
              <div className="approved__concert__name">
                {tempConcert.concertName}
              </div>
              <div className="approved__concert__price">
                {tempConcert.concertPrice}
              </div>
              <div className="approved__concert__minted">
                {tempConcert?.sales?.mintID - 1 || "0"}/
                {tempConcert.concertSupply}
              </div>

              <div className="concert__approve__button">
                <button type="sumbit" className="approve__button">
                  {(tempConcert?.sales?.mintID - 1) * tempConcert.concertPrice}
                </button>
              </div>
              <div className="approved__concert__icon">
                <button
                  type="sumbit"
                  name={tempConcert.concertId}
                  onClick={(i) => {
                    navigate("/player/" + i.target.name);
                  }}
                  className="fa-solid fa-play icon__button"
                />
              </div>
              <div className="approved__concert__icon">
                <button
                  type="sumbit"
                  name={tempConcert.concertId}
                  onClick={(i) => {
                    navigate("/player/" + i.target.name);
                  }}
                  className="fa-solid fa-dollar-sign icon__button"
                />
              </div>
            </div>
          </>
        );
      }
    }

    return rows;
  };

  //get reasoning, flag as rejected in db, and
  const setAsRejected = (id) => {
    var rejectionReason = prompt("Reason for Rejection?");
    var concertApprovalDataRef = dRef(
      db,
      "submittedConcerts/" + id + "/listingApproval"
    );
    var concertApprovalMsgDataRef = dRef(
      db,
      "submittedConcerts/" + id + "/approvalMessage"
    );

    var template_params = {
      email: concertData[id].uploaderEmail,
      artits: concertData[id].concertArtist,
      concertId: id,
      concertName: concertData[id].concertName,
      username: userData.name,
      message: rejectionReason,
    };
    if (rejectionReason) {
      set(concertApprovalDataRef, "Rejected").then(
        set(concertApprovalMsgDataRef, rejectionReason).then(
          emailjs
            .send(
              process.env.REACT_APP_EMAIL_SERVICE_ID,
              "template_artist_reject",
              template_params,
              process.env.REACT_APP_EMAIL_USER_ID
            )
            .then(alert("Concert Rejected")),
          (error) => {
            console.log(error.text);
          }
        )
      );
    } else alert("No Rejection Reason. Try again.");
  };

  //reject concert
  const rejectConcert = async (id) => {
    var uploaderUID = concertData[id].uploaderUID;
    var uploaderUserDataRef = dRef(db, "users/" + uploaderUID + "/email");

    get(uploaderUserDataRef, (snapshot) => {
      var data = snapshot.val();
      setUploaderEmail(data);
    }).then(() => {
      setAsRejected(id);
    });
  };

  //show the users in a nice table
  const [userView, setUserView] = useState(true);
  const showUsers = () => {
    var usercount = 0;
    for (var user in allUserData) {
      usercount++;
    }
    return (
      <>
        {allUserData && (
          <>
            <h3>Users - {usercount} Total</h3>
            <div className="users__table">
              <div className="concert__table__headers">
                <div className="concert__thumbnail">IMG</div>
                <div className="user__name__entry">Name</div>
                <div className="user__email__entry">Email</div>
                <div className="user__wallet__entry">Wallet</div>
                <div className="user__type__entry">Account</div>
              </div>
              {UserRow()}
            </div>
          </>
        )}
      </>
    );
  };

  const [totalUsers, setTotalUsers] = useState();
  //turn user list into pretty table
  const UserRow = () => {
    var rows = [];
    var usercount = 0;
    for (var user in allUserData) {
      usercount++;
      var userStr = JSON.stringify(user);
      rows.push(
        <div className="concert__row" key={usercount}>
          <div className="concert__thumbnail">
            <img
              src={allUserData[user].image}
              height="50px"
              className="account__page__concert__thumbnail"
            />
          </div>
          <div className="user__name__entry">{allUserData[user].name}</div>

          <div className="user__email__entry table__hide__moble">
            <a href={"mailto:" + allUserData[user].email}>
              {allUserData[user].email}
            </a>
          </div>
          <div className="user__email__entry table__wallet__icon">
            <a
              href={"mailto:" + allUserData[user].email}
              className="table__wallet__icon"
            >
              <i className="fa-solid fa-envelope user__table__button table__wallet__icon" />
            </a>
          </div>
          <div className="user__wallet__entry">
            <button
              name={userStr}
              onClick={(e) => {
                exportAddress(e.target.name);
              }}
            >
              <span className="table__hide__mobile">
                {truncateAddress(allUserData[user].walletID)}
              </span>

              <i className="fa-solid fa-wallet user__table__button table__wallet__icon" />
            </button>
          </div>
          <div className="user__type__entry">{allUserData[user].userType}</div>
        </div>
      );
    }

    return rows;
  };

  const exportAddress = (user) => {
    var tempUser = JSON.parse(user);
    navigator.clipboard.writeText(allUserData[tempUser].walletID);
  };
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
      {!adminUser && currentUser && (
        <FormBox>
          <div className="no__user">
            <h3>You're not Admin! </h3>
            <p>Good luck with your attack. </p>
            <button
              className="login__button"
              onClick={() => {
                navigate("/my-account");
              }}
            >
              Go To Account Page
            </button>
            <button
              className="login__button"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Home
            </button>
          </div>
        </FormBox>
      )}
      {adminUser && concertData && (
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
          {networkMismatch && (
            <>
              <h3 className="wrong__network__text">
                Network Mistmatch. Please Switch to Ethereum.
              </h3>
            </>
          )}
          {(userView && showUsers()) || (
            <>
              <div className="concert__table__container">
                <h3>NFT Concerts</h3>
                <div className="submitted__concerts__table">
                  <div className="concert__table__headers">
                    <div className="concert__id">ID </div>
                    <div className="concert__thumbnail">IMG</div>
                    <div className="approved__concert__name">Name</div>
                    <div className="approved__concert__price">Price</div>
                    <div className="approved__concert__minted">Minted</div>
                    <div className="concert__approve__button">
                      <button type="sumbit" className="white__approve__button">
                        Profit
                      </button>
                    </div>
                    <div className="approved__concert__icon">
                      <i class="fa-solid fa-play" />
                    </div>
                    <div className="approved__concert__icon">
                      <i class="fa-solid fa-dollar-sign" />
                    </div>
                  </div>
                  {userData && concertData && approvedConcertTable(userData)}
                  <div className="submitted__concert__row">
                    <div className="submitted__concert__name"></div>
                  </div>
                </div>
              </div>
              <div className="concert__table__container">
                <h3>Awaiting Review</h3>
                <div className="submitted__concerts__table">
                  <div className="concert__table__headers">
                    <div className="concert__id">ID </div>
                    <div className="concert__thumbnail">IMG</div>
                    <div className="concert__name admin__concert__name">
                      Name
                    </div>
                    <div className="concert__perf__date admin__date">
                      Upload Date
                    </div>

                    <div className="header__play__button">
                      <i class="fa-solid fa-play" />
                    </div>

                    <div className="concert__approve__button">
                      <button type="sumbit" className="white__approve__button">
                        Review
                      </button>
                    </div>
                    <div className="concert__delete__button">
                      <i class="fa-solid fa-trash " />
                    </div>
                  </div>
                  {userData && concertData && submittedConcertTable(userData)}
                  <div className="submitted__concert__row">
                    <div className="submitted__concert__name"></div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="user__info__div">
            <div className="name__div">
              <span className="bold__text welcome__text account__details">
                Welcome {userData?.name}
              </span>
              <br />
              <div className="first__letter account__details">
                {userData?.userType} Panel
              </div>
              <div
                className="first__letter account__details"
                onClick={() => {
                  setUserView(!userView);
                }}
              >
                <button
                  onClick={() => {
                    setUserView(!userView);
                  }}
                >
                  {(userView && <>View Concerts</>) || <>View Users</>}
                </button>
              </div>
              <div className="first__letter account__details">
                <a href="/my-account/settings">Account Settings -{`>`}</a>
              </div>
            </div>

            <div className="account__image">
              <div
                className="account__image__hover"
                onClick={() => {
                  navigate("/my-account/image");
                }}
              >
                <i className="fa-solid fa-pen account__image__hover" />
              </div>
              <img src={userData?.image} className="account__image" />
            </div>
          </div>
        </Contract>
      )}
    </>
  );
};

export default Admin;
