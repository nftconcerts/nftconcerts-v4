import React, { useState, useEffect, useRef } from "react";
import "./Row.css";
import { useNavigate } from "react-router-dom";

function Row({ concertData, concerts }) {
  let navigate = useNavigate();

  const handleClick = (concert) => {
    navigate(`/concert/${concert}`);
  };

  return (
    <div className="minting__now__container">
      <div className="minting__now__title__div">
        <div className="minting__now__top__fade"> </div>
        <div className="minting__now__text__div">
          <h1 className="minting__now__top__title">NFT Concerts</h1>
          <h3 className="minting__now__bottom__title">
            <span className="minting__now__title__emp">Minting</span> Now
          </h3>
        </div>
        <div className="minting__now__bottom__fade"> </div>
      </div>
      <div className={`row`}>
        {/* container -> posters */}

        {concertData && (
          <div className="row__posters" id="content">
            {concerts.map((concert) => (
              <img
                key={concert}
                onClick={() => handleClick(concert)}
                className={`row__poster`}
                src={concertData[concert]?.concertTokenImage}
                alt={"Babs.0 NFT Concert"}
              />
            ))}

            <div className="row__end__spacer" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Row;
