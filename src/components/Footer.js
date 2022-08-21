import React, { useState, useEffect } from "react";
import "./Footer.css";
import { setMobileMode, getMobileMode, resetMobileMode } from "./../firebase";
function Footer() {
  const [fotMobileMode, setFotMobileMode] = useState(false);

  useEffect(() => {
    setFotMobileMode(getMobileMode());
  }, []);

  return (
    <div className="footer">
      <div className="footer__black__fade">
        {fotMobileMode && (
          <div className="cancel__mobile__div">
            <div
              className="cancel__mobile__button"
              onClick={() => {
                resetMobileMode();
                setFotMobileMode(false);
                window.location.reload();
              }}
            >
              Mobile Mode Enabled - Disable
            </div>
          </div>
        )}
      </div>
      <div className="bottom__footer">
        <div className="footer__hightlights">
          <div className="social__box">
            <h3 className="follow__us mobile__hide">Follow Us!</h3>
            <div className="social__icon__box">
              <a
                href="https://www.linkedin.com/company/nftconcerts/"
                className="fa fa-linkedin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>NFT Concerts LinkedIn </span>
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
                href="https://twitter.com/nftconcerts"
                className="fa fa-twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>NFT Concerts Twitter </span>
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
              <a
                href="https://news.google.com/publications/CAAqBwgKMN3kpAswoO-8Aw?hl=en-US&gl=US&ceid=US%3Aen"
                className="fa fa-google-plus-square"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>NFT Concerts Google News </span>
              </a>
            </div>
          </div>
          <div className="contact__box mobile__hide">
            <h3 className="contact__us">Contact Us:</h3>
            <a href="mailto:info@nftconcerts.com" className="contact__email">
              info@nftconcerts.com
            </a>
          </div>
        </div>
        <div className="footer_bot">
          <p className="copyright">
            COPYRIGHT © 2022 NFT CONCERTS INC.{" "}
            <br className="super__tiny__only" />
            ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
      <div className="under__footer__mobile">
        <div className="foot__thirds">
          <div className="footer__menu__right" dir="ltr">
            <a
              href="https://nftconcerts.com/about"
              className="my__button footer__menu__item"
            >
              About
            </a>

            <a href="/register" className="my__button footer__menu__item">
              Register
            </a>
          </div>
        </div>
        <div className="foot__thirds">
          <div className="footer__menu__right" dir="ltr">
            <a
              href="https://nftconcerts.com/blog"
              className="my__button footer__menu__item"
            >
              Blog
            </a>

            <a
              href="https://www.nftconcerts.com/merch"
              className="my__button footer__menu__item"
              target="_blank"
              rel="noopener noreferrer"
            >
              Merch
            </a>
          </div>
        </div>
        <div className="footer__thirds">
          <div className="footer__menu__right" dir="ltr">
            <a
              href="https://nftconcerts.com/faqs"
              className="my__button footer__menu__item"
            >
              FAQs
            </a>
            <a href="/apply" className="my__button footer__menu__item">
              Artist Application
            </a>
          </div>
        </div>
        <div className="footer__thirds">
          <div className="footer__menu__right" dir="ltr">
            <a href="/" className="my__button footer__menu__item">
              My Account
            </a>

            <a
              href="https://nftconcerts.com/contact"
              className="my__button footer__menu__item"
            >
              Customer Support
            </a>
          </div>
        </div>
        <div className="footer__thirds">
          <div className="footer__menu__right" dir="ltr">
            <a
              href="https://nftconcerts.com/privacy-policy"
              className="my__button footer__menu__item"
            >
              Privacy Policy
            </a>
            <a
              href="https://nftconcerts.com/terms-of-service"
              className="my__button footer__menu__item last_item"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <div className="under__footer">
        <div className="foot__thirds">
          <div className="footer__menu__right" dir="ltr">
            <a
              href="https://nftconcerts.com/about"
              className="my__button footer__menu__item"
            >
              About
            </a>

            <a href="/register" className="my__button footer__menu__item">
              Register
            </a>

            <a
              href="https://nftconcerts.com/blog"
              className="my__button footer__menu__item"
            >
              Blog
            </a>

            <a
              href="https://www.nftconcerts.com/merch"
              className="my__button footer__menu__item"
              target="_blank"
              rel="noopener noreferrer"
            >
              Merch
            </a>
            <a
              href="https://nftconcerts.com/privacy-policy"
              className="my__button footer__menu__item"
            >
              Privacy Policy
            </a>
          </div>
          <div className="footer__menu__right" dir="ltr">
            <a href="/apply" className="my__button footer__menu__item">
              Artist Application
            </a>

            <a href="/" className="my__button footer__menu__item">
              My Account
            </a>

            <a
              href="https://nftconcerts.com/faqs"
              className="my__button footer__menu__item"
            >
              FAQs
            </a>
            <a
              href="https://nftconcerts.com/contact"
              className="my__button footer__menu__item"
            >
              Customer Support
            </a>

            <a
              href="https://nftconcerts.com/terms-of-service"
              className="my__button footer__menu__item last_item"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
