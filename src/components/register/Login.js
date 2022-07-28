import React, { useState, useEffect } from "react";
import "./Login.css";
import FormBox from "../form/FormBox";
import {
  login,
  logout,
  fetchCurrentUser,
  truncateAddress,
} from "./../../firebase";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [errorMsg, setErrorMessage] = useState("");

  const connectWithMetamask = useMetamask();
  const address = useAddress();

  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  const inlineLogout = () => {
    logout();
    setTempUser(null);
    setCurrentUser(null);
  };

  const inlineLogin = async () => {
    await login(email, password);
    setTempUser(fetchCurrentUser());
  };

  const confirmUser = () => {
    setCurrentUser(tempUser);
  };

  return (
    <FormBox>
      {!currentUser && !tempUser && (
        <div className="login__form">
          <div className="email__login">
            <h3 className="login__heading">Please Log In to Your Account</h3>
            <label>Email</label>
            <input
              placeholder="Email"
              name="email"
              className="login__input"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              onSubmit={(e) => setEmail(e.target.value)}
            />{" "}
            <label>Password</label>
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="login__input"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              onSubmit={(e) => setPassword(e.target.value)}
            />{" "}
            <input
              type="submit"
              value="Log In"
              className="login__button"
              onClick={inlineLogin}
            />
            <div className="reset__password">
              <a href="/reset-password">Forgot Password?</a>
            </div>
          </div>
          <div className="or__split">
            <h3>Featuring Two-Factor Authentication </h3>
            <div className="reset__password new__user__prompt">
              New User? <a href="/register">Register Now!</a>
            </div>
          </div>
        </div>
      )}
      {tempUser && !currentUser && (
        <div className="temp__user__box">
          <div className="temp__user__info">
            <p className="info__p">Logging in as</p>
            <p className="info__p"> {tempUser.user.displayName}</p>
            <p className="info__p"> {tempUser.user.email}</p>

            {address && address === tempUser.user.photoURL && (
              <>
                <input
                  type="button"
                  value="Address Confirmed - Login"
                  className="register__button"
                  onClick={confirmUser}
                  disabled={false}
                />
                <div className="connected__info">
                  Connected as {truncateAddress(address)}
                </div>
              </>
            )}
            {address && address !== tempUser.user.photoURL && (
              <>
                <input
                  type="button"
                  value="Wrong Address"
                  className="register__button"
                  onClick={confirmUser}
                  disabled={true}
                />
                <div className="connected__info">
                  <p className="current__wallet">
                    Connected as {truncateAddress(address)}
                  </p>
                  <p className="necessary__wallet">
                    Please switch to {truncateAddress(tempUser?.user.photoURL)}
                  </p>
                </div>
              </>
            )}
            {!address && (
              <input
                type="button"
                value="Connect to MetaMask"
                className="register__button"
                onClick={connectWithMetamask}
              />
            )}
          </div>

          <div className="temp__user__logout__div">
            <input
              type="button"
              value="Switch Account"
              className="register__button switch__button"
              onClick={inlineLogout}
            />
          </div>
        </div>
      )}
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
    </FormBox>
  );
}

export default Login;
