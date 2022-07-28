import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://nftconcerts.com/wp-content/uploads/2021/04/2022-Red-Banner-3000x750-web--scaled.jpg")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h2 className="banner__title">Own the Show</h2>
      </div>
      <div className="banner__fadeBottom"></div>
    </header>
  );
}

export default Banner;
