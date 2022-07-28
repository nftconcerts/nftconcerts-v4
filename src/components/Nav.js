import React, { useEffect, useState } from "react";
import "./Nav.css";
import { auth, logout, fetchCurrentUser } from "./../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [show, handleShow] = useState(false);
  const [menuPopup, handleMenuPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser());
  const navigate = useNavigate();

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

  const menuLogout = async () => {
    await logout();
    menuPop();
    navigate("/");
  };

  return (
    <div className="total_nav">
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

          {currentUser && (
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
        </div>
      )}
    </div>
  );
}

export default Nav;
