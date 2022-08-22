import React, { useState, useEffect } from "react";
import Contract from "../form/Contract";
import "./ArtistApp.css";
import {
  db,
  fetchCurrentUser,
  logout,
  truncateAddress,
} from "./../../firebase";
import { ref as dRef, set, get, onValue } from "firebase/database";

const ArtistApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [formItems, setFormItems] = useState({
    stageName: "",
    firstName: "",
    lastName: "",
    email: userData?.email || "",
    website: "",
    twitter: "",
    instagram: "",
    numberOfShows: "1-5 Live Shows Per Year",
  });

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //get user data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  //deal with form data
  const handleInputData = (input) => (e) => {
    // input value from the form
    const { value } = e.target || {};

    //updating for data state taking previous state and then adding new value to create new object
    setFormItems((prevState) => ({
      ...prevState,
      [input]: value,
    }));
  };

  return (
    <Contract className="artist__app">
      <div className="artist__app__header__div">
        <h1 className="artist__app__title">Artist Application</h1>
        <h3 className="artist__app__subtext">
          Transform Your Concerts Into Collectibles
        </h3>
        <input
          type="text"
          placeholder="Stage Name"
          className="artist__app__input"
          onChange={handleInputData("stageName")}
        />
        <input
          type="text"
          placeholder="First Name"
          className="artist__app__input"
          onChange={handleInputData("firstName")}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="artist__app__input"
          onChange={handleInputData("lastName")}
        />
        <input
          type="text"
          placeholder="Website"
          className="artist__app__input"
          onChange={handleInputData("website")}
        />
        <input
          type="text"
          placeholder="@Twitter"
          className="artist__app__input"
          onChange={handleInputData("twitter")}
        />
        <input
          type="text"
          placeholder="@Instagram"
          className="artist__app__input"
          onChange={handleInputData("instagram")}
        />
        <div className="select app__select">
          <select
            name="liveShowsPerYear"
            placeholder="# of Live Shows Per"
            defaultValue={formItems.numberOfShows}
            onChange={handleInputData("concertRecordingType")}
          >
            <option
              className="valid__option"
              value="1-5 Live Shows per Year"
              selected
            >
              1-5 Live Shows per Year
            </option>
            <option className="valid__option" value="5-20 Live Shows per Year">
              5-20 Live Shows per Year
            </option>
            <option
              className="valid__option"
              value="20-100 Live Shows per Year"
            >
              20-100 Live Shows per Year
            </option>
            <option className="valid__option" value="100+ Live Shows per Year">
              100+ Live Shows per Year
            </option>
          </select>
        </div>
        <button className="login__button artist__app__button">
          Submit Application
        </button>
      </div>
    </Contract>
  );
};

export default ArtistApp;
