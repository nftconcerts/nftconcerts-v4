import React from "react";
import Banner from "../Banner";
import Row from "./Row";
import FooterTop from "../FooterTop";

const Home = (concertData) => {
  return (
    <div className="home__page">
      <Banner />
      <Row title="First Release" isLargeRow concertData={concertData} />
      <Row title="Trending Now" concertData={concertData} />
      <Row title="Recommended" concertData={concertData} />
      <Row title="Resale Marketplace" concertData={concertData} />
      <Row title="1/1" concertData={concertData} />
      <Row title="Latest Release" concertData={concertData} />
      <Row title="Classic Shows" concertData={concertData} />
      <Row title="Audio Only" concertData={concertData} />
      <FooterTop />
    </div>
  );
};

export default Home;
