import React, { useState, useEffect } from "react";
import Contract from "../form/Contract";
import "./../../components/register/ArtistApp.css";
import {
  db,
  fetchCurrentUser,
  logout,
  truncateAddress,
} from "./../../firebase";
import { ref as dRef, set, get, onValue } from "firebase/database";
import "./Contact.css";
import { useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";

import { Helmet } from "react-helmet";
const Contact = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  let subject = searchParams.get("sbj");
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [pulledSubject, setPulledSubject] = useState();
  const [formItems, setFormItems] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    subject: subject || "",
    message: "",
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
        setFormItems((prevState) => ({
          ...prevState,
          name: data.name,
          email: data.email,
        }));
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
  const [messageSent, setMessageSent] = useState(false);

  const sendEmail = () => {
    var template_params = {
      email: formItems.email,
      name: formItems.name,
      subject: formItems.subject,
      message: formItems.message,
    };
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        "template_admin_contact",
        template_params,
        process.env.REACT_APP_EMAIL_USER_ID
      )
      .then(
        (result) => {
          sendUserEmail();

          setMessageSent(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  const sendUserEmail = () => {
    var template_params = {
      email: formItems.email,
      name: formItems.name,
      subject: formItems.subject,
      message: formItems.message,
    };
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        "template_user_contact",
        template_params,
        process.env.REACT_APP_EMAIL_USER_ID
      )
      .then(
        (result) => {
          setMessageSent(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const verifyThenSend = () => {
    if (formItems.email === "") {
      return alert("Email Required. Input and try again.");
    } else if (formItems.name === "") {
      return alert("Name Required. Input and try again.");
    } else if (formItems.subject === "") {
      return alert("Subject Required. Input and try again.");
    } else if (formItems.message === "") {
      return alert("Message Required. Input and try again.");
    } else sendEmail();
  };

  return (
    <Contract className="artist__app">
      <Helmet>
        <title>Contact NFT Concerts</title>
        <meta
          name="description"
          content="Looking for a collaboration, information, or support? Contact the NFT Concerts team and we will be in touch shortly."
        />
      </Helmet>
      <div className="artist__app__header__div">
        <h3 className="contact__app__heading">
          Email NFT Concerts (
          <a href="mailto:info@nftconcerts.com">info@nftconcerts.com</a>) or
          Fill Out this Form
        </h3>
        <input
          type="text"
          placeholder="Your Name"
          defaultValue={userData?.name}
          className="artist__app__input half__width"
          onChange={handleInputData("name")}
        />
        <input
          type="text"
          placeholder="Your Email"
          defaultValue={userData?.email}
          className="artist__app__input half__width"
          onChange={handleInputData("email")}
        />
        <input
          type="text"
          placeholder="Subject"
          defaultValue={subject}
          className="artist__app__input half__width"
          onChange={handleInputData("subject")}
        />
        <textarea
          rows="10"
          type="textarea"
          placeholder="Message"
          className="artist__app__textarea"
          onChange={handleInputData("message")}
        />

        {!messageSent && (
          <button
            className="login__button artist__app__button disabled__grey"
            onClick={() => {
              verifyThenSend();
            }}
            disabled={messageSent}
          >
            Submit Message
          </button>
        )}
        {messageSent && (
          <button
            className="login__button artist__app__button disabled__grey"
            onClick={() => {
              verifyThenSend();
            }}
            disabled={messageSent}
          >
            Message Sent
          </button>
        )}
      </div>
    </Contract>
  );
};

export default Contact;
