import React, { useState } from "react";
import FormBox from "../form/FormBox";
import { auth, fetchCurrentUser, sendPasswordReset } from "./../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState();
  const [requested, setRequested] = useState(false);
  const sendReset = () => {
    setRequested(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <FormBox>
      <div className="reset__password">
        <h3 className="login__heading">Enter Email to Reset Password</h3>
        <input
          placeholder="Email"
          name="email"
          className="login__input"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          onSubmit={(e) => setEmail(e.target.value)}
        />
        {!requested && (
          <input
            type="submit"
            value="Send Reset Email"
            className="login__button"
            onClick={sendReset}
            disabled={requested}
          />
        )}
        {requested && (
          <input
            type="submit"
            value="Email Sent"
            className="login__button"
            onClick={sendReset}
            disabled={requested}
          />
        )}
        <div className="email__disclaimer">
          {" "}
          Please allow a few minutes for the password reset email to arrive.
        </div>
        <h3 className="login__heading help__heading">Still need help?</h3>
        <input
          type="submit"
          value="CONTACT SUPPORT"
          className="register__button switch__button"
          onClick={() => {
            navigate("/support");
          }}
        />
      </div>
    </FormBox>
  );
};

export default ResetPassword;
