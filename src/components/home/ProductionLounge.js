import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import { useNavigate } from "react-router-dom";
import "./ProductionLounge.css";
import { db, fetchCurrentUser } from "./../../firebase";
import { ref as dRef, onValue } from "firebase/database";
import emailjs from "@emailjs/browser";

const ProductionLounge = () => {
  let navigate = useNavigate();
  const [knocked, setKnocked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();

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

  const sendEmail = () => {
    var template_params = {
      email: userData.email,
      name: userData.name,
      subject: `${userData.name} Knocked on Production Lounge Door`,
      message: "Get the lounge open",
    };
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        "template_admin_contact",
        template_params,
        process.env.REACT_APP_EMAIL_USER_ID
      )
      .then((error) => {
        console.log(error.text);
      });
  };

  return (
    <FormBox>
      <div className="lounge__div">
        <h3>Production Team Lounge</h3>
        <p> Coming Soon </p>
        {(knocked && (
          <button className="login__button knocked__button" disabled={true}>
            Knocked
          </button>
        )) || (
          <button
            className="login__button"
            onClick={() => {
              setKnocked(true);
              sendEmail();
            }}
          >
            Knock
          </button>
        )}

        <button
          className="login__button"
          onClick={() => {
            navigate("/");
          }}
        >
          Go home
        </button>
      </div>
    </FormBox>
  );
};

export default ProductionLounge;
