import React from "react";
import "./Contract.css";

function Contract({ children }) {
  return (
    <div className="contract__page__container">
      <div className="contract__page">
        <div className="contract__overall">
          <div className="contract__header">
            <img
              src="https://nftconcerts.com/wp-content/uploads/2021/02/arc-logo-600x190-White-1.png"
              className="center__logo"
              alt="NFT Concerts Logo"
            />
          </div>
          <div className="contract__box">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Contract;
