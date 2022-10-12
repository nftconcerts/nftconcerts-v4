import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import "./Register.css";
import "./Login.css";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  db,
  register,
  fetchCurrentUser,
  truncateAddress,
  logout,
} from "./../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref as dRef, set, update, onValue } from "firebase/database";
import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
  useDisconnect,
} from "@thirdweb-dev/react";
import dateFormat from "dateformat";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import WalletLink from "walletlink";
import emailjs from "@emailjs/browser";
import checkEns from "../../scripts/checkEns";
import { CreateWallet } from "@paperxyz/react-client-sdk";
import { useMagic } from "@thirdweb-dev/react";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const dbRef = dRef(db);

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const connectWithMetamask = useMetamask();
  const connectWithMagic = useMagic();
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

  //basic security checks before registering user.
  const checkThenRegister = async () => {
    if (email == "") return alert("Missing email address");
    if (displayName == "") return alert("Missing Account Name");
    if (password == "") return alert("Missing Password");
    if (passwordConfirm == "") return alert("Missing Password Confirmation");
    if (!document.getElementById("acceptTerms").checked)
      return alert("Please accept the terms of service.");
    if (password == passwordConfirm) {
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

  //wallet connenct variables
  const [web3Library, setWeb3Library] = React.useState();
  const [web3Account, setWeb3Account] = React.useState();
  const [walletlinkProvider, setWalletlinkProvider] = React.useState();
  const [walletConnectProvider, setWalletConnectProvider] = React.useState();

  //connect with magic.

  const [whileMagic, setWhileMagic] = useState(false);
  const tryMagic = async () => {
    setWhileMagic(false);
    try {
      var magicRes = await connectWithMagic({ email });
      var accountNum = magicRes.data.account;
      console.log(magicRes);
      console.log("Account: ", accountNum);
      setSavedUserAddress(accountNum);
      setRcType("magic");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (rcType === "magic" && savedUserAddress !== "comingSoon") {
      checkThenRegister();
    }
  }, [rcType, savedUserAddress]);

  //vanilla walletconnect
  const connectWalletConnect = async () => {
    try {
      const RPC_URLS = {
        1: "https://mainnet.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4",
      };
      const provider = new WalletConnectProvider({
        rpc: {
          1: RPC_URLS[1],
        },
        qrcode: true,
        pollingInterval: 15000,
      });
      setWalletConnectProvider(provider);
      const accounts = await provider.enable();
      const account = accounts[0];

      const library = new Web3Provider(provider, "any");

      setWeb3Library(library);
      setWeb3Account(account);
      setWcAddress(account);
      setShowWC(false);
      updateWalletID(account, "walletconnect");
    } catch (ex) {
      console.log(ex);
    }
  };
  const disconnectWalletConnect = () => {
    walletConnectProvider.disconnect();
    setWalletConnectProvider(null);
  };
  const [showCurrentAddress, setShowCurrentAddress] = useState(false);
  useEffect(() => {
    if (address) {
      setShowCurrentAddress(true);
    }
  }, [address, wcAddress]);

  //vanilla coinbase
  const connectCoinbase = async () => {
    try {
      // Initialize WalletLink
      const walletLink = new WalletLink({
        appName: "NFT Concerts",
        darkMode: true,
      });

      const provider = walletLink.makeWeb3Provider(
        "https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4",
        4
      );
      setWalletlinkProvider(provider);
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      const library = new Web3Provider(provider, "any");

      setWeb3Library(library);
      setWeb3Account(account);
      setCbAddress(account);
      setShowWC(false);
      updateWalletID(account, "coinbase");
    } catch (ex) {
      console.log(ex);
    }
  };
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
            Plese Complete Your Registration
          </h3>
          <label>Email</label>
          <input
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            type="email"
          />
          <label>Username</label>
          <input
            name="dispalyName"
            placeholder="Name"
            onChange={(e) => setDisplayName(e.target.value)}
            required={true}
            defaultValue={displayName}
          />
          <label>Password</label>
          <input
            name="password"
            placeholder="Password"
            required={true}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <label>Confirm Password</label>
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
              disabled={whileMagic}
              onClick={() => {
                tryMagic();
              }}
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
                  disconnectWalletConnect();
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
                onClick={connectWalletConnect}
                disabled={address || cbAddress}
              />
            )) || (
              <input
                type="button"
                value="Disconnect Wallet Connect"
                className="register__button disconnect__button"
                onClick={() => {
                  disconnectWalletConnect();
                  setWcAddress("");
                }}
              />
            )}
            {(!cbAddress && (
              <input
                type="button"
                value="Use Coinbase Wallet"
                className="register__button"
                onClick={connectCoinbase}
                disabled={address || wcAddress}
              />
            )) || (
              <input
                type="button"
                value="Disconnect Coinbase"
                className="register__button disconnect__button"
                onClick={() => {
                  disconnectCoinbase();
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
