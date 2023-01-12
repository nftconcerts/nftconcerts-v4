import React, { useState, useEffect } from "react";
import Contract from "../form/Contract";
import Form from "../form/FormBox";
import { useNavigate } from "react-router-dom";
import {
  db,
  fetchCurrentUser,
  truncateAddress,
  logout,
  storage,
} from "./../../firebase";
import FormBox from "../form/FormBox";

import { updateProfile, updateEmail, getAuth } from "firebase/auth";
import { useMetamask, useAddress, useDisconnect } from "@thirdweb-dev/react";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Web3Provider } from "@ethersproject/providers";
import WalletLink from "walletlink";
import "./MyAccount.css";
import "./AccountInfo.css";
import {
  getDownloadURL,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";
import { ref as dRef, set, onValue } from "firebase/database";
import makeid from "./../../scripts/makeid";

const AccountInfo = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const connectWithMetamask = useMetamask();
  const [rcType, setRcType] = useState();
  const [showWC, setShowWC] = useState(true);

  const [savedUserAddress, setSavedUserAddress] = useState("");
  const [wcAddress, setWcAddress] = useState();
  const [cbAddress, setCbAddress] = useState();
  const address = useAddress();
  const disconnect = useDisconnect();
  const [metamaskDetected, setMetamaskDetected] = useState(false);
  const banner = userData?.userBanner || "/media/banner.jpg";
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [update, setUpdate] = useState(1);
  const [fileUrl, setFileUrl] = useState();
  //check if metamask is installed
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

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

  //refresh user data
  const refreshUserData = () => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  };

  //switch email notifications and alert
  const switchEmailNotifications = () => {
    if (userData?.emailNotifications === "ON") {
      set(
        dRef(db, "users/" + currentUser.user.uid + "/emailNotifications"),
        "OFF"
      ).then(() => {
        refreshUserData();
        alert("Email Notifications Have Been Disabled.");
      });
    } else
      set(
        dRef(db, "users/" + currentUser.user.uid + "/emailNotifications"),
        "ON"
      ).then(() => {
        refreshUserData();
        alert("Email Notifications Have Been Enabled.");
      });
  };

  //switch email address
  const [editEmail, setEditEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState();
  const auth = getAuth();
  const switchEmail = () => {
    updateEmail(auth.currentUser, tempEmail)
      .then(() => {
        set(
          dRef(db, "users/" + currentUser.user.uid + "/email"),
          tempEmail
        ).then(() => {
          refreshUserData();
          alert("Email Address has Been Updated.");
          setEditEmail(false);
        });
      })
      .catch((error) => {
        alert("Error Updating Email. Please try again or contact support.");
      });
  };

  //switch account name
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState();
  const switchName = () => {
    set(dRef(db, "users/" + currentUser.user.uid + "/name"), tempName).then(
      () => {
        refreshUserData();
        alert(`Name Updated. Welcome ${tempName}`);
        setEditName(false);
      }
    );
  };

  //switch wallet
  const [editWallet, setEditWallet] = useState(false);

  //logout user
  const infoLogout = async () => {
    disconnect();
    await logout();
    navigate("/");
    window.location.reload();
  };

  //logout user
  const inlineLogout = () => {
    logout();
    setCurrentUser(null);
    navigate("/");
    window.location.reload();
  };

  //upload files to Firebase Storage
  const uploadFile = async (file, folder) => {
    if (!file) return;
    const storageRef = sRef(
      storage,
      `/private/${currentUser.user.uid}/${folder}/${makeid(5)}-${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    // const response = await fetch(file.uri);
    // const blob = await response.blob();
    // var ref = storage().ref().child("colors");
    // ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("upload url: ", url);
          pushChange(url);
          setFileUrl(url);
        });
      }
    );
  };

  const pushChange = (url) => {
    set(dRef(db, "users/" + currentUser.user.uid + "/image"), url).then(
      setUpdate(update + 1)
    );
  };

  const handleChange = (file) => {
    setFile(file);
    uploadFile(file, "accountImages");
  };

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
      {userData && (
        <>
          <div className="user__page">
            {/* <div className="account__name">
          <p className="user__name">{currentUser.user.name}</p>
        </div>
        <div className="account__info">
          <p className="user__email">{currentUser.user.email}</p>
          <p className="logged__in__walletID">
            {truncateAddress(currentUser.user.photoURL)}
          </p>
        </div> */}
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
                  ></div>

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

                  <button
                    className="library__button user__info__button"
                    onClick={() => {
                      navigate("/my-account");
                    }}
                  >
                    View Library
                  </button>
                  {(userData?.userType === "artist" && (
                    <>
                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          navigate("/my-account/artist");
                        }}
                      >
                        Artist View{" "}
                      </button>
                      <button
                        className="library__button user__info__button"
                        onClick={() => {
                          navigate("/upload");
                        }}
                      >
                        Upload{" "}
                      </button>
                    </>
                  )) || (
                    <button
                      className="library__button user__info__button"
                      onClick={() => {
                        navigate("/apply");
                      }}
                    >
                      Artist Application
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
                <div className="contained__library settings__library">
                  <h3 className="library__heading">Your Settings</h3>
                  <div className="photo__setting__div">
                    <div className="user__setting__div thumbnail__setting__div">
                      <p className="user__setting__name">Thumbnail Image:</p>
                      <div
                        className="account__image__div thumbnail__preview"
                        style={{
                          backgroundImage: `url(${userData?.image})`,
                        }}
                      >
                        {" "}
                        <div className="picture__edit__hover">
                          <i className="fa-solid fa-pen picture__edit__icon" />
                        </div>
                      </div>
                    </div>
                    <div className="user__setting__div  cover__setting__div">
                      <p className="user__setting__name">Cover Image:</p>

                      <div
                        className="cover__preview"
                        style={{
                          backgroundImage: `url(${banner})`,
                        }}
                      >
                        <div className="picture__edit__hover">
                          <i className="fa-solid fa-pen picture__edit__icon" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="user__setting__div">
                    <p className="user__setting__name">Email:</p>

                    {(editEmail && (
                      <>
                        <input
                          className="info__email__input"
                          placeholder="New Email?"
                          onChange={(e) => {
                            setTempEmail(e.target.value);
                          }}
                        />
                        <button
                          onClick={() => {
                            switchEmail();
                          }}
                          className="login__button info__return__button change__button"
                        >
                          Update Email
                        </button>
                        <button
                          onClick={() => {
                            setEditEmail(false);
                          }}
                          className="login__button info__return__button info__back__button"
                        >
                          Cancel
                        </button>
                      </>
                    )) || (
                      <p
                        className="user__setting__data click__setting"
                        onClick={() => {
                          setEditEmail(true);
                        }}
                      >
                        {userData?.email}
                      </p>
                    )}
                  </div>
                  <div className="user__setting__div">
                    <p className="user__setting__name">Name:</p>
                    {(editName && (
                      <>
                        <input
                          className="info__email__input"
                          placeholder="New Name?"
                          onChange={(e) => {
                            setTempName(e.target.value);
                          }}
                        />
                        <button
                          onClick={() => {
                            switchName();
                          }}
                          className="login__button info__return__button change__button"
                        >
                          Update Name
                        </button>
                        <button
                          onClick={() => {
                            setEditName(false);
                          }}
                          className="login__button info__return__button info__back__button"
                        >
                          Cancel
                        </button>
                      </>
                    )) || (
                      <p
                        className="user__setting__data click__setting"
                        onClick={() => {
                          setEditName(true);
                        }}
                      >
                        {userData?.name}
                      </p>
                    )}
                  </div>

                  <div className="user__setting__div">
                    <p className="user__setting__name">Wallet Connection:</p>
                    <p className="user__setting__data">
                      {userData?.connectionType}
                    </p>
                  </div>
                  <div className="user__setting__div">
                    <p className="user__setting__name">Wallet Address:</p>
                    <p className="user__setting__data">
                      {truncateAddress(userData?.walletID)}
                    </p>
                  </div>
                  <div className="user__setting__div">
                    <p className="user__setting__name">Email Notifications:</p>
                    <p
                      className="user__setting__data click__setting"
                      onClick={() => switchEmailNotifications()}
                    >
                      {userData?.emailNotifications}
                    </p>
                  </div>
                  <div className="user__setting__div">
                    <p className="user__setting__name">Registration Date:</p>
                    <p className="user__setting__data">
                      {userData?.registrationDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AccountInfo;
