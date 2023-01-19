import React from "react";
import "./Banner.css";

function Banner({ children, title, subtitle }) {
  return (
    <header className="banner">
      <div className="banner__contents">
        <h2 className="banner__title">{title}</h2>
        <h3 className="banner__subtitle">
          {/* Exclusive Concerts Unlocked by NFTs */}
          {subtitle}
        </h3>
        {children}
      </div>
      <div className="banner__fadeBottom"></div>
    </header>
  );
}

export default Banner;
