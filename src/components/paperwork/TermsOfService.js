import React from "react";
import Contract from "../form/Contract";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <Contract>
      <div className="terms__div">
        <h1 className="terms__heading__text">Terms of Service</h1>
        <p className="terms__disclaimer">
          Our lawyer is currently writing the official NFT Concerts Terms of
          Service.
          <br /> In the meantime, here's what we sent him in plain English.
        </p>
        <div className="terms__contract__div">
          <h3 className="terms__h3">For Fans/Users</h3>
          <p>
            By purchasing a NFT Concert, you will receive access to an exclusive
            performance recording. While using the NFT Concerts platform, you
            agree to not copy, download, stream, clip, post, torrent, or
            commercialize any NFT Concert recording in any manner. While you may
            show your NFT Concert recording to friends and family in the comfort
            of your own home, selling tickets or using the recording in a
            commercial setting is strictly forbidden.
          </p>
          <p>
            NFT Concerts will do our best to protect users and user data, but in
            the event that our systems our compromised we assume no liability
            regarding any data, cryptocurrency, or non-fungible tokens lost.{" "}
          </p>
          <h3 className="terms__h3 terms__break">For Artists/Content Owners</h3>
          <p>
            All content must be original and owned by you. When uploading to the
            NFT Concerts platform, you assume all liability around content
            ownership should it ever come into question.{" "}
          </p>
          <p>
            By uploading a performance recording to the NFT Concerts platform,
            you are transferring exclusive rights to NFT Concerts for that
            performance recording. Uploading that same piece of content to an
            alternative site would be in violation of these terms and result in
            removal of your account from the site.
          </p>
          <p>
            Additionally, you are granting NFT Concerts an irrevocable royalty
            free streaming license to all songs that may be performed in that
            performance recording and “promo clip”.{" "}
          </p>
          <p>
            When uploading “Promo Clip” material, you are granting NFT Concerts
            a full use license. NFT Concerts may use clips uploaded as “Promo
            Clip” material in our own marketing campaigns. We encourage artist
            to share their promo clip material on other sites as this is not
            exclusive content
          </p>
          <p>
            NFT Concerts assumes no liability regarding any personal contract or
            venue disputes regarding the release of a concert recording as a NFT
            Concert.
          </p>
          <p>
            While NFT Concerts will do our best to protect your content and keep
            it exclusive, please understand that people will steal and share
            this content. Additionally, while we do our best to ensure proper
            security measures, in the event of a hack NFT Concerts assumes no
            liability regarding any content, data, cryptocurrency, or
            non-fungible tokens lost.{" "}
          </p>
          <p className="italics">
            NFT Concerts maintains that we will only stream concert recordings
            to token holders, the original uploader, and for internal review.{" "}
          </p>
        </div>
        <p className="terms__disclaimer terms__break">
          Stay tuned for the official Terms of Service
        </p>
      </div>
    </Contract>
  );
};

export default TermsOfService;
