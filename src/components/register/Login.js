import React, { useState, useEffect } from "react";
import "./Login.css";
import FormBox from "../form/FormBox";
import {
  login,
  logout,
  fetchCurrentUser,
  truncateAddress,
  db,
} from "./../../firebase";
import { useNavigate } from "react-router-dom";
import { ref as dRef, onValue } from "firebase/database";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [userData, setUserData] = useState();

  let navigate = useNavigate();
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  //download User Data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  const inlineLogout = () => {
    logout();
    setCurrentUser(null);
    window.location.reload();
  };

  const confirmUser = async () => {
    await login(email, password);
    setCurrentUser(fetchCurrentUser());
    navigate("/my-account");
    window.location.reload();
  };

  return (
    <FormBox>
      {!currentUser && (
        <div className="login__form">
          <div className="email__login">
            <h3 className="login__heading">Please Log In to Your Account</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmUser();
              }}
            >
              <input
                placeholder="Email"
                name="email"
                className="login__input"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
              <input
                placeholder="Password"
                name="password"
                type="password"
                className="login__input"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
              <input type="submit" value="Log In" className="login__button" />
            </form>
            <div className="reset__password">
              <a href="/reset-password">Forgot Password?</a>
            </div>
          </div>
          <div className="or__split">
            <h3>Featuring Two-Factor Authentication </h3>
            <div className="new__user__prompt">
              New User? <a href="/register">Register Now!</a>
            </div>
          </div>
        </div>
      )}

      {currentUser && (
        <div className="login__form">
          <div className="logged__in__already">
            <p>Currently Logged in as </p>
            <p className="logged__in__email">{currentUser?.user.displayName}</p>
            <p className="logged__in__email">{currentUser?.user.email}</p>
            {userData?.walletID && (
              <p className="logged__in__email">
                {truncateAddress(userData?.walletID)}
              </p>
            )}
            <button
              className="login__button logout__button"
              onClick={inlineLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </FormBox>
  );
}

export default Login;
