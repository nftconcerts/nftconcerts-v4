import React, { useState } from "react";
import { login, fetchCurrentUser } from "../../firebase";

const PopLogin = ({ setCurrentUser, setNewUser, setShowLogin }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  //confirm user
  const confirmUser = async () => {
    await login(email, password);
    setCurrentUser(fetchCurrentUser());
    setNewUser(true);
  };

  return (
    <>
      <div className="mint__pop__login__form">
        <form className="mint__pop__login__form__inner" id="login__form">
          <input
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </form>
        <button
          onClick={confirmUser}
          className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button"
        >
          <div className="play__now__button__div ">Log in</div>
        </button>
      </div>
      <div
        className="text__only__button"
        onClick={() => {
          setShowLogin(false);
        }}
      >
        New User? Register Now
      </div>
    </>
  );
};

export default PopLogin;
