import React from "react";
import FormBox from "../form/FormBox";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  let navigate = useNavigate();
  return (
    <FormBox>
      <div className="not__found__div">
        <h3>Page Not Found</h3>
        <button
          className="login__button logout__button"
          onClick={() => {
            navigate("/");
          }}
        >
          Go Home
        </button>
        <button
          className="login__button logout__button"
          onClick={() => {
            navigate("/contact");
          }}
        >
          Contact Support
        </button>
      </div>
    </FormBox>
  );
};

export default NotFound;
