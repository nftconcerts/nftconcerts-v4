import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import "./Register.css";
import "./Login.css";

import { useNavigate } from "react-router-dom";
import {
  db,
  register,
  fetchCurrentUser,
  truncateAddress,
  logout,
} from "./../../firebase";
import { ref as dRef, set, onValue } from "firebase/database";
import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  useDisconnect,
  useCoinbaseWallet,
  useWalletConnect,
} from "@thirdweb-dev/react";
import dateFormat from "dateformat";
import emailjs from "@emailjs/browser";
import checkEns from "../../scripts/checkEns";
import { Magic } from "magic-sdk";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbase = useCoinbaseWallet();
  const disconnect = useDisconnect();
  const address = useAddress();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const [metamaskDetected, setMetamaskDetected] = useState(false);
  const [wcAddress, setWcAddress] = useState();
  const [cbAddress, setCbAddress] = useState();
  const [savedUserAddress, setSavedUserAddress] = useState("");
  const [rcType, setRcType] = useState();
  const [showWC, setShowWC] = useState(true);
  const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

  //check if there is a connected address
  useEffect(() => {
    if (address) {
      setSavedUserAddress(address);
      setShowWC(false);
      setRcType("metamask");
    }
  }, [address]);

  //check if metamask is installed
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

  //check if there is logged in user already
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //basic security checks before registering user.
  const checkThenRegister = async () => {
    var photoid = getRandomInt(4);
    var image =
      "https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Ff1.jpg?alt=media&token=91903ed9-82c3-47aa-ab2d-7b015c7a90a8";
    if (photoid === 1) {
      image =
        "https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Ff4.jpg?alt=media&token=bedd3ed8-6db9-4fac-9874-245c2ffff456";
    } else if (photoid === 2) {
      image =
        "https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fm1.jpg?alt=media&token=f536fd31-6fd0-478b-ba6e-34a25c47a917";
    } else if (photoid === 3) {
      image =
        "https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fm2.jpg?alt=media&token=7e54dc2f-b324-4761-bfea-b4d4ce45110e";
    }
    if (email === "") return alert("Missing email address");
    if (displayName === "") return alert("Missing Account Name");
    if (password === "") return alert("Missing Password");
    if (passwordConfirm === "") return alert("Missing Password Confirmation");
    if (!document.getElementById("acceptTerms").checked)
      return alert("Please accept the terms of service.");
    if (password === passwordConfirm) {
      var registrationDate = new Date();
      var dateString = dateFormat(registrationDate, "m/d/yyyy, h:MM TT Z ");
      setLoading(true);
      const newUser = await register(email, password, displayName, address);
      if (newUser) {
        var uid = newUser.user.uid;
        await delay(500);
        setCurrentUser(newUser);
        set(dRef(db, "users/" + uid), {
          name: displayName,
          email: email,
          registrationDate: dateString,
          walletID: savedUserAddress,
          userType: "fan",
          connectionType: rcType,
          emailNotifications: "ON",
          image: image,
        })
          .then(() => {
            alert(`Welcome ${displayName} to NFT Concerts`);
            sendEmail();
            sendWelcomeEmail();
            navigate("/");
          })
          .catch((error) => {
            console.log("error");
          });
      }
      setLoading(false);
    } else {
      alert("Passwords do not match");
    }
  };

  //send email to admin

  const sendEmail = () => {
    var registrationDate = new Date();
    var dateString = dateFormat(registrationDate, "m/d/yyyy, h:MM TT Z ");
    var template_params = {
      notification: "New User Registered",
      name: displayName,
      email: email,
      walletID: savedUserAddress,
      connectionType: rcType,
      rdDate: dateString,
    };
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        "template_admin_newuser",
        template_params,
        process.env.REACT_APP_EMAIL_USER_ID
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  //send email to user
  const sendWelcomeEmail = () => {
    var template_params = {
      name: displayName,
      email: email,
    };
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        "template_user_welcome",
        template_params,
        process.env.REACT_APP_EMAIL_USER_ID
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  //logout user
  const inlineLogout = async () => {
    await logout();
    setCurrentUser(null);
    window.location.reload();
  };

  //connect with metamask and update walletID
  const connectMetamask = async () => {
    try {
      let mm = await connectWithMetamask();
      const account = mm.data.account;
      console.log("MM", mm);
      updateWalletID(account, "metamask");
      setShowWC(false);
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  //connect with wc and update walletID
  const connectWalletConnect2 = async () => {
    try {
      let mm = await connectWithWalletConnect();
      const account = mm.data.account;
      console.log("MM", mm);
      updateWalletID(account, "walletconnect");
      setShowWC(false);
      setWcAddress(account);
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  //connect with wc and update walletID
  const connectCoinbase2 = async () => {
    try {
      let mm = await connectWithCoinbase();
      const account = mm.data.account;
      console.log("MM", mm);
      updateWalletID(account, "coinbase");
      setShowWC(false);
      setCbAddress(account);
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  const [walletlinkProvider, setWalletlinkProvider] = React.useState();

  //connect with magic.

  const [firstMagic, setFirstMagic] = useState(false);
  const tryMagic = async () => {
    try {
      var magicRes = await magic.auth.loginWithMagicLink({ email: email });
      const { publicAddress } = await magic.user.getMetadata();
      console.log("Account: ", publicAddress);
      setSavedUserAddress(publicAddress);
      setRcType("magic");
      setFirstMagic(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (rcType === "magic" && savedUserAddress !== "comingSoon") {
      checkThenRegister();
    }
  }, [rcType, savedUserAddress]);

  const [showCurrentAddress, setShowCurrentAddress] = useState(false);
  useEffect(() => {
    if (address) {
      setShowCurrentAddress(true);
    }
  }, [address, wcAddress]);

  const disconnectCoinbase = () => {
    walletlinkProvider.close();
    setWalletlinkProvider(null);
  };

  const updateWalletID = async (wallet, connectionType) => {
    setSavedUserAddress(wallet);
    setRcType(connectionType);
    setShowWC(false);
    var name = await checkEns(wallet);
    setDisplayName(name);
  };

  //
  useEffect(() => {
    if (userData?.walletID != null) {
      setSavedUserAddress(userData?.walletID);
    }
  }, [userData]);

  const [showEmailCheck, setShowEmailCheck] = useState(false);

  return (
    <FormBox>
      {currentUser && userData && (
        <div className="login__form">
          <div className="logged__in__already">
            <p>Currently Logged in as </p>
            <p className="logged__in__email">{currentUser?.user.displayName}</p>
            <p className="logged__in__email">{currentUser?.user.email}</p>
            <p className="logged__in__email">
              {truncateAddress(userData?.walletID)}
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
      {currentUser == null && !showWC && !showEmailCheck && (
        <div className="register__form connect__wallet__div">
          <h3 className="register__prompt__header">
            {rcType !== "managedWallet" && (
              <>
                Welcome {truncateAddress(savedUserAddress)} <br />
              </>
            )}
            Welcome, Register with your Email
          </h3>
          <input
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            type="email"
          />
          <input
            name="dispalyName"
            placeholder="Name"
            onChange={(e) => setDisplayName(e.target.value)}
            required={true}
            defaultValue={displayName}
          />
          <input
            name="password"
            placeholder="Password"
            required={true}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <input
            name="confirm__password"
            placeholder="Confirm Password"
            required={true}
            type="password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />{" "}
          <div className="checkbox__div">
            <input
              placeholder="I will not release this content somewhere else."
              type="checkbox"
              className="large__checkbox"
              required={true}
              id="acceptTerms"
            />
          </div>
          <h3 className="terms">
            {" "}
            I agree to the NFT Concerts <br />
            <a
              href="/terms-of-service"
              className="nftc__link2"
              target="_blank"
              rel="noopener noreferrer"
              required="required"
            >
              Terms of Service
            </a>
          </h3>
          {(rcType === "managedWallet" && (
            <input
              type="button"
              value="Register"
              className="register__button"
              onClick={tryMagic}
            />
          )) || (
            <input
              type="button"
              value="Register"
              className="register__button"
              onClick={checkThenRegister}
              disabled={false}
            />
          )}
          <div className="disconnect__button">
            {" "}
            {rcType === "metamask" && (
              <div
                onClick={() => {
                  setShowWC(true);
                  disconnect();
                  setDisplayName();
                }}
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "walletconnect" && (
              <div
                onClick={() => {
                  disconnect();
                  setWcAddress("");
                  setShowWC(true);
                  setDisplayName();
                }}
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "coinbase" && (
              <div
                onClick={() => {
                  disconnectCoinbase();
                  setCbAddress("");
                  setShowWC(true);
                  setDisplayName();
                }}
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "managedWallet" && (
              <div
                onClick={() => {
                  setShowWC(true);
                }}
              >
                Have a Wallet? Connect
              </div>
            )}
          </div>
        </div>
      )}

      {showWC && !currentUser && (
        <div className="connect__wallet__div">
          <div className="managed__wallet__div">
            <h3 className="connect__wallet__heading">New to NFTs?</h3>

            <input
              type="button"
              value="Create a  Wallet"
              className="register__button"
              onClick={() => {
                updateWalletID("comingSoon", "managedWallet");
              }}
            />
          </div>
          <p>Or..</p>
          <div className="connect__wallet__buttons__div">
            <h3 className="connect__wallet__heading">
              Connect Your Web3 Wallet
            </h3>

            <>
              {(address && (
                <input
                  type="button"
                  value="Disconnect"
                  className="register__button  disconnect__button"
                  onClick={disconnect}
                  disabled={false}
                />
              )) || (
                <>
                  {metamaskDetected && (
                    <input
                      type="button"
                      value="Connect to MetaMask"
                      className="register__button"
                      onClick={() => {
                        connectMetamask();
                      }}
                      disabled={wcAddress || cbAddress}
                    />
                  )}
                  {!metamaskDetected && (
                    <>
                      <input
                        type="button"
                        value="Download MetaMask"
                        className="register__button"
                        disabled={wcAddress || cbAddress}
                        onClick={() => {
                          window.open("https://metamask.io");
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </>

            {(!wcAddress && (
              <input
                type="button"
                value="Use Wallet Connect"
                className="register__button"
                onClick={connectWalletConnect2}
                disabled={address || cbAddress}
              />
            )) || (
              <input
                type="button"
                value="Disconnect Wallet Connect"
                className="register__button disconnect__button"
                onClick={() => {
                  disconnect();
                  setWcAddress("");
                }}
              />
            )}
            {(!cbAddress && (
              <input
                type="button"
                value="Use Coinbase Wallet"
                className="register__button"
                onClick={connectCoinbase2}
                disabled={address || wcAddress}
              />
            )) || (
              <input
                type="button"
                value="Disconnect Coinbase"
                className="register__button disconnect__button"
                onClick={() => {
                  disconnect();
                  setCbAddress("");
                }}
              />
            )}
          </div>
        </div>
      )}
      {showEmailCheck && (
        <>
          <h3>Please confirm your email address.</h3>
        </>
      )}
    </FormBox>
  );
}

export default Register;
