import React, { useState, useEffect } from "react";
import Row from "./Row";
import ComingSoonRow from "./ComingSoonRow";
import FooterTop from "../FooterTop";
import { ref as dRef, onValue } from "firebase/database";
import { db, fetchCurrentUser } from "./../../firebase";
import "./Home.css";
import MintPopUp from "../MintPopUp";
import ProductionRow from "./ProductionRow";
import ProductionPop from "./ProductionPop";
import CountdownBanner from "./CountdownBanner";

const Home = () => {
  const [concertData, setConcertData] = useState();
  const firstReleaseConcerts = [3, 0, 1, 2];
  const concerts = [5, 4, 7, 2];
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();

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
  const [singleConcert, setSingleConcert] = useState(4);

  const [showProductionPop, setShowProductionPop] = useState(false);
  const [productionID, setProductionID] = useState(0);

  return (
    <>
      {concertData && (
        <div className="home__page">
          {showMintPopUp && (
            <MintPopUp
              currentUser={currentUser}
              userData={userData}
              concertData={concertData[singleConcert]}
              concertID={singleConcert}
              setShowMintPopUp={setShowMintPopUp}
              setCurrentUser={setCurrentUser}
            />
          )}
          {showProductionPop && (
            <ProductionPop
              currentUser={currentUser}
              userData={userData}
              productionID={productionID}
              setProductionID={setProductionID}
              setShowProductionPop={setShowProductionPop}
              setCurrentUser={setCurrentUser}
            />
          )}

          <CountdownBanner
            setShowMintPopUp={setShowMintPopUp}
            concertData={concertData}
            concertID={4}
          />
          <Row
            title="NFT Concerts Minting Now"
            isLargeRow
            concertData={concertData}
            concerts={firstReleaseConcerts}
            singleConcert={singleConcert}
            setSingleConcert={setSingleConcert}
            setShowMintPopUp={setShowMintPopUp}
          />

          <ProductionRow
            setShowProductionPop={setShowProductionPop}
            productionID={productionID}
            setProductionID={setProductionID}
            intro="Go Backstage"
          />

          <ComingSoonRow
            title="Upcoming Shows"
            concertData={concertData}
            concerts={concerts}
            isFinalRow
          />
          <div className="row__gradient__blend" />
          <FooterTop currentUser={currentUser} userData={userData} />
        </div>
      )}
    </>
  );
};

export default Home;
