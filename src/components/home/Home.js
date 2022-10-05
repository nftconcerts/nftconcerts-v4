import React, { useState, useEffect } from "react";
import Banner from "../Banner";
import Row from "./Row";
import ComingSoonRow from "./ComingSoonRow";
import FooterTop from "../FooterTop";
import { ref as dRef, onValue } from "firebase/database";
import { db, getMobileMode, fetchCurrentUser } from "./../../firebase";
import "./Home.css";

import FormBox from "../form/FormBox";
import { useAddress, useNetworkMismatch } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Home = () => {
  let navigate = useNavigate();
  const networkMismatch = useNetworkMismatch();
  const [concertData, setConcertData] = useState();
  const firstReleaseConcerts = [0, 1];
  const trendingConcerts = [8, 2, 4, 6, 10];
  const concerts = [5, 4, 7, 2, 1];
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [pageMobileMode, setPageMobileMode] = useState(false);

  useEffect(() => {
    setPageMobileMode(getMobileMode());
  }, [networkMismatch]);

  //set current user
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
  //get concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, []);

  const [showNewUserWelcome, setShowNewUserWelcome] = useState(false);

  useEffect(() => {
    if (currentUser === null) {
      revealWelcome();
    }
  }, []);

  const revealWelcome = async () => {
    await delay(3000);
    if (currentUser === null) {
      window.scrollTo(0, 0);
      setShowNewUserWelcome(true);
    }
  };
  return (
    <>
      {concertData && showNewUserWelcome && !currentUser && (
        <div className="welcome__reveal__div">
          <div className="home__welcome__pop__up__overlay__div">
            <div className="home__purchased__pop__up__div">
              <div className="close__pop__up__div">
                <i
                  onClick={() => {
                    setShowNewUserWelcome(false);
                  }}
                  className="fa-solid fa-xmark close__icon__button"
                />{" "}
              </div>

              <h1 className="purchased__title welcome__title">
                Welcome to NFT Concerts
              </h1>

              <h3 className="welcome__motto">
                For the best user experience,
                <br /> please register an account.
              </h3>

              <button
                onClick={() => {
                  navigate("/register");
                }}
                className="buy__now my__button preview__button buy__now__button "
              >
                <div className="play__now__button__div">Register Now</div>
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="buy__now my__button preview__button buy__now__button welcome__login__button"
              >
                <div className="play__now__button__div">Login</div>
              </button>
              <p className="motto"> </p>
            </div>
          </div>
        </div>
      )}
      {concertData && (
        <div className="home__page">
          <Banner />
          <Row
            title="Minting Now"
            isLargeRow
            concertData={concertData}
            concerts={firstReleaseConcerts}
          />
          {/* <ComingSoonRow
            title="Trending Now"
            concertData={concertData}
            concerts={trendingConcerts}
          />
          <ComingSoonRow
            title="Recommended"
            concertData={concertData}
            concerts={concerts}
          />
          <ComingSoonRow
            title="Resale Marketplace"
            concertData={concertData}
            concerts={concerts}
          /> */}
          <ComingSoonRow
            title="1/1"
            concertData={concertData}
            concerts={concerts}
          />
          <ComingSoonRow
            title="Trending Now"
            concertData={concertData}
            concerts={concerts}
          />
          <ComingSoonRow
            title="Classic Shows"
            concertData={concertData}
            concerts={concerts}
          />
          <ComingSoonRow
            title="Audio Only"
            concertData={concertData}
            concerts={concerts}
            isFinalRow
          />
          <FooterTop />
        </div>
      )}
    </>
  );
};

export default Home;
