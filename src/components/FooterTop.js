import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FooterTop.css";
import { ref as dRef, set, update, onValue } from "firebase/database";
import { db, fetchCurrentUser } from "./../firebase";

function FooterTop() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  //check if there is logged in user already
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

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

  let navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer__top__fade">
        <div className="footer__top__cover" />{" "}
      </div>
      <div className="top__footer">
        <div className="center__prompt">
          <img
            src="/media/nftc-logo.png"
            className="center__logo"
            alt="NFT Concerts Logo"
          />
          {(currentUser === null && (
            <div className="center__prompt__center">
              <h2 className="prompt__text">Ready to Get Started?</h2>

              <div className="buttons__box">
                <button
                  className="my__button"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>

                <button
                  className="buy__now my__button no__wrap__button"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          )) || (
            <div className="center__prompt__center">
              <h2 className="prompt__text">Thank You for the Support</h2>

              <div className="buttons__box">
                <button
                  className="my__button"
                  onClick={() => {
                    navigate("/about");
                  }}
                >
                  Learn More
                </button>

                <button
                  className="buy__now my__button no__wrap__button"
                  onClick={() => {
                    navigate("/blog");
                  }}
                >
                  Read the Blog
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FooterTop;
