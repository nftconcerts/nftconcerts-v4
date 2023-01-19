import React from "react";
import { useEffect, useState } from "react";
import { ref as dRef, onValue, set, runTransaction } from "firebase/database";
import {
  db,
  fetchCurrentUser,
  login,
  truncateAddress,
  register,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import "./MintPopUp.css";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
  useActiveClaimCondition,
  useContract,
  useCoinbaseWallet,
  useWalletConnect,
} from "@thirdweb-dev/react";
import checkEns from "../scripts/checkEns";
import dateFormat from "dateformat";
import emailjs from "@emailjs/browser";
import { GetUSDExchangeRate } from "./api";
import { editionDropAddress } from "../scripts/getContract.mjs";
import { ethers } from "ethers";
import sendMintEmails from "../scripts/sendMintEmails";
import paperCheckout from "../scripts/paperCheckout";
import { Magic } from "magic-sdk";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const MintPopUp = ({
  currentUser,
  concertData,
  concertID,
  setShowMintPopUp,
  setCurrentUser,
}) => {
  let navigate = useNavigate();
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  const networkMistmatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [userData, setUserData] = useState();
  const [displayName, setDisplayName] = useState();
  const [savedUserAddress, setSavedUserAddress] = useState("");
  const [rcType, setRcType] = useState("");
  const [metamaskDetected, setMetamaskDetected] = useState(false);

  const [mintQty, setMintQty] = useState(1);
  const [newUser, setNewUser] = useState(false);
  const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithWalletConnect = useWalletConnect();

  //scroll to top to keep in view
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  //download User Data
  useEffect(() => {
    if (currentUser) {
      var userDataRef2 = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef2, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  //confirm user
  const confirmUser = async () => {
    await login(email, password);
    setCurrentUser(fetchCurrentUser());
    setNewUser(true);
  };

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

  const connectCoinbase2 = async () => {
    try {
      let cb = await connectWithCoinbaseWallet();
      const account = cb.data.account;
      updateWalletID(account, "coinbase");
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };

  const connectWalletConnect2 = async () => {
    try {
      let wc = await connectWithWalletConnect();
      const account = wc.data.account;
      updateWalletID(account, "walletconnect");
    } catch (ex) {
      console.log("Error: ", ex);
    }
  };
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
    if (rcType === "magic" && savedUserAddress !== "comingSoon" && firstMagic) {
      checkThenRegister();
      disconnect();
    }
  }, [rcType, savedUserAddress]);

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
            setCurrentUser(fetchCurrentUser());
            setShowRegister(false);
            sendEmail();
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
  const [showMaxLimit, setShowMaxLimit] = useState(false);
  const mintPlus = () => {
    if (mintQty < 5) {
      setMintQty(mintQty + 1);
    } else if (mintQty === 5) {
      setShowMaxLimit(true);
    }
  };
  const mintMinus = () => {
    setShowMaxLimit(false);
    if (mintQty > 1) {
      setMintQty(mintQty - 1);
    }
  };

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  //price formatting
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice)) {
      var newPrice = parseFloat(concertData?.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (concertData?.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

  const [showPurchased, setShowPurchased] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // Check if user owns the current NFT Concert
  const editionDropped = useContract(editionDropAddress);
  const [owned, setOwned] = useState(0);

  useEffect(() => {
    const checkIfOwned = async (userAddress) => {
      try {
        const balance = await editionDropped.balanceOf(userAddress, concertID);
        const balanceNum = parseInt(balance.toString());
        setOwned(balanceNum);
      } catch (err) {
        console.log("Fucked up check.");
      }
    };
    if (userData?.walletID) {
      checkIfOwned(userData?.walletID);
    }
  }, [userData?.walletID, editionDropped, concertID]);

  //mint the nft, transaction data

  const [claimError, setClaimError] = useState(false);
  const [tx, setTx] = useState();
  var transactionLink =
    "https://etherscan.io/tx/" + tx?.receipt.transactionHash;

  const [claiming, setClaiming] = useState("");
  const { contract } = useContract(editionDropAddress);
  let bigId = ethers.BigNumber.from(concertID);
  const { data: activeClaimCondition } = useActiveClaimCondition(
    contract,
    bigId
  );
  let mintPrice = mintQty * parseFloat(concertData?.concertPrice);
  //claim the nft
  const claimButton = async () => {
    setClaiming(true);
    setClaimError(false);
    try {
      var result = await contract?.claim(concertID, mintQty);
      setTx(result);
      setClaiming(false);
      setPurchased(true);
      setShowPurchased(true);
      setOwned(owned + 1);
      pushAudience(result);
      let currentEmail = userData.email;
      var template_params = {
        artistemail: concertData.uploaderEmail,
        artist: concertData.concertArtist,
        concertName: concertData.concertName,
        buyerName: userData.name,
        buyerEmail: currentEmail,
        mintQty: mintQty,
        mintPrice: mintPrice,
        remaining: activeClaimCondition?.availableSupply,
        concertSupply: concertData.concertSupply,
      };
      sendMintEmails(template_params);
    } catch (error) {
      console.log("Failed to claim. Error: ", error);
      console.log(error.message);
      setClaiming(false);
      setClaimError(true);
    }
  };

  //after transaction, get mint ID then push user to DB based on Mint Qty
  const pushAudience = (tx) => {
    console.log("push Aud with tx: ", tx?.receipt.transactionHash);
    console.log("tx: ", tx);
    var mintIdRef = dRef(db, "concerts/" + concertID + "/mintID");
    for (var i = 0; i < mintQty; i++) {
      runTransaction(mintIdRef, (mintID) => {
        if (mintID) {
          pushAudienceMember(mintID, tx?.receipt.transactionHash);
          mintID++;
        }
        return mintID;
      });
    }
  };

  //push audience member
  const pushAudienceMember = (mintID, tx) => {
    console.log("push AudM with id: ", mintID, " & tx: ", tx);
    var audienceRef = dRef(db, "concerts/" + concertID + "/sales/" + mintID);
    var mintDate = new Date();
    var mintDateString = dateFormat(mintDate, "mm/dd/yyyy, hh:MM:ss TT Z ");
    set(audienceRef, {
      buyerUID: currentUser.user.uid,
      tx: tx,
      date: mintDateString,
    });
  };

  //mint with credit card
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [paperSecret, setPaperSecret] = useState();

  const launchCredit = async () => {
    setShowCreditCard(true);
    setPaperSecret(
      await paperCheckout(
        concertID,
        userData?.walletID,
        userData?.email,
        mintQty
      )
    );
  };

  useEffect(() => {
    if (paperSecret) {
      setShowCreditCard(true);
      window.open(
        "https://checkout.nftconcerts.com/?s=" +
          paperSecret +
          "&cname=" +
          encodeURIComponent(
            concertData?.concertName + " by " + concertData?.concertArtist
          ) +
          "&price=" +
          mintPrice +
          "&img=" +
          encodeURIComponent(concertData?.concertTokenImage) +
          "&id=" +
          concertID +
          "$qty=" +
          mintQty
      );
    }
  }, [
    paperSecret,
    concertData?.concertName,
    concertData?.concertArtist,
    mintPrice,
    concertID,
    mintQty,
    concertData?.concertTokenImage,
  ]);

  //no user logged in - register or login to continue
  const noUserWelcomePage = () => {
    return (
      <>
        <h3 className="welcome__motto login__motto">
          Register or Login to Mint
        </h3>
        <div className="mp__login__buttons__div">
          <button
            onClick={() => {
              setShowRegister(true);
            }}
            className="buy__now my__button preview__button buy__now__button mintp__button mintp__register__button"
          >
            <div className="play__now__button__div">Register Now</div>
          </button>
          <button
            onClick={() => {
              setShowLogin(true);
            }}
            className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button"
          >
            <div className="play__now__button__div">Login</div>
          </button>
        </div>
        <p>
          On Mobile?{" "}
          <a
            href="https://metamask.app.link/dapp/nftconcerts.com"
            target="_blank"
            rel="noreferrer"
          >
            Open in MetaMask
          </a>
        </p>
      </>
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
        {(rcType === "managedWallet" && <></>) || (
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
    );
  };

  //enter email and password to login temp user
  const loginStart = () => {
    return (
      <>
        <div className="mint__pop__login__form">
          <form className="mint__pop__login__form__inner" id="login__form">
            <input
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
            <input
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </form>
          <button
            onClick={confirmUser}
            className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button"
          >
            <div className="play__now__button__div ">Log in</div>
          </button>
        </div>
        <div
          className="text__only__button"
          onClick={() => {
            setShowLogin(false);
          }}
        >
          New User? Register Now
        </div>
      </>
    );
  };

  //show completed purhcase info and invite to watch
  const purchasedInfo = () => {
    return (
      <>
        <div className="mint__pop__header">
          <>
            <div className="mint__pop__header__col1">
              <h3 className="purchased__pop__up__heading">
                Congratulations, you've successfully purchased <br />
              </h3>{" "}
              <h1 className="mint__pop__title">
                {concertData?.concertName} by {concertData.concertArtist}
              </h1>
              <img
                src={concertData?.concertTokenImage}
                className="mint__pop__img show__500"
                alt="NFT Concet Token"
              ></img>
            </div>
            <div className="mint__pop__header__col2">
              <img
                src={concertData?.concertTokenImage}
                className="mint__pop__img hide__500"
                alt="NFT Concet Token"
              ></img>
            </div>
          </>
        </div>
        <div className="mint__pop__purchased__div">
          <div className="price__pop__div">
            <h3>You Own the Show</h3>
          </div>
          <p className="motto">
            Out of{" "}
            <span className="bold__text">{concertData?.concertSupply}</span>{" "}
            Copies, You Own <span className="bold__text">{owned}</span>
          </p>
          <button
            className="buy__now my__button preview__button buy__now__button play__now__button mintp__button"
            onClick={() => {
              navigate("/player/" + concertID);
            }}
          >
            <div className="play__now__button__div">
              Play Now <i className="fa-solid fa-play play__now__icon " />
            </div>
          </button>

          {purchased && (
            <div className="tx__link__div">
              <a
                href={transactionLink}
                target="_blank"
                className="tx__link"
                rel="noreferrer"
              >
                View Your Receipt - TX:{" "}
                {(tx && (
                  <>{truncateAddress(tx?.receipt.transactionHash)}</>
                )) || <>{truncateAddress("101010101010101")}</>}
              </a>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="welcome__reveal__div">
        <div className="mint__welcome__pop__up__overlay__div">
          <div className="mint__purchased__pop__up__div">
            <div className="close__pop__up__div">
              <i
                onClick={() => {
                  setShowMintPopUp(false);
                  if (newUser) {
                    window.location.reload();
                  }
                }}
                className="fa-solid fa-xmark close__icon__button"
              />{" "}
            </div>
            {showPurchased && purchasedInfo()}

            {(showRegister && !showPurchased && (
              <div className="mint__pop__register__div">
                <h3 className="mint__pop__logo__title">Welcome to</h3>
                <img
                  src="/media/nftc-logo.png"
                  className="mint__pop__logo"
                  alt="nftc logo"
                />
                {(!address && !savedUserAddress && registerStart()) ||
                  registerInfo()}
              </div>
            )) || (
              <>
                {!showPurchased && (
                  <>
                    {" "}
                    <div className="mint__pop__header">
                      <>
                        <div className="mint__pop__header__col1">
                          <h1 className="minting__title">Minting</h1>
                          <img
                            src={concertData?.concertTokenImage}
                            className="mint__pop__img show__500"
                            alt="NFT Concet Token"
                          ></img>
                          <h1 className="mint__pop__title">
                            {concertData?.concertName} by{" "}
                            {concertData.concertArtist}
                          </h1>
                        </div>
                        <div className="mint__pop__header__col2">
                          <img
                            src={concertData?.concertTokenImage}
                            className="mint__pop__img hide__500"
                            alt="NFT Concet Token"
                          ></img>
                        </div>
                      </>
                    </div>
                    {(!showCreditCard && (
                      <div className="mint__pop__content">
                        {(!currentUser && (
                          <>
                            {(showLogin && <>{loginStart()}</>) ||
                              noUserWelcomePage()}
                          </>
                        )) || (
                          <>
                            {(claiming && (
                              <div className="pop__img__replacement">
                                <div className="row__center">
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                  <div className="wave"></div>
                                </div>
                              </div>
                            )) || (
                              <>
                                <div className="price__pop__div">
                                  Price:{" "}
                                  <img
                                    src="/media/eth-logo.png"
                                    height={30}
                                    className="c__eth__logo white__eth__logo"
                                    alt="eth logo"
                                  />
                                  <span className="price__pop__price__highlight">
                                    {mintQty *
                                      parseFloat(concertData?.concertPrice)}
                                  </span>{" "}
                                  <span className="mint__pop__usd__price">
                                    (${(priceInUSD * mintQty).toFixed(2)})
                                  </span>
                                </div>
                                <div className="quantity__pop__div">
                                  <div
                                    className="quantity__pop__button"
                                    onClick={mintMinus}
                                  >
                                    <i className="fa-solid fa-minus" />{" "}
                                  </div>
                                  <div>
                                    Quantity: {mintQty}{" "}
                                    {showMaxLimit && (
                                      <span className="max__limit">
                                        (Max 5)
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    className="quantity__pop__button"
                                    onClick={mintPlus}
                                  >
                                    <i className="fa-solid fa-plus" />{" "}
                                  </div>
                                </div>
                              </>
                            )}
                            {(userData?.connectionType !== "magic" && (
                              <>
                                <div className="mp__login__buttons__div">
                                  <button
                                    onClick={() => {
                                      launchCredit();
                                    }}
                                    className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button hide__500"
                                  >
                                    <div className="play__now__button__div">
                                      Mint with Credit Card
                                    </div>
                                  </button>
                                  {(networkMistmatch && (
                                    <button
                                      onClick={() =>
                                        switchNetwork(ChainId.Mainnet)
                                      }
                                      className="buy__now my__button preview__button buy__now__button  mintp__button"
                                    >
                                      <div className="play__now__button__div">
                                        Switch to Ethereum
                                      </div>
                                    </button>
                                  )) || (
                                    <>
                                      {(address && (
                                        <button
                                          onClick={claimButton}
                                          className="buy__now my__button preview__button buy__now__button mintp__button mintp__register__button "
                                        >
                                          <div className="play__now__button__div">
                                            Mint Now
                                          </div>
                                        </button>
                                      )) || (
                                        <>
                                          {userData?.connectionType ===
                                            "metamask" && (
                                            <button
                                              onClick={connectWithMetamask}
                                              className="buy__now my__button preview__button buy__now__button mint__pop__button metamask__pop__button mintp__button"
                                            >
                                              <div className="play__now__button__div">
                                                Connect to Metamask
                                              </div>
                                            </button>
                                          )}
                                          {userData?.connectionType ===
                                            "walletconnect" && (
                                            <button
                                              onClick={connectWithWalletConnect}
                                              className="buy__now my__button preview__button buy__now__button mint__pop__button walletconnect__pop__button mintp__button"
                                            >
                                              <div className="play__now__button__div">
                                                Connect to Wallet Connect
                                              </div>
                                            </button>
                                          )}
                                          {userData?.connectionType ===
                                            "coinbase" && (
                                            <button
                                              onClick={
                                                connectWithCoinbaseWallet
                                              }
                                              className="buy__now my__button preview__button buy__now__button mint__pop__button coinbase__pop__button mintp__button"
                                            >
                                              <div className="play__now__button__div">
                                                Connect to Coinbase
                                              </div>
                                            </button>
                                          )}
                                        </>
                                      )}
                                      <button
                                        onClick={() => {
                                          launchCredit();
                                        }}
                                        className="buy__now my__button preview__button buy__now__button welcome__login__button mintp__button show__500"
                                      >
                                        <div className="play__now__button__div">
                                          Mint with Credit Card
                                        </div>
                                      </button>
                                    </>
                                  )}
                                </div>
                                {claimError && (
                                  <>
                                    <p>
                                      Error with Mint. Please ensure sufficient
                                      ETH balance.
                                    </p>
                                    {userData?.connectionType ===
                                      "metamask" && (
                                      <p>
                                        To Mint on Mobile,{" "}
                                        <a
                                          href="https://metamask.app.link/dapp/nftconcerts.com"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Open in MetaMask
                                        </a>
                                      </p>
                                    )}
                                  </>
                                )}
                              </>
                            )) || (
                              <>
                                {" "}
                                <button
                                  onClick={() => {
                                    launchCredit();
                                  }}
                                  className="buy__now my__button preview__button buy__now__button mintp__button mintp__register__button "
                                >
                                  <div className="play__now__button__div">
                                    Mint Now
                                  </div>
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )) || (
                      <div className="credit__card__div">
                        {(paperSecret && (
                          <>
                            {" "}
                            <div className="credit__info__div">
                              <div className="price__pop__div credit__price">
                                Price:{" "}
                                <img
                                  src="/media/eth-logo.png"
                                  height={25}
                                  className="c__eth__logo"
                                  alt="eth logo"
                                />
                                {mintQty *
                                  parseFloat(concertData?.concertPrice)}{" "}
                                <span className="mint__pop__usd__price credit__usd__price">
                                  (${(priceInUSD * mintQty).toFixed(2)})
                                </span>{" "}
                                + Gas Fees{" "}
                                <span className="mint__pop__usd__price credit__usd__price">
                                  (TBD)
                                </span>
                              </div>
                              <a
                                href={
                                  "https://checkout.nftconcerts.com/?s=" +
                                  paperSecret +
                                  "&cname=" +
                                  encodeURIComponent(
                                    concertData?.concertName +
                                      " by " +
                                      concertData?.concertArtist
                                  ) +
                                  "&img=" +
                                  encodeURIComponent(
                                    concertData?.concertTokenImage
                                  ) +
                                  "&price=" +
                                  mintPrice +
                                  "&id=" +
                                  concertID +
                                  "&qty=" +
                                  mintQty
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <button className="buy__now my__button preview__button buy__now__button ">
                                  <div className="play__now__button__div">
                                    Checkout Now
                                  </div>
                                </button>
                              </a>
                            </div>
                          </>
                        )) || (
                          <>
                            <p className="credit__loading__p">
                              Checkout Loading...
                            </p>
                          </>
                        )}

                        <div
                          className="text__only__button"
                          onClick={() => {
                            setShowCreditCard(false);
                            setPaperSecret("");
                          }}
                        >
                          Go Back
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MintPopUp;
