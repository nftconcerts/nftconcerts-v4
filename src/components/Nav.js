import React, { useEffect, useState } from "react";
import "./Nav.css";
import { logout, fetchCurrentUser } from "./../firebase";
import { useNavigate } from "react-router-dom";
import { ref as dRef, onValue } from "firebase/database";
import { db } from "./../firebase";
import { useDisconnect } from "@thirdweb-dev/react";

const Nav = () => {
  const [show, handleShow] = useState(false);
  const [menuPopup, handleMenuPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser());
  const [userData, setUserData] = useState();
  const [adminUser, setAdminUser] = useState(false);
  const [artistUser, setArtistUser] = useState(false);
  const navigate = useNavigate();
  const disconnect = useDisconnect();

  const scrollClr = () => {};

  //change background color on scroll
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

  //pop menu
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
  }, [currentUser]);

  //check if user is admin or artist
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

  //logout user from menu
  const menuLogout = async () => {
    disconnect();
    await logout();
    menuPop();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="total_nav">
      <div className={`nav ${show && "nav__black"}`}>
        <img
          className="nav__logo"
          src="/media/nftc-logo.png"
          alt="NFT Concerts Logo"
          onClick={() => {
            navigate("/");
          }}
        />

        <img
          className="nav__avatar"
          src={"/media/apple-touch-icon.png"}
          alt="NFT Concerts Icon"
          onClick={menuPop}
        />
      </div>
      {menuPopup && (
        <div className="menu__bkg" onClick={menuPop}>
          <div className="menu__pop" id="popped__menu">
            {currentUser == null && (
              <>
                <div
                  className="menu__item"
                  onClick={() => {
                    menuPop();
                    navigate("/register");
                  }}
                >
                  Register Now
                </div>
                <div
                  className="menu__item"
                  onClick={() => {
                    menuPop();
                    navigate("/login");
                  }}
                >
                  Login
                </div>{" "}
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
                <div
                  className="menu__item"
                  onClick={() => {
                    menuPop();
                    navigate("/my-account");
                  }}
                >
                  My Account
                </div>
                <div
                  className="menu__item"
                  onClick={() => {
                    menuPop();
                    navigate("/");
                  }}
                >
                  Discover
                </div>
                <div className="menu__item" onClick={menuLogout}>
                  Logout
                </div>
              </>
            )}
            {currentUser && artistUser && (
              <>
                {" "}
                <div
                  href="/my-account"
                  className="menu__item"
                  onClick={() => {
                    menuPop();
                    navigate("/my-account");
                  }}
                >
                  My Account
                </div>
                <div
                  className="menu__item"
                  onClick={() => {
                    menuPop();
                    navigate("/upload");
                  }}
                >
                  Upload
                </div>
                <div className="menu__item" onClick={menuLogout}>
                  Logout
                </div>
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
        </div>
      )}
    </div>
  );
};

export default Nav;
