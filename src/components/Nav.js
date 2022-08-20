import React, { useEffect, useState } from "react";
import "./Nav.css";
import {
  auth,
  logout,
  fetchCurrentUser,
  setMobileMode,
  getMobileMode,
  resetMobileMode,
  truncateAddress,
} from "./../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { db } from "./../firebase";
import {
  useAddress,
  useNetwork,
  useNetworkMismatch,
  ChainId,
  useMetamask,
  useTokenBalance,
  ThirdwebProvider,
  useWalletConnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { GetUSDExchangeRate, GetMaticUSDExchangeRate } from "./api";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

const Nav = () => {
  const [show, handleShow] = useState(false);
  const [menuPopup, handleMenuPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser());
  const [userData, setUserData] = useState();
  const [adminUser, setAdminUser] = useState(false);
  const [artistUser, setArtistUser] = useState(false);
  const navigate = useNavigate();
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const [navMobileMode, setNavMobileMode] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const [ethBalance, setEthBalance] = useState("0.00");
  const [maticBalance, setMaticBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState();
  const [metamaskDetected, setMetamaskDetected] = useState(false);
  const [usdExRate, setUsdExRate] = useState();
  const [balanceInUSD, setBalanceInUSD] = useState("0.00");

  //eth to usd api call
  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

  //price formatting
  useEffect(() => {
    if (usdExRate && ethBalance) {
      var newPrice = ethBalance * usdExRate;

      let roundedPrice = newPrice.toFixed(2);

      setBalanceInUSD(roundedPrice);
    } else setBalanceInUSD("err");
  }, [usdExRate, ethBalance]);

  useEffect(() => {
    setNavMobileMode(getMobileMode());
  }, [networkMismatch]);

  const scrollClr = () => {};

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll", scrollClr);
    };
  }, []);

  const menuPop = () => {
    setCurrentUser(fetchCurrentUser());
    if (menuPopup) {
      handleMenuPopup(false);
    } else {
      handleMenuPopup(true);
    }
  };
  //get user data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, []);

  useEffect(() => {
    if (userData?.userType === "admin") {
      setAdminUser(true);
    } else if (userData?.userType === "artist") {
      setArtistUser(true);
    } else {
      setAdminUser(false);
      setArtistUser(false);
    }
  }, [currentUser, userData]);

  const menuLogout = async () => {
    await logout();
    menuPop();
    navigate("/");
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
    const onLoad = async () => {
      let walletAddress;
      if (address) {
        walletAddress = address;
      } else if (userData?.walletID) {
        walletAddress = userData?.walletID;
      }

      setWalletAddress(walletAddress);

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();

      let eth;
      eth = await signer.getBalance();
      eth = ethers.utils.formatEther(eth, 18);
      setEthBalance(eth);
    };
    if (address) {
      onLoad();
    }
  }, [address, userData, networkMismatch]);

  return (
    <div className="total_nav">
      {!navMobileMode && (
        <>
          {address && networkMismatch && (
            <div className="network__mismatch__div">
              <div className="network__mismatch__prompt">
                Wrong Network. Switch to Mainnet{" "}
                <div className="two__buttons__div">
                  <button
                    onClick={() => switchNetwork(ChainId.Mainnet)}
                    className="network__prompt__button"
                  >
                    Switch to Ethereum
                  </button>
                  <button
                    className="network__prompt__button network__prompt__button__right"
                    onClick={() => {
                      setMobileMode();
                      setNavMobileMode(true);
                      window.location.reload(false);
                    }}
                  >
                    Use in Mobile Mode
                  </button>
                </div>
              </div>
            </div>
          )}
          {address && !networkMismatch && (
            <div className="network__mismatch__div">
              <div className="network__mismatch__prompt wallet__balance__prompt">
                Welcome {userData?.name}{" "}
                {!userData && address && <>{truncateAddress(address)}</>}
                <div className="two__buttons__div">
                  <button
                    className="network__prompt__button network__prompt__button__right buy__matic__button full__width__button"
                    onClick={() => {
                      window.open(
                        `https://pay.sendwyre.com/purchase?&destCurrency=ETH&utm_medium=widget&paymentMethod=debit-card&autoRedirect=false&dest=matic%3A${address}&utm_source=checkout`
                      );
                    }}
                  >
                    <span>ETH: {ethBalance.substring(0, 6)} </span>
                    <span className="wallet__usd__bal">(${balanceInUSD})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {!address && metamaskDetected && (
            <div className="network__mismatch__div">
              <div className="network__mismatch__prompt">
                Not Connected to Web3.{" "}
                <div className="two__buttons__div">
                  <button
                    onClick={connectWithMetamask}
                    className="network__prompt__button "
                  >
                    Use MetaMask
                  </button>
                  <button
                    className="network__prompt__button network__prompt__button__right"
                    onClick={() => {
                      setMobileMode();
                      setNavMobileMode(true);
                      window.location.reload(false);
                    }}
                  >
                    Use in Mobile Mode
                  </button>
                </div>
              </div>
            </div>
          )}
          {!address && !metamaskDetected && (
            <div className="network__mismatch__div">
              <div className="network__mismatch__prompt">
                Google Chrome + Metamask Recommended.
                <div className="two__buttons__div">
                  <button
                    onClick={() => {
                      window.open("https://metamask.io/download/");
                    }}
                    className="network__prompt__button"
                  >
                    Download Metamask
                  </button>
                  <button
                    className="network__prompt__button network__prompt__button__right"
                    onClick={() => {
                      setMobileMode();
                      setNavMobileMode(true);
                      window.location.reload(false);
                    }}
                  >
                    Use in Mobile Mode
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!address && metamaskDetected && navMobileMode && (
        <div className="network__mismatch__div mobile__hide">
          <div className="network__mismatch__prompt">
            Mobile Mode Enabled.
            <div className="two__buttons__div">
              <button
                onClick={() => {
                  connectWithMetamask();
                }}
                className="network__prompt__button"
              >
                Use Metamask
              </button>
              <button
                className="network__prompt__button network__prompt__button__right"
                onClick={() => {
                  connectWithWalletConnect();
                }}
              >
                Use Wallet Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {navMobileMode && (
        <div className="network__mismatch__div nav__mobile__hide">
          <div className="network__mismatch__prompt">
            Moblie Mode Enabled{" "}
            <div className="two__buttons__div">
              <button
                onClick={() => {
                  resetMobileMode();
                  setNavMobileMode(false);
                  connectWithMetamask();
                  window.location.reload(false);
                }}
                className="network__prompt__button full__width__button"
              >
                Connect to Web3
              </button>
            </div>
          </div>
        </div>
      )} */}
      {address && currentUser && <div className="user__wallet"></div>}
      <div className={`nav ${show && "nav__black"}`}>
        <a href="/">
          <img
            className="nav__logo"
            src="https://nftconcerts.com/wp-content/uploads/2021/02/arc-logo-600x190-White-1.png"
            alt="NFT Concerts Logo"
          />
        </a>
        <div>
          <p className="prompt"> Connect to MetaMask on Polygon</p>
        </div>

        <img
          className="nav__avatar"
          src="https://nftconcerts.com/wp-content/uploads/2022/01/NFTC-Icon-2022-512x512-web.png"
          alt="NFT Concerts Icon"
          onClick={menuPop}
        />
      </div>
      {menuPopup && (
        <div className="menu__pop">
          {currentUser == null && (
            <>
              <a href="/register" className="menu__item" onClick={menuPop}>
                Register Now
              </a>
              <a href="/login" className="menu__item" onClick={menuPop}>
                Login
              </a>{" "}
              <a
                href="https://nftconcerts.com/about"
                className="menu__item"
                onClick={menuPop}
              >
                Learn More..
              </a>
            </>
          )}
          {currentUser && !artistUser && !adminUser && (
            <>
              {" "}
              <a href="#" className="menu__item" onClick={menuPop}>
                My Account
              </a>
              <a href="/" className="menu__item" onClick={menuPop}>
                Discover
              </a>
              <a href="#" className="menu__item" onClick={menuLogout}>
                Logout
              </a>
            </>
          )}
          {currentUser && artistUser && (
            <>
              {" "}
              <a href="/my-account" className="menu__item" onClick={menuPop}>
                My Account
              </a>
              <a href="/upload" className="menu__item" onClick={menuPop}>
                Upload
              </a>
              <a href="#" className="menu__item" onClick={menuLogout}>
                Logout
              </a>
            </>
          )}
          {currentUser && adminUser && (
            <>
              {" "}
              <a href="/my-account" className="menu__item" onClick={menuPop}>
                My Account
              </a>
              <a href="/admin" className="menu__item" onClick={menuPop}>
                Admin Panel
              </a>
              <a href="/upload" className="menu__item" onClick={menuPop}>
                Upload
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Nav;
