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

const MyAccount = () => {
  const [currentUser, setCurrentUser] = useState(null);
  let navigate = useNavigate();
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  const inlineLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const [userData, setUserData] = useState();
  const [concertData, setConcertData] = useState();

  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
        console.log(data);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
      console.log("concert Data: ", cData);
    });
  }, [currentUser]);

  const submittedConcertTable = (myUserData) => {
    const rows = [];
    for (var i in myUserData.submittedConcerts) {
      var row = [];
      var tempConcertId = parseInt(myUserData.submittedConcerts[i].concertId);
      var tempConcert = concertData[tempConcertId];
      console.log(concertData[tempConcertId]);
      console.log(JSON.stringify(myUserData.submittedConcerts[i].concertId));
      rows.push(JSON.stringify(myUserData.submittedConcerts[i].concertId));
      return (
        <>
          <div className="concert__row">
            <div className="concert__id">#{tempConcert.concertId}</div>
            <div className="concert__thumbnail">
              <img src={tempConcert.concertThumbnailImage} height="50px" />
            </div>
            <div className="concert__name">{tempConcert.concertName}</div>
            <div className="concert__perf__date">
              {tempConcert.concertPerformanceDate}
            </div>
            <div className="concert__listing__approval">
              {tempConcert.listingApproval}
            </div>
            <div className="concert__expand__button">
              <i class="fa-solid fa-file-signature" />
            </div>
            <div className="concert__play__button">
              <i class="fa-solid fa-play" />
            </div>
          </div>
        </>
      );
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
                navigate("/sign-up");
              }}
            >
              Go To Login Page
            </button>
            <button
              className="login__button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go To Login Page
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
          <h3>Submitted Concerts</h3>
          <div className="submitted__concerts__table">
            <div className="concert__table__headers">
              <div className="concert__id">ID </div>
              <div className="concert__thumbnail">IMG</div>
              <div className="concert__name">Name</div>
              <div className="concert__perf__date">Performance Date</div>
              <div className="concert__listing__approval">Listing Approval</div>
              <div className="header__expand__button">
                <i class="fa-solid fa-file-signature" />
              </div>
              <div className="header__play__button">
                <i class="fa-solid fa-play" />
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

export default MyAccount;
