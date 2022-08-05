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
import { ref as dRef, onValue } from "firebase/database";
import "./Admin.css";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(false);
  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();

  let navigate = useNavigate();

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //Check if user is admin or was uploader
  useEffect(() => {
    console.log(userData?.userType);
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
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, [currentUser]);

  //turn concert list into pretty table
  const submittedConcertTable = () => {
    var concertArray = concertData.filter((n) => n);
    console.log("mod arry", concertArray);
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
                <img src={tempConcert.concertThumbnailImage} height="50px" />
              </div>
              <div className="concert__name">{tempConcert.concertName}</div>
              <div className="concert__perf__date">
                {tempConcert.uploadTime}
              </div>

              <div className="concert__expand__button">
                <button
                  type="submit"
                  class="fa-solid fa-file-signature icon__button"
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
                  class="fa-solid fa-play icon__button"
                />
              </div>
              <div className="concert__token__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/concert?id=" + i.target.name);
                  }}
                  class="fa-solid fa-file-invoice-dollar icon__button"
                />
              </div>
              <div className="concert__approve__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/concert?id=" + i.target.name);
                  }}
                  className="approve__button"
                >
                  Approve
                </button>
              </div>
              <div className="concert__delete__button">
                <button
                  type="sumbit"
                  name={contractStr}
                  onClick={(i) => {
                    navigate("/concert?id=" + i.target.name);
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
      {adminUser && (
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
          <h3>Awaiting Review</h3>
          <div className="submitted__concerts__table">
            <div className="concert__table__headers">
              <div className="concert__id">ID </div>
              <div className="concert__thumbnail">IMG</div>
              <div className="concert__name">Name</div>
              <div className="concert__perf__date">Upload Date</div>

              <div className="header__expand__button">
                <i class="fa-solid fa-file-signature" />
              </div>
              <div className="header__play__button">
                <i class="fa-solid fa-play" />
              </div>
              <div className="header__token__button">
                <i class="fa-solid fa-file-invoice-dollar"></i>
              </div>
              <div className="concert__approve__button">
                <button type="sumbit" className="white__approve__button">
                  Approve
                </button>
              </div>
              <div className="concert__delete__button">
                <i class="fa-solid fa-trash " />
              </div>
            </div>
            {userData && submittedConcertTable(userData)}
            <div className="submitted__concert__row">
              <div className="submitted__concert__name"></div>
            </div>
          </div>
        </Contract>
      )}
    </>
  );
};

export default Admin;
