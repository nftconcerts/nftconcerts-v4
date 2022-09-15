import React from "react";
import { useEffect } from "react";
import Contract from "../form/Contract";
import "./TermsOfService.css";

const PrivacyPolicy = () => {
  return (
    <Contract>
      <div className="terms__div">
        <h1 className="terms__heading__text">Privacy Policy</h1>
        <div className="terms__contract__div">
          <h3 className="terms__h3">Acceptance of Privacy Policy</h3>
          <p>
            This Privacy Policy applies to the website:{" "}
            <a href="/">www.nftconcerts.com </a>(the “Site”) and does not govern
            privacy practices associated with offline activities. These are the
            guidelines used by NFT Concerts Inc. (“COMPANY”) in protecting your
            privacy. The Site is only directed to those in the United States;
            however it may be accessed from many different places around the
            world. By accessing the Site, you agree that the laws of Delaware
            apply to all matters related to your interaction with the Site.
            COMPANY reserves the right to modify these terms at any time and in
            any manner, without prior notice.
          </p>
          <p>
            COMPANY respects your privacy and is committed to protecting the
            information you provide us through the Site. We do not sell or
            distribute user information to unaffiliated third parties, except as
            needed to provide services that you have requested. We may gather
            Site use information and distribute this information to affiliated
            companies in order to serve your needs and respond to your
            information requests.
          </p>
          <p>
            a. <span className="underline">User Information</span>. During your
            interaction with the Site, COMPANY may request information from you.
            The only information COMPANY will collect and store about you is
            information you decide to provide us. If you have voluntarily
            submitted user information to us through an email or contact form or
            any other information, COMPANY will only use such information for
            the purpose that it was provided or as otherwise permitted by law.
          </p>
          <p>
            b. <span className="underline">Other Information</span>. COMPANY may
            use server logs to record a visitor’s Internet Protocol (IP) address
            and to collect general information about the visit to the Site, such
            as the time and length of the visit, and the web pages accessed
            during the visit. COMPANY may use this information for Site
            management and performance monitoring only. COMPANY does not make
            this information available to unaffiliated third parties, but may
            share it with affiliated companies.
          </p>
          <p>
            c. <span className="underline">Cookies</span>. COMPANY may use
            cookies from time to time to allow COMPANY to tailor the Site to
            your preferences or interests, customize promotions or marketing or
            identify which areas of the Site are more popular. A cookie is a
            small, unique text file that a website can send to your computer
            hard drive when you visit that site. COMPANY does not make any
            cookie information available to unaffiliated third parties. Most web
            browsers can either alert you to the use of cookies or refuse to
            accept cookies entirely. If you do not want COMPANY to deploy
            cookies in your browser, you can set your browser to reject cookies
            or to notify you when a website tries to put a cookie on your
            computer. Rejecting cookies may affect your ability to use some of
            the services available on the Site.
          </p>
          <p>
            d. <span className="underline">Security</span>. To prevent
            unauthorized access to any user information, COMPANY has put in
            place commercially reasonable physical, electronic, and managerial
            procedures to safeguard and secure the information it collects
            through this Site. However, COMPANY cannot guarantee the security of
            such information.
          </p>
          <h3 className="info__heading terms__break">For More Information</h3>
          <p>
            If you have any comments, concerns or questions regarding these
            terms, please contact us at{" "}
            <a href="mailto:info@nftconcerts.com">info@nftconcerts.com</a> or
            visit our <a href="/contact">contact page</a> on the Site.
          </p>
          <p>Last updated on September 14, 2022.</p>
        </div>
      </div>
    </Contract>
  );
};

export default PrivacyPolicy;
