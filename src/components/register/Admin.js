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
import emailjs from "emailjs-com";
import createNFT from "../../scripts/createNft.mjs";
import { useNetworkMismatch, useNetwork, ChainId } from "@thirdweb-dev/react";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(false);
  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();
  const [uploaderEmail, setUploaderEmail] = useState();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

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
    }
  }, [currentUser]);

  //get concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "submittedConcerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, [currentUser]);

  //turn concert list into pretty table
  const submittedConcertTable = () => {
    var concertArray = concertData.filter((n) => n);

    var arrayLength = concertArray.length;

    const rows = [];
    for (var i = 0; i < arrayLength; i++) {
      var row = [];
      var tempConcertId = parseInt(concertArray[i].concertId);
      var tempConcert = concertData[tempConcertId];

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
                    navigate("/player?id=" + i.target.name);
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

  //get reasoning, flag as rejected in db, and
  const setAsRejected = (id) => {
    var rejectionReason = prompt("Reason for Rejection?");
    var concertApprovalDataRef = dRef(
      db,
      "concerts/" + id + "/listingApproval"
    );
    var concertApprovalMsgDataRef = dRef(
      db,
      "concerts/" + id + "/approvalMessage"
    );

    var template_params = {
      email: uploaderEmail,
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
              "template_rnq0cvl",
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
    console.log("uploader uid: ", uploaderUID);
    var uploaderUserDataRef = dRef(db, "users/" + uploaderUID + "/email");

    get(uploaderUserDataRef, (snapshot) => {
      var data = snapshot.val();
      setUploaderEmail(data);
      console.log("Uploader Email: ", data);
    }).then(() => {
      setAsRejected(id);
    });
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
                Network Mistmatch. Please Switch to Polygon.
              </h3>
            </>
          )}
          <h3>Awaiting Review</h3>
          <div className="submitted__concerts__table">
            <div className="concert__table__headers">
              <div className="concert__id">ID </div>
              <div className="concert__thumbnail">IMG</div>
              <div className="concert__name admin__concert__name">Name</div>
              <div className="concert__perf__date admin__date">Upload Date</div>

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

          {!networkMismatch && (
            <div className="admin__button__div">
              <button
                className="login__button admin__button"
                onClick={() => {
                  navigate("/my-account");
                }}
              >
                My Account View
              </button>
            </div>
          )}
          {networkMismatch && (
            <div className="admin__button__div multibutton">
              <button
                className="login__button admin__button"
                onClick={() => {
                  navigate("/my-account");
                }}
              >
                My Account View
              </button>
              <button
                className="login__button admin__button"
                onClick={() => switchNetwork(ChainId.Mumbai)}
              >
                Switch to Polygon
              </button>
            </div>
          )}

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
  );
};

export default Admin;
