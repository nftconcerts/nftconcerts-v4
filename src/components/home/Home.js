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
import MintPopUp from "../MintPopUp";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Home = () => {
  let navigate = useNavigate();
  const networkMismatch = useNetworkMismatch();
  const [concertData, setConcertData] = useState();
  const firstReleaseConcerts = [0, 1, 2];
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

  const [showMintPopUp, setShowMintPopUp] = useState(false);
  const [singleConcert, setSingleConcert] = useState(0);

  return (
    <>
      {concertData && (
        <div className="home__page">
          {showMintPopUp && (
            <MintPopUp
              currentUser={currentUser}
              concertData={concertData[singleConcert]}
              concertID={singleConcert}
              setShowMintPopUp={setShowMintPopUp}
              setCurrentUser={setCurrentUser}
            />
          )}
          <Banner />
          <Row
            title="Minting Now"
            isLargeRow
            concertData={concertData}
            concerts={firstReleaseConcerts}
            singleConcert={singleConcert}
            setSingleConcert={setSingleConcert}
            setShowMintPopUp={setShowMintPopUp}
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
