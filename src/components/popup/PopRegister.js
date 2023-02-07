import React, { useState } from "react";
import dateFormat from "dateformat";
import {
  db,
  register,
  fetchCurrentUser,
  truncateAddress,
} from "../../firebase";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useCoinbaseWallet,
  useWalletConnect,
} from "@thirdweb-dev/react";
import { ref as dRef, set, get } from "firebase/database";
import emailjs from "@emailjs/browser";
import checkEns from "../../scripts/checkEns";
import { Magic, RPCError, RPCErrorCode } from "magic-sdk";
import { useEffect } from "react";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const PopRegister = ({
  setCurrentUser,
  setShowRegister,
  setNewUser,
  setShowLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState();
  const [savedUserAddress, setSavedUserAddress] = useState("");
  const [rcType, setRcType] = useState("");
  const disconnect = useDisconnect();
  const connectWithMetamask = useMetamask();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithWalletConnect = useWalletConnect();
  const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);
  const [metamaskDetected, setMetamaskDetected] = useState(false);
  const address = useAddress();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //check if metamask is installed
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
      if (address && !rcType) {
        setRcType("metamask");
      }
    }
  }, [address, rcType]);

  //update wallet & connection type for registration form
  const updateWalletID = async (wallet, connectionType) => {
    setSavedUserAddress(wallet);
    setRcType(connectionType);
    var name = await checkEns(wallet);
    setDisplayName(name);
  };

  //connect with metamask and update walletID
  const connectMetamask = async () => {
    try {
      let mm = await connectWithMetamask();
      const account = mm.data.account;
      updateWalletID(account, "metamask");
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  //connnect with Coinbase Wallet
  const connectCoinbase2 = async () => {
    try {
      let cb = await connectWithCoinbaseWallet();
      const account = cb.data.account;
      updateWalletID(account, "coinbase");
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  //connect with Wallet Connect
  const connectWalletConnect2 = async () => {
    try {
      let wc = await connectWithWalletConnect();
      const account = wc.data.account;
      updateWalletID(account, "walletconnect");
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  //check if user slug exists

  const checkSlug = async (slug) => {
    let slugExists;
    let checkSlugRef = dRef(db, "userSlugs/" + slug);
    let snapshot = await get(checkSlugRef);
    slugExists = snapshot.val();
    return slugExists;
  };

  //connect with magic.
  const [confirmMagic, setConfirmMagic] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState(false);
  const [magicError, setMagicError] = useState();
  const tryMagic = async () => {
    var nameString = displayName.toString();
    const spacereg = /\s/g;
    var newSlug = nameString.replace(spacereg, "-");
    const reg = /[^A-Za-z0-9-]/g;
    var cleanSlug = newSlug.replace(reg, "");
    cleanSlug = cleanSlug.toLowerCase();
    var slugExists = await checkSlug(cleanSlug);
    for (var i = 1; i < 10; i++) {
      var tempSlug;
      if (slugExists) {
        tempSlug = cleanSlug + i;
        slugExists = await checkSlug(tempSlug);
        if (!slugExists) {
          cleanSlug = tempSlug;
        }
        if (i == 9) {
          cleanSlug = cleanSlug + "1";
          i = 0;
        }
      } else {
        i = 10;
      }
    }
    console.log("Cleaned and unique slug: ", cleanSlug);
    if (email === "") return alert("Missing email address");
    if (displayName === "") return alert("Missing Account Name");
    if (password === "") return alert("Missing Password");
    if (passwordConfirm === "") return alert("Missing Password Confirmation");
    if (!document.getElementById("acceptTerms").checked)
      return alert("Please accept the terms of service.");
    if (password === passwordConfirm) {
      var registrationDate = new Date();
      var dateString = dateFormat(registrationDate, "m/d/yyyy, h:MM TT Z ");
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
      try {
        setConfirmMagic(true);
        await magic.auth.loginWithMagicLink({ email: email, showUI: false });
        const { publicAddress } = await magic.user.getMetadata();
        console.log("Account: ", publicAddress);
        setSavedUserAddress(publicAddress);
        setRcType("magic");
        setEmailConfirm(true);
        const newUser = await register(
          email,
          password,
          displayName,
          publicAddress
        );
        if (newUser) {
          var uid = newUser.user.uid;
          await delay(500);
          setCurrentUser(newUser);
          set(dRef(db, "users/" + uid), {
            name: displayName,
            email: email,
            registrationDate: dateString,
            walletID: publicAddress,
            userType: "fan",
            connectionType: "magic",
            emailNotifications: "ON",
            image: image,
            userSlug: cleanSlug,
          })
            .then(() => {
              set(dRef(db, "userSlugs/" + cleanSlug), uid);
              alert(`Welcome ${displayName} to NFT Concerts`);
              setCurrentUser(fetchCurrentUser());
              setShowRegister(false);
              sendEmail(publicAddress, "magic");
              sendWelcomeEmail();
              setNewUser(true);
            })
            .catch((error) => {
              console.log("error");
            });
        }
      } catch (err) {
        if (err instanceof RPCError) {
          switch (err.code) {
            case RPCErrorCode.MagicLinkFailedVerification:
              setMagicError("Verification Failed, Please Try Again.");
            case RPCErrorCode.MagicLinkExpired:
              setMagicError("Verification Expired, Please Try Again.");
            case RPCErrorCode.MagicLinkRateLimited:
              setMagicError(
                "Too Many Requests. Please wait a moment before trying again."
              );
            case RPCErrorCode.UserAlreadyLoggedIn:
              setMagicError(
                "User Error - Already Logged In. Try Refreshing Your Browser."
              );
              // Handle errors accordingly :)
              break;
          }
        }
      }
    } else {
      alert("Passwords do not match.");
    }
  };

  //basic security checks before registering user.
  const checkThenRegister = async () => {
    var nameString = displayName.toString();
    const spacereg = /\s/g;
    var newSlug = nameString.replace(spacereg, "-");
    const reg = /[^A-Za-z0-9-]/g;
    var cleanSlug = newSlug.replace(reg, "");
    cleanSlug = cleanSlug.toLowerCase();
    var slugExists = await checkSlug(cleanSlug);
    for (var i = 1; i < 10; i++) {
      var tempSlug;
      if (slugExists) {
        tempSlug = cleanSlug + i;
        slugExists = await checkSlug(tempSlug);
        if (!slugExists) {
          cleanSlug = tempSlug;
        }
        if (i == 9) {
          cleanSlug = cleanSlug + "1";
          i = 0;
        }
      } else {
        i = 10;
      }
    }
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
    if (!document.getElementById("acceptTerms")?.checked)
      return alert("Please accept the terms of service.");
    if (password === passwordConfirm) {
      var registrationDate = new Date();
      var dateString = dateFormat(registrationDate, "m/d/yyyy, h:MM TT Z ");
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
            set(dRef(db, "userSlugs/" + cleanSlug), uid);
            alert(`Welcome ${displayName} to NFT Concerts`);

            setCurrentUser(fetchCurrentUser());
            setShowRegister(false);
            sendEmail(savedUserAddress, rcType);
            sendWelcomeEmail();
            setNewUser(true);
          })
          .catch((error) => {
            console.log("error");
          });
      }
    } else {
      alert("Passwords do not match");
    }
  };

  //send email to admin
  const sendEmail = (wallet, connectionType) => {
    var registrationDate = new Date();
    var dateString = dateFormat(registrationDate, "m/d/yyyy, h:MM TT Z ");
    var template_params = {
      notification: "New User Registered",
      name: displayName,
      email: email,
      walletID: wallet,
      connectionType: connectionType,
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

  //being the registration process by connecting to a wallet
  const registerStart = () => {
    return (
      <>
        <div>
          <h3 className="mint__pop__subtitle">New to NFTs?</h3>
          <button
            onClick={() => {
              updateWalletID("comingSoon", "managedWallet");
            }}
            className="buy__now my__button preview__button buy__now__button mintp__button"
          >
            <div className="play__now__button__div">Create a Wallet</div>
          </button>
        </div>
        <div className="or__div"> Or..</div>
        <div className="wallet__options__div">
          {(metamaskDetected && (
            <button
              onClick={() => {
                connectMetamask();
              }}
              className="buy__now my__button preview__button buy__now__button mint__pop__button metamask__pop__button mintp__button"
            >
              <div className="play__now__button__div">Connect to MetaMask</div>
            </button>
          )) || (
            <button
              onClick={() => {
                window.open("https://metamask.io/");
              }}
              className="buy__now my__button preview__button buy__now__button mint__pop__button metamask__pop__button mintp__button"
            >
              <div className="play__now__button__div">Download MetaMask</div>
            </button>
          )}
          <button
            onClick={connectWalletConnect2}
            className="buy__now my__button preview__button buy__now__button  mint__pop__button walletconnect__pop__button mintp__button"
          >
            <div className="play__now__button__div">Use Wallet Connect</div>
          </button>
          <button
            onClick={connectCoinbase2}
            className="buy__now my__button preview__button buy__now__button  mint__pop__button coinbase__pop__button mintp__button"
          >
            <div className="connect__wallet__button__div">
              Use Coinbase Wallet
            </div>
          </button>
          <div
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
            className="text__only__button"
          >
            Have an account? Login{" "}
          </div>
        </div>
      </>
    );
  };

  //input email + name + password to compelete registration
  const registerInfo = () => {
    return (
      <>
        {(!confirmMagic && (
          <>
            {rcType !== "managedWallet" && (
              <h3 className="mint__pop__subtitle register__subtitle">
                Welcome {truncateAddress(savedUserAddress)}
              </h3>
            )}
            <p>Please Complete Your Registration</p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="mint__pop__input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="mint__pop__input"
              defaultValue={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="mint__pop__input"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="password"
              name="confirm password"
              placeholder="Confirm Password"
              className="mint__pop__input"
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
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
                className="terms__mp__link"
                target="_blank"
                rel="noopener noreferrer"
                required="required"
              >
                Terms of Service
              </a>
            </h3>
            {(rcType === "managedWallet" && (
              <button
                onClick={tryMagic}
                className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button"
              >
                <div className="play__now__button__div ">Register</div>
              </button>
            )) || (
              <button
                onClick={checkThenRegister}
                className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button"
              >
                <div className="play__now__button__div ">Register</div>
              </button>
            )}

            {rcType === "metamask" && (
              <div
                onClick={() => {
                  disconnect();
                  setSavedUserAddress("");
                }}
                className="text__only__button pop__disconnect__button"
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "" && (
              <div
                onClick={() => {
                  setSavedUserAddress();
                  disconnect();
                  setDisplayName();
                }}
                className="text__only__button pop__disconnect__button"
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "walletconnect" && (
              <div
                onClick={() => {
                  disconnect();
                  setSavedUserAddress();
                  setDisplayName();
                }}
                className="text__only__button pop__disconnect__button"
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "coinbase" && (
              <div
                onClick={() => {
                  disconnect();
                  setSavedUserAddress();
                  setDisplayName();
                }}
                className="text__only__button pop__disconnect__button"
              >
                Wrong Account? Disconnect
              </div>
            )}
            {rcType === "managedWallet" && (
              <div
                onClick={() => {
                  setSavedUserAddress();
                  setDisplayName();
                }}
                className="text__only__button pop__disconnect__button"
              >
                Have a Wallet? Connect
              </div>
            )}
          </>
        )) || (
          <>
            {(emailConfirm && (
              <div className="magic__confirm__div">
                <i className="fa-solid fa-circle-check magic__icon confirm__magic__icon" />
                <h3 className="magic__confirm__title">Email Confirmed</h3>
                <p>You should be registered in a few seconds.</p>
                <p> Welcome to NFT Concerts!</p>
                <button
                  className="text__only__button"
                  onClick={() => {
                    setNewUser(true);
                    setShowRegister(false);
                  }}
                >
                  Nothing Happening? Click Here
                </button>
              </div>
            )) || (
              <div className="magic__confirm__div">
                <i className="fa-solid fa-rectangle-xmark magic__icon" />
                <h3 className="magic__confirm__title">Do Not Close This Tab</h3>
                <p>
                  Please Confrim Your Email Address and return to this page.
                </p>
                <p>
                  {" "}
                  We have emailed you a link to{" "}
                  <span className="bold__text">{email}</span>
                </p>
                <button
                  className="text__only__button"
                  onClick={() => {
                    disconnect();
                    setConfirmMagic(false);
                  }}
                >
                  Wrong Email? Go Back
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>{(!address && !savedUserAddress && registerStart()) || registerInfo()}</>
  );
};

export default PopRegister;
