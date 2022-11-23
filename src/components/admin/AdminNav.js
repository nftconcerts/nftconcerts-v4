import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNav = (userData) => {
  let navigate = useNavigate();
  return (
    <div className="user__info__div">
      <div className="name__div">
        <span className="bold__text welcome__text account__details">
          Welcome {userData?.name} - Admin Portal
        </span>
        <br />

        <>
          <div className="first__letter account__details">
            <button
              onClick={() => {
                navigate("/admin");
              }}
              className="admin__control__button"
            >
              View Users
            </button>

            <button
              onClick={() => {
                navigate("/admin/concerts");
              }}
              className="admin__control__button"
            >
              View Concerts
            </button>

            <button
              onClick={() => {
                navigate("/admin/payouts");
              }}
              className="admin__control__button"
            >
              Artist Payouts
            </button>

            <button
              onClick={() => {
                navigate("/admin/payouts");
              }}
              className="admin__control__button"
            >
              Partner Payouts
            </button>
          </div>
        </>
      </div>

      <div className="account__image">
        <div
          className="account__image__hover"
          onClick={() => {
            navigate("/my-account/image");
          }}
        >
          <i className="fa-solid fa-pen account__image__hover" />
        </div>
        <img src={userData?.image} className="account__image" />
      </div>
    </div>
  );
};

export default AdminNav;
