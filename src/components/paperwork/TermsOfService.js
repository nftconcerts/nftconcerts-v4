import React from "react";
import Contract from "../form/Contract";
import "./TermsOfService.css";
import { truncateAddress } from "../../firebase";

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
            you are transferring exclusive use rights to NFT Concerts for that
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
          <h3 className="terms__h3 terms__break">
            Mint Fees, Secondary Sale Fees, and Artist Payouts
          </h3>
          <p>
            NFT Concerts operates on a simple revenue split. NFT Concerts takes
            a 20% fee on minted NFTs. Artist recieve the remaining 80%. In
            addition, NFT Concerts sets a 5% secondary sale fee on all NFTs in
            the collection. Artists have the option to attach an additional 5%
            secondary sale fee. Please be aware that royalties on NFT sales are
            not enforceable through some secondary marketplaces.
          </p>
          <p>
            At this current momemnt artists payouts are processed manually. All
            NFT Concerts are part of the same collection and due to our current
            contract{" "}
            <a
              href="https://etherscan.io/address/0x878d3f87c163951ef2923d09859aff45dc34a45a"
              target="_blank"
            >
              ({truncateAddress("0x878d3f87c163951ef2923d09859aff45dc34a45a")})
            </a>{" "}
            , all artist payouts are sent to the same artist pool.{" "}
            <a
              href="https://etherscan.io/address/0x90ed6f1dFF7FBa69053e1A09a47f88A20feBE80e"
              target="_blank"
            >
              ({truncateAddress("0x90ed6f1dFF7FBa69053e1A09a47f88A20feBE80e")})
            </a>{" "}
            This account is distrubted fully every Friday.
          </p>
          <p className="italics">
            {" "}
            We intend to replace manual payouts with a smart contract but this
            is how it works currently.
          </p>
          <p>
            NFT Concerts will cover all gas fees for artists. From minting to
            recieving payouts, artists will enjoy a completely gas free
            experience.{" "}
          </p>
          <p>
            Users/Fans will never run into any surprise fees. All NFT Concerts
            fees will come out of the stated mint price. While users will have
            to pay gas fees to mint NFTs, NFT Concerts has zero control over gas
            prices. All gas fees are paid directly to Ethereum miners and do not
            pass through NFT Concerts accounts.{" "}
          </p>
          <p>
            If you have any questions about these terms, please get in touch for
            clarification.{" "}
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
