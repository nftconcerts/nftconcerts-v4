import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import { db, fetchCurrentUser, logout, truncateAddress } from "../../firebase";
import { ref as dRef, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";

const AccountPage = ({ children }) => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const banner = userData?.userBanner || "/media/banner.jpg";

  //set current user
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

  //logout user
  const inlineLogout = () => {
    logout();
    setCurrentUser(null);
    navigate("/");
    window.location.reload();
  };

  let currentUrl = window.location.pathname;

  return (
    <div>
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

      {currentUser && userData && (
        <div className="user__page">
          <div
            className="user__banner"
            style={{
              backgroundImage: `url(${banner})`,
            }}
          >
            <div className="user__banner__botfade" />
          </div>

          <div className="user__info__div">
            <div className="user__info__box">
              <div className="user__info__content square">
                <div
                  className="account__image__div"
                  style={{
                    backgroundImage: `url(${userData?.image})`,
                  }}
                />

                <h3 className="user__info__name">{userData?.name}</h3>
                <p className="user__info__address">
                  <a
                    href={`https://etherscan.com/address/${userData?.walletID}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncateAddress(userData?.walletID)}
                  </a>
                </p>
                {currentUrl != "/my-account" && (
                  <button
                    className="library__button user__info__button"
                    onClick={() => {
                      navigate("/my-account");
                    }}
                  >
                    View Library
                  </button>
                )}
                {currentUrl != "/my-account/settings" && (
                  <button
                    className="library__button user__info__button"
                    onClick={() => {
                      navigate("/my-account/settings");
                    }}
                  >
                    Edit Profile
                  </button>
                )}
                {userData?.userType === "admin" && (
                  <>
                    <button
                      className="library__button user__info__button"
                      onClick={() => {
                        navigate("/admin");
                      }}
                    >
                      Admin View{" "}
                    </button>
                  </>
                )}
                {userData?.userType === "artist" && (
                  <>
                    {currentUrl != "/my-account/artist" && (
                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          navigate("/my-account/artist");
                        }}
                      >
                        Artist View{" "}
                      </button>
                    )}
                    <button
                      className="library__button user__info__button"
                      onClick={() => {
                        navigate("/upload");
                      }}
                    >
                      Upload{" "}
                    </button>
                  </>
                )}

                <button
                  className="library__button user__info__button"
                  onClick={() => {
                    navigate("/u/" + userData.userSlug);
                  }}
                >
                  View Public Profile{" "}
                </button>
                <button
                  className="library__button user__info__button"
                  onClick={inlineLogout}
                >
                  Logout{" "}
                </button>
              </div>
            </div>
            <div className="name__div">
              <span className="bold__text welcome__text account__details hide__600">
                Welcome {userData?.name}
              </span>
              <br />
              <div className="contained__library">{children}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
