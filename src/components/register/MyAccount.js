import React, { useEffect, useState } from "react";
import { fetchCurrentUser, logout, truncateAddress } from "./../../firebase";
import FormBox from "../form/FormBox";

const MyAccount = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  const inlineLogout = () => {
    logout();
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
    </FormBox>
  );
};

export default MyAccount;
