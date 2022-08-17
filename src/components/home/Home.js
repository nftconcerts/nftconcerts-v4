import React, { useState, useEffect } from "react";
import Banner from "../Banner";
import Row from "./Row";
import FooterTop from "../FooterTop";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { db } from "./../../firebase";
import "./Home.css";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Home = () => {
  const [concertData, setConcertData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const firstReleaseConcerts = [1, 2, 7, 4, 5, 6];
  const trendingConcerts = [8, 2, 4, 6, 10];
  const concerts = [5, 4, 7, 2, 1];

  //get concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
  }, []);

  return (
    <>
      {concertData && (
        <div className="home__page">
          <Banner />
          <Row
            title="First Release"
            isLargeRow
            concertData={concertData}
            concerts={firstReleaseConcerts}
          />
          <Row
            title="Trending Now"
            concertData={concertData}
            concerts={trendingConcerts}
          />
          <Row
            title="Recommended"
            concertData={concertData}
            concerts={concerts}
          />
          <Row
            title="Resale Marketplace"
            concertData={concertData}
            concerts={concerts}
          />
          <Row title="1/1" concertData={concertData} concerts={concerts} />
          <Row
            title="Latest Release"
            concertData={concertData}
            concerts={concerts}
          />
          <Row
            title="Classic Shows"
            concertData={concertData}
            concerts={concerts}
          />
          <Row
            title="Audio Only"
            concertData={concertData}
            concerts={concerts}
          />
          <FooterTop />
        </div>
      )}
    </>
  );
};

export default Home;
