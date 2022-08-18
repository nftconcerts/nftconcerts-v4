import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import "./Register.css";
import "./Login.css";

import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  db,
  register,
  fetchCurrentUser,
  truncateAddress,
  logout,
} from "./../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref as dRef, set } from "firebase/database";
import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from "@thirdweb-dev/react";
import dateFormat from "dateformat";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const dbRef = dRef(db);

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [termsOfService, setTermsOfService] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  //check if there is logged in user already
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  //basic security checks before registering user.
  const checkThenRegister = async () => {
    if (email == "") return alert("Missing email address");
    if (displayName == "") return alert("Missing email address");
    if (password == "") return alert("Missing password");
    if (passwordConfirm == "") return alert("Missing password confirmation");
    if (!document.getElementById("acceptTerms").checked)
      return alert("Please accept the terms of service.");
    if (password == passwordConfirm) {
      var registrationDate = new Date();
      var dateString = dateFormat(registrationDate, "m/d/yyyy, h:MM TT Z ");
      setLoading(true);
      const newUser = await register(email, password, displayName, address);
      if (newUser) {
        var uid = newUser.user.uid;
        await delay(500);
        setCurrentUser(newUser);

        set(dRef(db, "users/" + uid), {
          name: displayName,
          email: email,
          walletID: address,
          registrationDate: dateString,
          userType: "fan",
        })
          .then(() => {
            console.log("data uploaded to db");
          })
          .catch((error) => {
            console.log("error");
          });
        setLoading(false);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  const inlineLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <FormBox>
      {currentUser && (
        <div className="login__form">
          <div className="logged__in__already">
            <p>Currently Logged in as </p>
            <p className="logged__in__email">{currentUser?.user.displayName}</p>
            <p className="logged__in__email">{currentUser?.user.email}</p>
            <p className="logged__in__email">
              {truncateAddress(currentUser?.user.photoURL)}
            </p>
            <button
              className="login__button logout__button"
              onClick={inlineLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {currentUser == null && (
        <div className="register__form">
          <label>Email</label>
          <input
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            type="email"
          />
          <label>Username</label>
          <input
            name="dispalyName"
            placeholder="Name"
            onChange={(e) => setDisplayName(e.target.value)}
            required={true}
          />
          <label>Password</label>
          <input
            name="password"
            placeholder="Password"
            required={true}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <label>Confirm Password</label>
          <input
            name="confirm__password"
            placeholder="Confirm Password"
            required={true}
            type="password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />{" "}
          <div className="checkbox__div">
            <input
              placeholder="I will not release this content somewhere else."
              type="checkbox"
              className="large__checkbox"
              required={true}
              id="acceptTerms"
            />
          </div>
          <h3 className="terms">
            {" "}
            I agree to the NFT Concerts <br />
            <a
              href="/terms-of-service"
              className="nftc__link2"
              target="_blank"
              rel="noopener noreferrer"
              required="required"
            >
              Terms of Service
            </a>
          </h3>
          {address ? (
            <>
              {loading ? (
                <input
                  type="button"
                  value="Loading..."
                  className="register__button"
                  onClick={checkThenRegister}
                  disabled={true}
                />
              ) : (
                <>
                  {networkMismatch && (
                    <button
                      onClick={() => switchNetwork(ChainId.Mumbai)}
                      className="register__button"
                    >
                      Switch to Polygon
                    </button>
                  )}
                  {!networkMismatch && (
                    <input
                      type="button"
                      value="Register"
                      className="register__button"
                      onClick={checkThenRegister}
                      disabled={false}
                    />
                  )}
                </>
              )}
              <div className="connected__info">
                Connected as {truncateAddress(address)}
              </div>
            </>
          ) : (
            <input
              type="button"
              value="Connect to MetaMask"
              className="register__button"
              onClick={connectWithMetamask}
            />
          )}
        </div>
      )}
    </FormBox>
  );
}

export default Register;
