import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import { fetchCurrentUser } from "./../../firebase";
import "./Rules.css";
import { useNavigate } from "react-router-dom";

// creating functional component ans getting props from upload.js and destucturing them
const Rules = ({
  nextStep,
  handleFormData,
  values,
  whileUploading,
  infoBox,
}) => {
  //creating error state for validation
  const [error, setError] = useState(false);
  const [info, setInfo] = useState(
    "Fill out this form to create a NFT Concert"
  );
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser()?.user);
  const [loggedIn, setLoggedIn] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  // after form submit validating the form data using validator
  const submitFormData = (e) => {
    e.preventDefault();

    // checking if value of first name and last name is empty show error else take to step 2
    nextStep();
  };
  const switchShowInfo = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };
  useEffect(() => {
    setCurrentUser(fetchCurrentUser()?.user);
  }, []);

  const navigate = useNavigate();

  const routeChange = () => {
    let path = "/login";
    navigate(path);
  };
  return (
    <>
      <FormBox>
        {whileUploading && infoBox()}
        {currentUser == null && (
          <div className="not__logged__in">
            <p>
              Please log in <br />
              to upload a recording.
            </p>
            <button
              className="login__button hidden__button"
              onClick={routeChange}
            >
              Log in
            </button>
          </div>
        )}
        {currentUser && (
          <>
            {showInfo && (
              <div className="info__pop__up">
                <div className="info__box">
                  <p>
                    Complete this form to create a<br />
                    NFT Concert.
                  </p>
                </div>
              </div>
            )}
            <i
              className="fa-solid fa-circle-info float__icon"
              onClick={switchShowInfo}
            ></i>
            <h3 className="rules__title">Be Sure to Follow the Rules</h3>
            <p className="align__left">
              <b>
                <span className="emp pad__bot">Requirements:</span>
              </b>{" "}
              <br />
              &#x2714; Full Performance Recording
              <br />
              &#x2714; Thumbnail Image
              <br />
              &#x2714; Setlist
              <br /> <b>&#x2714; 100% Original Content You Own</b>
              <br />
              <br />
            </p>
            <p className="align__left">
              <b>
                {" "}
                <span className="emp pad__bot">Do Not:</span>
              </b>{" "}
              <span className="bump__right">
                <br /> &#x2716; Cover Other Artists Songs
                <br />
                &#x2716; Record Without Permission From Venue
                <br />
                &#x2716; Violate Any Existing Contracts
                <br />
                <br />
              </span>
            </p>
            <input
              type="button"
              value="I Read The Rules"
              className="login__button rules__button"
              onClick={submitFormData}
            />
            <div className="progress__bar">
              <div className="progress__step step__0"></div>
            </div>
          </>
        )}
      </FormBox>
    </>
  );
};

export default Rules;
