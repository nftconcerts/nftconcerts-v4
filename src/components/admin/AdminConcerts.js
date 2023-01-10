import React, { useState, useEffect } from "react";
import { db, fetchCurrentUser, logout, truncateAddress } from "../../firebase";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useNetworkMismatch, useNetwork, ChainId } from "@thirdweb-dev/react";
import FormBox from "../form/FormBox";
import emailjs from "@emailjs/browser";
import "../register/MyAccount.css";
import "./Admin.css";

const AdminConcerts = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [adminUser, setAdminUser] = useState(false);
  const [concertData, setConcertData] = useState();
  const [submittedConcertData, setSubmittedConcertData] = useState();
  const networkMismatch = useNetworkMismatch();
  const [uploaderEmail, setUploaderEmail] = useState();
  const [adminView, setAdminView] = useState(0);
  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

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

  //Check if user is admin
  useEffect(() => {
    if (userData?.userType === "admin") {
      setAdminUser(true);
    } else setAdminUser(false);
  }, [currentUser, userData]);

  //get submitted and live concert data
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
  }, []);

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
      var tempConcert = concertData[concert];
      var releaseDate = new Date(concertData[concert].concertReleaseDate);

      if (tempConcert.listingApproval === "Approved") {
        rows.push(
          <>
            <div className="concert__row">
              <div className="concert__id">#{tempConcert.concertId}</div>
              <div className="concert__thumbnail">
                <img
                  src={tempConcert.concertTokenImage}
                  height="50px"
                  className="payout__concert__thumbnail"
                />
              </div>
              <div className="approved__concert__name">
                {tempConcert.concertName}
              </div>
              <div className="approved__concert__name">
                {releaseDate.toLocaleTimeString()},{" "}
                {releaseDate.toLocaleDateString()}
              </div>
              <div className="approved__concert__price">
                <img
                  src="/media/eth-logo.png"
                  height={15}
                  className="c__eth__logo"
                />
                {parseFloat(tempConcert.concertPrice)}
              </div>
              <div className="approved__concert__minted">
                {tempConcert?.sales?.mintID - 1 || "0"}/
                {tempConcert.concertSupply}
              </div>
              <div className="approved__concert__minted">
                <img
                  src="/media/eth-logo.png"
                  height={15}
                  className="c__eth__logo"
                />
                {(tempConcert?.mintID - 1) * tempConcert.concertPrice}
              </div>

              <div className="approved__concert__minted">
                <img
                  src="/media/eth-logo.png"
                  height={15}
                  className="c__eth__logo"
                />
                {(
                  (tempConcert?.mintID - 1) *
                  tempConcert.concertPrice *
                  0.8
                ).toFixed(3)}
              </div>
              <div className="approved__concert__minted">
                <img
                  src="/media/eth-logo.png"
                  height={15}
                  className="c__eth__logo"
                />
                {(
                  (tempConcert?.mintID - 1) * tempConcert.concertPrice * 0.2 -
                  0.007
                ).toFixed(3)}
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

  //show the concert tables
  const showConcerts = () => {
    return (
      <>
        <div className="concert__table__container">
          <h3>NFT Concerts</h3>
          <div className="submitted__concerts__table">
            <div className="concert__table__headers concert__row">
              <div className="concert__id">ID </div>
              <div className="concert__thumbnail">IMG</div>
              <div className="approved__concert__name">Name</div>
              <div className="approved__concert__name">Release Date</div>
              <div className="approved__concert__price">Price</div>
              <div className="approved__concert__minted">Minted</div>
              <div className="approved__concert__minted">Rev.</div>
              <div className="approved__concert__minted">Artist Payout</div>
              <div className="approved__concert__minted">Profit</div>

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
            <div className="concert__table__headers concert__row">
              <div className="concert__id">L-ID </div>
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
        </div>
      </>
    );
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
        <>
          {" "}
          <div className="admin__page">
            <div className="admin__page__content">
              <div className="user__info__div">
                <div className="name__div">
                  <span className="bold__text welcome__text account__details">
                    Welcome {userData?.name} - Admin Portal
                  </span>
                  <br />

                  <>
                    <div className="first__letter account__details">
                      <button
                        onClick={() => {
                          navigate("/admin");
                        }}
                        className="admin__control__button"
                      >
                        View Users
                      </button>

                      <button
                        onClick={() => {
                          navigate("/admin/concerts");
                        }}
                        className="admin__control__button"
                        disabled={true}
                      >
                        View Concerts
                      </button>

                      <button
                        onClick={() => {
                          navigate("/admin/payouts");
                        }}
                        className="admin__control__button"
                      >
                        Artist Payouts
                      </button>

                      <button
                        onClick={() => {
                          navigate("/admin/partners");
                        }}
                        className="admin__control__button"
                      >
                        Partner Payouts
                      </button>
                    </div>
                  </>
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

              {showConcerts()}
            </div>
          </div>
        </>
      )}
      ;
    </>
  );
};

export default AdminConcerts;