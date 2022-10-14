import React, { useState, useEffect } from "react";
import Contract from "../form/Contract";
import Form from "../form/FormBox";
import { useNavigate } from "react-router-dom";
import { ref as dRef, onValue, set } from "firebase/database";
import {
  db,
  fetchCurrentUser,
  truncateAddress,
  logout,
} from "./../../firebase";
import "./AccountInfo.css";
import { updateProfile, updateEmail, getAuth } from "firebase/auth";
import {
  useMetamask,
  useMagic,
  useAddress,
  useDisconnect,
} from "@thirdweb-dev/react";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Web3Provider } from "@ethersproject/providers";
import WalletLink from "walletlink";

const AccountInfo = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const connectWithMetamask = useMetamask();
  const [rcType, setRcType] = useState();
  const [showWC, setShowWC] = useState(true);
  const connectWithMagic = useMagic();
  const [savedUserAddress, setSavedUserAddress] = useState("");
  const [wcAddress, setWcAddress] = useState();
  const [cbAddress, setCbAddress] = useState();
  const address = useAddress();
  const disconnect = useDisconnect();
  const [metamaskDetected, setMetamaskDetected] = useState(false);

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

  return (
    <>
      {userData && (
        <Form className="account__info__contract">
          {(!editWallet && (
            <>
              <h1 className="account__info__title">Welcome {userData?.name}</h1>

              <h3 className="account__info__welcome">
                Edit your account info below
              </h3>
              {editEmail && (
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
                    className="login__button info__return__button"
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
              )}
              {editName && (
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
                    className="login__button info__return__button"
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
              )}
              {!editEmail && !editName && (
                <>
                  <div className="info__row">
                    <>
                      <div className="info__row__header">Email: </div>
                      <div
                        className="info__row__content"
                        onClick={() => {
                          setEditEmail(true);
                        }}
                      >
                        <>{userData?.email}</>
                      </div>
                    </>
                  </div>
                  <div className="info__row">
                    <div className="info__row__header">Name:</div>
                    <div
                      className="info__row__content"
                      onClick={() => {
                        setEditName(true);
                      }}
                    >
                      {userData?.name}
                    </div>
                  </div>
                  <div className="info__row">
                    <div className="info__row__header">Wallet Connection: </div>
                    <div
                      className="info__row__content"
                      onClick={() => {
                        setEditWallet(true);
                      }}
                    >
                      {userData?.connectionType}
                    </div>
                  </div>
                  <div className="info__row">
                    <div className="info__row__header">Wallet: </div>
                    <div
                      className="info__row__content"
                      onClick={() => {
                        setEditWallet(true);
                      }}
                    >
                      {truncateAddress(userData?.walletID)}
                    </div>
                  </div>
                  <div className="info__row last__info__row">
                    <div className="info__row__header">
                      Emaiil Notifications:{" "}
                    </div>
                    <div
                      className="info__row__content"
                      onClick={() => switchEmailNotifications()}
                    >
                      {userData?.emailNotifications}
                    </div>
                  </div>{" "}
                  <button
                    onClick={() => {
                      navigate("/my-account");
                    }}
                    className="login__button info__return__button"
                  >
                    Back to My Account
                  </button>
                </>
              )}
            </>
          )) || (
            <div className="connect__wallet__div">
              <div className="connect__wallet__buttons__div">
                <div className="info__break" />
                <h3 className="connect__wallet__heading">
                  You account is tied to your wallet.
                </h3>
                <div className="info__break" />
                <div className="info__break" />
                <div className="info__break" />
                <h3>Logout & Create a New Account</h3>
                <div className="info__break" />
                <input
                  type="button"
                  value="Logout"
                  className="register__button  disconnect__button"
                  onClick={() => {
                    infoLogout();
                  }}
                  disabled={false}
                />
                <></>
              </div>
              <div className="info__break" />
              <div className="info__break" />
              <p>Or..</p>
              <div className="info__break" />
              <div className="info__break" />
              <div>
                {" "}
                <input
                  type="button"
                  value="Go Back"
                  className="register__button disconnect__button info__back__button"
                  onClick={() => {
                    setEditWallet(false);
                  }}
                />
              </div>
            </div>
          )}
        </Form>
      )}
    </>
  );
};

export default AccountInfo;
