import React, { useState, useEffect } from "react";
import "./CountdownBanner.css";
import { useNavigate } from "react-router-dom";

const CountdownBanner = () => {
  let navigate = useNavigate();
  return (
    <div className="countdown__banner__div">
      <div className="countdown__banner__content">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2FFabz%20IG%20Poster%20banner.jpg?alt=media&token=3edd0fce-aa0f-4c97-ad11-a0a999e5f565"
          className="schedule__image"
          onClick={() => {
            navigate("/concert/3");
          }}
        />
        {/* <h3 className="countdown__banner__header">
            Upcoming NFT Concert - Minting 12/15
          </h3>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2FFabz%20Token%20Image%20V1.png?alt=media&token=4c7ea59e-e356-4ede-a443-01d85e79361c"
            className="row__poster no__grow__poster "
          />
          <h3 className="countdown__banner__title">
            NSR COViD LiVE STREAM by FABZ Pi & M3
          </h3>
          <p>Preview Coming Soon...</p> */}
      </div>
    </div>
  );
};

export default CountdownBanner;
