import React from "react";
import Contract from "../form/Contract";
import "./TermsOfService.css";
import { truncateAddress } from "../../firebase";
import { Helmet } from "react-helmet";

const TermsOfService = () => {
  return (
    <Contract>
      <Helmet>
        <title>NFT Concerts Terms of Service</title>
        <meta
          name="description"
          content="The NFT Concerts Terms of Service lay out exactly what is expected of the Artist and the fan. Be sure to follow the rules!"
        />
      </Helmet>
      <div className="terms__div">
        <h1 className="terms__heading__text">Terms of Use</h1>

        <div className="terms__contract__div">
          <h3 className="terms__h3">Acceptance of Terms of Use</h3>
          <p>
            NFT Concerts Inc. (“COMPANY”) requires that all visitors (“you”) to
            the COMPANY website (<a href="/">www.nftconcerts.com</a>) (“Site”)
            abide by the following Terms of Use (“TOU”). By accessing and using
            the Site you indicate your agreement to these TOU.{" "}
            <span className="bold__text">
              IF YOU DO NOT AGREE TO THESE TOU, PLEASE DO NOT ACCESS OR USE THE
              SITE.
            </span>{" "}
            COMPANY reserves the right to modify these TOU at any time and in
            any manner, without prior notice.
          </p>

          <h3 className="terms__h3 terms__break underline">
            General Site Terms:
          </h3>
          <h3 className="terms__h3 terms__break">Rights</h3>
          <p>
            COMPANY owns this Site and COMPANY, or its content providers, own
            and/or retain the rights to all content, Web pages, source code,
            materials, data, information, text, screens, services, design,
            layout, screen interfaces, “look and feel”, logo or graphic images
            appearing herein, and the operation of this Site (collectively,
            “Materials”), which are protected by various intellectual property
            laws, including, but not limited to, copyrights, patents, trade
            secrets, trademarks, and service marks. Nothing in these TOU
            transfers any rights in the Materials to you or any third party and
            you acknowledge and agree that you do no not acquire any ownership
            rights by downloading or viewing any Materials.
          </p>
          <h3 className="terms__h3 terms__break">Use Limitation</h3>
          <h5 className="terms__h5 italics">No Unlawful or Prohibited Use</h5>
          <p>
            As a condition of your use of the Site, you acknowledge and agree
            that you will not use the Site for any purpose that is unlawful or
            otherwise prohibited by these TOU. You will not use the Site in any
            manner that could damage, disable, overburden, or impair the Site or
            any related service provider server, or the network(s) connected to
            the Site or any related service provider server, or interfere with
            any other party's use and enjoyment of the Site.
          </p>
          <h3 className="terms__h3 terms__break">Linking</h3>
          <p>
            A link to a linked website (“Linked Site”) on this Site does not
            mean that COMPANY endorses or accepts any responsibility for the
            content, functioning or use of such Linked Site, and you enter any
            such website at your own risk. You agree that COMPANY has no control
            over or liability for information on Linked Sites. You should be
            aware that Linked Sites may contain rules and regulations, privacy
            provisions, confidentiality provisions, and other provisions that
            are different from the provisions provided on this Site. COMPANY is
            not responsible for such provisions, and expressly disclaims any and
            all liability related to such provisions. COMPANY prohibits
            unauthorized hypertext links to this Site, or the framing of this
            Site
          </p>
          <h3 className="terms__h3 terms__break">
            Internet Risks; Disclaimer of Warranties
          </h3>
          <p>
            The COMPANY maintains commercially reasonable security features in
            connection with the Site, designed to minimize the risk of
            unauthorized access to any information you exchange with the Site;
            however, the COMPANY does not guarantee that third parties cannot
            gain access to information that you exchange with the Site. The
            COMPANY assumes no responsibility regarding any data,
            cryptocurrency, or non-fungible tokens that are intercepted or
            accessed by third parties during any of your interactions with the
            Site. THE SITE AND ALL OTHER INFORMATION OR SERVICES AVAILABLE ON
            THIS SITE, INCLUDING TEXT, IMAGES, AND LINKS, AND THE INFORMATION ON
            ANY LINKED SITE, WHETHER AFFILIATED OR UNAFFILIATED WITH COMPANY,
            WHICH YOU MAY VISIT THROUGH THIS SITE, ARE PROVIDED “AS IS,” “WHERE
            IS,” AND “AS AVAILABLE,” BY COMPANY, AS A CONVENIENCE TO ALL USERS
            WITHOUT REPRESENTATION OR WARRANTY OF ANY KIND INCLUDING, BUT NOT
            LIMITED TO, ANY EXPRESS OR IMPLIED WARRANTIES (I) OF MERCHANTABILITY
            OR FITNESS FOR A PARTICULAR PURPOSE; (II) OF INFORMATIONAL CONTENT
            OR ACCURACY; (III) OF NON-INFRINGEMENT; (IV) OF QUIET ENJOYMENT; (V)
            OF TITLE; (VI) THAT THIS SITE OR ANY SERVICES WILL OPERATE ERROR
            FREE, OR IN AN UNINTERRUPTED FASHION; (VII) THAT ANY DEFECTS OR
            ERRORS WILL BE CORRECTED; OR (VIII) THAT THIS SITE IS COMPATIBLE
            WITH ANY PARTICULAR HARDWARE OR SOFTWARE PLATFORM. EFFORTS BY
            COMPANY TO MODIFY THE SITE SHALL NOT BE DEEMED A WAIVER OF THESE
            LIMITATIONS. THE SITE COULD INCLUDE TECHNICAL INACCURACIES OR
            TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE
            INFORMATION HEREIN. COMPANY AND/OR ITS SERVICE PROVIDERS MAY MAKE
            CHANGES IN THE SITE AT ANY TIME AND FROM TIME TO TIME.
          </p>
          <h3 className="terms__h3 terms__break">Limitation of Liability</h3>
          <p>
            COMPANY SHALL NOT BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY LOSS
            OF PROFITS, LOSS OF USE, LOSS OF DATA, INTERRUPTION OF BUSINESS, OR
            ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES
            OF ANY KIND HOWSOEVER CAUSED, WHETHER ARISING UNDER THESE TOU, FROM
            USE OF THE SITE OR OTHERWISE, EVEN IF COMPANY WAS ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES OR WAS NEGLIGENT. THIS LIMITATION ON
            LIABILITY INCLUDES, BUT IS NOT LIMITED TO, THE TRANSMISSION OF ANY
            VIRUSES THAT MAY INFECT A USER'S EQUIPMENT, FAILURE OF MECHANICAL OR
            ELECTRONIC EQUIPMENT OR COMMUNICATION LINES, TELEPHONE OR OTHER
            INTERCONNECT PROBLEMS, UNAUTHORIZED ACCESS, THEFT, OPERATOR ERRORS,
            STRIKES OR OTHER LABOR PROBLEMS OR ANY FORCE MAJEURE EVENT. IN
            JURISDICTIONS THAT PROHIBIT THE EXCLUSION OR LIMITATION OF LIABILITY
            FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, COMPANY’S LIABILITY IS
            LIMITED TO THE GREATEST EXTENT PERMITTED BY THE LAW.
          </p>
          <h3 className="terms__h3 terms__break">Termination</h3>
          <p>
            COMPANY reserves the right to discontinue providing and/or to
            terminate your access to the Site or any portion thereof at any
            time.
          </p>
          <h3 className="terms__h3 terms__break">
            Governing Law and International Use
          </h3>
          <p>
            The Site is only directed to those in the United States; however it
            may be accessed from many different places around the world. By
            accessing the Site, you agree that the laws of Delaware apply to all
            matters related to your interaction with the Site. You further agree
            that exclusive jurisdiction for all disputes, claims or
            controversies relating to use of this Site shall be only in a
            federal or state court with competent jurisdiction in the State of
            California. You irrevocably consent to the exercise of personal
            jurisdiction by such courts in any such dispute, claim or
            controversy and irrevocably waive any objection on the ground of
            venue or the convenience of the forum. Any judgment entered in any
            such dispute, claim or controversy may be enforced in other
            jurisdictions in any manner provided by law. Those who choose to
            access this Site from other locations do so on their own initiative
            and are responsible for compliance with local laws.
          </p>
          <h3 className="terms__h3 terms__break">Feedback</h3>
          <p>
            To the extent permitted by applicable law, any comments or materials
            (“Feedback”) sent to COMPANY including questions, suggestions,
            ideas, comments, or the like relating to this Site shall be deemed
            to be non-confidential and shall become the property of COMPANY upon
            receipt. COMPANY shall have no obligation of any kind with respect
            to such Feedback and shall be free to transmit, reproduce, use,
            exhibit, disclose, display, transform, copyright, create derivative
            works, and distribute the Feedback to others without limitation.
            Further, COMPANY shall be free to use any ideas, concepts, know-how
            and techniques contained in such Feedback for any purpose
            whatsoever, including but not limited to, developing, manufacturing
            and marketing products or services incorporating such information.
          </p>
          <h3 className="terms__h3 terms__break">Miscellaneous</h3>
          <p>
            These TOU constitute the entire agreement between you and COMPANY
            and supersede all prior or contemporaneous communications, promises
            and proposals, whether oral, written or electronic, between you and
            COMPANY with respect to this Site. If any part of these TOU is
            determined to be invalid or unenforceable pursuant to applicable law
            including, but not limited to, the warranty disclaimers and
            liability limitations set forth above, then the invalid or
            unenforceable provision will be deemed superseded by a valid
            enforceable provision that most closely matches the intent of the
            original provision, and the remainder of these TOU shall continue in
            effect. A printed version of these TOU and of any notice given in
            electronic form shall be admissible in judicial or administrative
            proceedings based upon or relating to these TOU to the same extent
            and subject to the same conditions as other business documents and
            records originally generated and maintained in printed form. All
            rights not expressly granted herein are reserved.
          </p>
          <h3 className="terms__h3 terms__break underline">
            Fan/User/Artist/Content Owner Terms:
          </h3>
          <p>
            The Site provides access to create and purchase content that has
            been uploaded by an artist or other content owner and minted in the
            form of a non-fungible token representation of the related content
            (a “NFT Concert”). To upload content and create one or more NFT
            Concerts and/or to purchase any NFT Concerts, you will need to set
            up a user profile on the Site. User profiles require a unique email
            and password that you select. You are responsible for all use of
            your email and password and COMPANY is entitled to follow any
            instructions received through an access session with your email and
            password. User profiles on the Site will be associated with a
            digital wallet, either an existing wallet that you have (hosted by a
            third party), or (to the extent that we offer this service) a wallet
            that we establish for you through one or more third party wallet
            providers. In no event will COMPANY have access to any of the keys
            to your wallet and your wallet will be used only to facilitate
            purchases and/or sales you make through the Site.
          </p>
          <h3 className="terms__h3 terms__break ">For Fans/Users</h3>
          <p>
            By purchasing one of our NFT Concerts, you will receive access to an
            exclusive performance recording. While using our platform, you agree
            not to copy, download, stream, clip, post, torrent, or commercialize
            any NFT Concert recording in any manner. While you may show your NFT
            Concert recording to friends and family in the comfort of your own
            home, selling tickets or using the recording in a commercial or
            public setting is strictly forbidden. All NFT Concerts are for
            personal use only and a buyer may not derive revenue from a NFT
            Concert in any manner. Purchase prices for our NFT Concert offerings
            are disclosed on our Site. An individual NFT Concert will only be
            offered for sale one time with a known quantity of available NFTs.
            COMPANY will not issue additional NFTs for any individual NFT
            Concert beyond that stated quantity. Fans/users will pay a stated
            purchase price for any NFT Concert and associated gas fees. While
            users will have to pay gas fees, COMPANY has zero control over gas
            fee amounts. All gas fees are paid directly to Ethereum miners and
            do not pass through the Site.
          </p>
          <h3 className="terms__h3 terms__break">For Artists/Content Owners</h3>
          <p>
            All content that you provide for COMPANY to incorporate in any NFT
            Concerts must be original and owned by you and you represent and
            warrant that you have full and unrestricted rights to such content.
            When uploading your content to our platform, you assume all
            liability concerning any later claims brought by any party
            concerning content ownership. By uploading a performance recording
            to our platform, you are transferring exclusive use rights to
            COMPANY for that performance recording. Uploading that same piece of
            content to an alternative site is a violation of these TOU and may
            result in removal of your user account from the Site. Additionally,
            you are granting COMPANY an irrevocable, royalty-free,
            assignable/sublicensable, streaming license to all content that you
            upload, including all musical performances and any “promo clip”
            recordings. When uploading “promo clip” material, you agree that the
            foregoing license grants COMPANY the right to use content as “promo
            clip” material in our own marketing campaigns. We encourage all
            artists to share “promo clip” material on other sites to promote
            access to NFT Concerts created on the Site. COMPANY assumes no
            liability regarding any artist/content owner contract or venue
            disputes regarding the release of a concert recording as a NFT
            Concert. While COMPANY will take commercially reasonable steps to
            protect your content and keep it exclusive, please understand that
            people may steal and share this content from you. COMPANY will not
            be responsible for third party actions concerning unauthorized
            use/display of any NFT Concert that you create.{" "}
            <span className="italics">
              You agree that COMPANY will only stream concert recordings to
              fans/users of the Site who purchase one of our NFT Concerts, the
              original artist/content owner uploader, and for our internal
              review purposes. All artists/content owners that upload content
              agree to indemnify and hold COMPANY harmless from and against
              losses, costs, and damages (including attorney’s fees and court
              costs) arising out of and/or related to any breach of these TOU by
              such artist/content owner.
            </span>
          </p>
          <h3 className="terms__h3 terms__break">
            Mint Fees, Secondary Sale Fees, and Artist Payouts
          </h3>
          <p>
            COMPANY operates on a simple revenue split based on funds actually
            received by COMPANY in connection with a completed purchase and sale
            of any of our NFT Concerts. We take a 20% fee on minted NFT
            Concerts. Artists receive the remaining 80%. In addition, COMPANY
            sets a 5% secondary sale fee on all NFT Concerts in the collection.
            Artists have the option to attach an additional 5% secondary sale
            fee when creating any NFT Concerts through the Site. Please be aware
            that secondary sale fees on NFT Concert sales are not enforceable
            through some secondary marketplaces, so artist payouts for secondary
            sales will be made to the extent of actual funds received by
            COMPANY. Currently, artist payouts are processed manually. All NFT
            Concerts are part of the same collection and due to our current
            contract (
            <a
              href="https://etherscan.io/address/0x878d3f87c163951ef2923d09859aff45dc34a45a"
              target="_blank"
              rel="noreferrer"
            >
              available HERE
            </a>
            ) , all artist payouts are sent to the same artist pool. This
            account is generally distributed every Friday.{" "}
            <span className="italics">
              We intend to replace manual payouts with a smart contract in the
              future.
            </span>{" "}
            COMPANY will cover all gas fees for artists. From minting to
            receiving payouts, artists will enjoy a completely gas free
            experience. All COMPANY fees will come out of the stated mint price.
          </p>
          <h3 className="info__heading terms__break">For More Information</h3>
          <p>
            If you have any comments, concerns or questions regarding these TOU,
            please contact us at{" "}
            <a href="mailto:info@nftconcerts.com">info@nftconcerts.com</a> or
            visit our <a href="/contact">contact page</a> on the Site.
          </p>
          <p>Last updated on September 14, 2022.</p>
        </div>
      </div>
    </Contract>
  );
};

export default TermsOfService;
