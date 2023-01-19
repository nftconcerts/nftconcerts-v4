import React, { useEffect, useState } from "react";
import { db, fetchCurrentUser } from "../../firebase";
import FormBox from "../form/FormBox";
import { useNavigate } from "react-router-dom";
import "../register/MyAccount.css";
import { ref as dRef, onValue } from "firebase/database";
import "./Admin.css";
import AdminUsers from "./AdminUsers";
import AccountPage from "../register/AccountPage";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(false);
  const [userData, setUserData] = useState();

  const [allUserData, setAllUserData] = useState();

  let navigate = useNavigate();

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //Check if user is admin
  useEffect(() => {
    if (userData?.userType === "admin") {
      setAdminUser(true);
    } else setAdminUser(false);
  }, [currentUser, userData]);

  //get user data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
      var allUserDataRef = dRef(db, "users");
      onValue(allUserDataRef, (snapshot) => {
        var data = snapshot.val();
        setAllUserData(data);
      });
    }
  }, [currentUser]);

  return (
    <>
      {currentUser === null && (
        <FormBox>
          <div className="no__user">
            <h3>No Current User. </h3>
            <p>Please Register or Login </p>
            <button
              className="login__button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go To Login Page
            </button>
            <button
              className="login__button"
              onClick={() => {
                navigate("/register");
              }}
            >
              New User? Sign Up
            </button>
          </div>
        </FormBox>
      )}
      {!adminUser && currentUser && (
        <FormBox>
          <div className="no__user">
            <h3>You're not Admin! </h3>
            <p>Good luck with your attack. </p>
            <button
              className="login__button"
              onClick={() => {
                navigate("/my-account");
              }}
            >
              Go To Account Page
            </button>
            <button
              className="login__button"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Home
            </button>
          </div>
        </FormBox>
      )}
      {adminUser && allUserData && (
        <AccountPage>
          <div className="admin__page__content">
            <h3 className="library__heading admin__heading">Admin Panel</h3>
            <div className="admin__panel">
              <>
                <div className="first__letter account__details">
                  <button
                    onClick={() => {
                      navigate("/admin");
                    }}
                    className="admin__control__button"
                    disabled={true}
                  >
                    View Users
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin/concerts");
                    }}
                    className="admin__control__button"
                  >
                    View Concerts
                  </button>
                </div>
              </>
            </div>

            {AdminUsers(allUserData)}
          </div>
        </AccountPage>
      )}
    </>
  );
};

export default Admin;
