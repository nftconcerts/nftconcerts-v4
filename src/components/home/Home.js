import React, { useState, useEffect } from "react";
import Banner from "../Banner";
import Row from "./Row";
import FooterTop from "../FooterTop";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { db } from "./../../firebase";
import "./Home.css";
import checkProductionTeam from "../../scripts/checkProductionTeam";
import FormBox from "../form/FormBox";
import { useAddress } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Home = () => {
  let navigate = useNavigate();
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

  //check if user is holding production team NFT
  const [productionTeam, setProductionTeam] = useState(false);
  const address = useAddress();
  const [showResult, setShowResult] = useState(false);
  const [ptBalance, setPtBalance] = useState(0);
  const [plBalance, setPlBalance] = useState(0);

  const productionCheck = async () => {
    if (address) {
      var checkResult = await checkProductionTeam(address);
      setPtBalance(checkResult[0]);
      setPlBalance(checkResult[1]);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    }
  };

  useEffect(() => {
    productionCheck();
  }, [address]);

  return (
    <>
      {!productionTeam && (
        <FormBox>
          <div className="not__production__div">
            {" "}
            <h3>
              {" "}
              You must be a member of the production team to view this site.
            </h3>
            <img
              src="/media/production-team.jpg"
              className="production__team__image__two"
            />
            <button
              onClick={() => {
                navigate("/");
              }}
              className="login__button"
            >
              Join Now
            </button>
          </div>
        </FormBox>
      )}
      {concertData && productionTeam && (
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
