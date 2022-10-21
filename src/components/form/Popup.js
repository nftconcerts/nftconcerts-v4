import React from "react";
import "./Popup.css";

const Popup = ({ children, setShowPurchased }) => {
  return (
    <div className="pop__up__overlay__div">
      <div className="pop__up__div">
        <div className="close__pop__up__div">
          <i
            onClick={() => {
              setShowPurchased(false);
            }}
            className="fa-solid fa-xmark close__icon__button"
          />{" "}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Popup;
