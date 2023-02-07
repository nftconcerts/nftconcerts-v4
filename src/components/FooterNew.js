import React, { useState, useEffect } from "react";
import "./Footer.css";
import "./FooterNew.css";
import { useNavigate } from "react-router-dom";
import { logout, fetchCurrentUser } from "./../firebase";

import { useDisconnect } from "@thirdweb-dev/react";

const FooterNew = () => {
  let navigate = useNavigate();
  const disconnect = useDisconnect();
  const [currentUser, setCurrentUser] = useState();
  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  //logout user from menu
  const menuLogout = async () => {
    disconnect();
    await logout();

    navigate("/");
    window.location.reload();
  };

  return (
    <div className="footnew">
      <div className="footnew__container">
        <div className="footnew__content">
          <div className="top__half__newfoot">
            <div className="icon__column">
              <img
                src="/media/apple-touch-icon.png"
                alt="NFT Concerts Icon"
                className="footer__icon__img"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
            <div className="menu__column">
              <ul className="footer__menu__list">
                <li>
                  <a href="/market">Marketplace</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/production-team">Production Team</a>
                </li>

                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/faqs">FAQs</a>
                </li>
                <li>
                  <a href="/apply">Artist Application</a>
                </li>
              </ul>
            </div>
            <div className="menu__column">
              <ul className="footer__menu__list">
                {(currentUser && (
                  <>
                    <li>
                      <a href="/my-account">My Account</a>
                    </li>
                    <li>
                      <a href="/" onClick={menuLogout}>
                        Logout
                      </a>
                    </li>
                  </>
                )) || (
                  <>
                    <li>
                      <a href="/register">Register</a>
                    </li>
                    <li>
                      <a href="/login">Login</a>
                    </li>
                  </>
                )}

                <li>
                  <a href="/contact">Customer Support</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms-of-service">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="bottom__half__newfoot">
            <div className="socials__column">
              <p className="footer__email__p">
                Contact -{" "}
                <a
                  href="mailto:info@nftconcerts.com"
                  className="footer__email__btn"
                >
                  info@nftconcerts.com
                </a>
              </p>

              <div className=" new__footer__icons">
                <a
                  href="https://www.linkedin.com/company/nftconcerts/"
                  className="fa fa-linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts LinkedIn </span>
                </a>
                <a
                  href="https://twitter.com/nftconcerts"
                  className="fa fa-twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts Twitter </span>
                </a>
                <a
                  href="https://www.instagram.com/nftconcerts/"
                  className="fa fa-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts Instagram </span>
                </a>

                <a
                  href="https://www.facebook.com/nftconcerts"
                  className="fa fa-facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts Facebook </span>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCVCGwn8MowXYOUkAnJocx_A"
                  className="fa fa-youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts YouTube </span>
                </a>
                <a
                  href="https://www.reddit.com/user/nftconcerts"
                  className="fa fa-reddit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts Reddit</span>
                </a>
                <a
                  href="https://www.tiktok.com/@nftconcerts?"
                  className="fa fa-brands fa-tiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>NFT Concerts TikTok </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright__container">
        <div className="copyright__div">
          COPYRIGHT © 2023 NFT CONCERTS INC. ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
};

export default FooterNew;
