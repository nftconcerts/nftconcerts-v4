import React, { useEffect, useState } from "react";
import "./Nav.css";
import { auth, logout, fetchCurrentUser } from "./../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { db } from "./../firebase";
import {
  useAddress,
  useNetwork,
  useNetworkMismatch,
  ChainId,
} from "@thirdweb-dev/react";
const Nav = ({ mobileMode, setMobileMode }) => {
  console.log("mobileMode: ", mobileMode);
  const [show, handleShow] = useState(false);
  const [menuPopup, handleMenuPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser());
  const [userData, setUserData] = useState();
  const [adminUser, setAdminUser] = useState(false);
  const [artistUser, setArtistUser] = useState(false);
  const navigate = useNavigate();
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

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

  return (
    <div className="total_nav">
      {networkMismatch && !mobileMode && (
        <div className="network__mismatch__div">
          <div className="network__mismatch__prompt">
            Wrong Network. Switch to Polygon{" "}
            <div className="two__buttons__div">
              <button
                onClick={() => switchNetwork(ChainId.Mumbai)}
                className="network__prompt__button"
              >
                Switch to Polygon
              </button>
              <button
                onClick={() => setMobileMode(true)}
                className="network__prompt__button network__prompt__button__right"
              >
                Use in Mobile Mode
              </button>
            </div>
          </div>
        </div>
      )}
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
              <a href="/about" className="menu__item" onClick={menuPop}>
                Learn More..
              </a>
            </>
          )}
          {currentUser && !artistUser && !adminUser && (
            <>
              {" "}
              <a href="/my-account" className="menu__item" onClick={menuPop}>
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
              <a href="#" className="menu__item" onClick={menuLogout}>
                Logout
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Nav;
