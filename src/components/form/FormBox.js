import React from "react";
import "./FormBox.css";

function FormBox({ children }) {
  return (
    <div className="form__page__container">
      <div className="form__page">
        <div className="form__overall">
          <div className="form__header">
            <img
              src="/media/nftc-logo.png"
              className="center__logo"
              alt="NFT Concerts Logo"
            />
          </div>
          <div className="form__box">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default FormBox;
