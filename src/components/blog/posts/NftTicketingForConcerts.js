import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const NftTicketingForConcerts = () => {
  return (
    <BlogPost
      postTitle="NFT Ticketing for Concerts & Events"
      postDate="August 6, 2022"
      prevPost="/can-web3-end-two-factor-authentication"
      nextPost="/evolution-of-recorded-music"
    >
      <Helmet>
        <title>NFT Ticketing for Concerts & Events</title>
        <meta
          name="description"
          content="NFT Ticket for concerts and events could soon be a dominate player in the NFT market. Are NFT tickets too useful to deny?"
        />
      </Helmet>
      <p>
        Have you heard the news? NFT ticketing is about to go mainstream. There
        have been several developments in the NFT ticketing space over the past
        few months. Perhaps none is more important than the job listing by Live
        Nation seeking a full-time{" "}
        <a
          href="https://livenation.wd1.myworkdayjobs.com/en-US/LNExternalSite/job/West-Hollywood-CA-USA/Product-Manager--NFT-Ticketing-Integrations_JR-49707"
          target="_blank"
          rel="noreferrer"
        >
          product manager
        </a>{" "}
        focused on NFT ticketing.
      </p>
      <p>
        Live Nation/Ticketmaster is the single largest ticket seller in the
        entire world, selling over 500 million tickets every year. At the time
        of writing,{" "}
        <a href="https://www.get-protocol.io/" target="_blank" rel="noreferrer">
          GET Protocol
        </a>{" "}
        one of the leaders in blockchain ticketing has sold a total of 2.3
        million tickets. When it comes to blockchain ticketing, the potential is
        enormous. If Ticketmaster gets involved, it will explode.
      </p>
      <div className="post__image__div">
        <img
          src="https://merch.nftconcerts.com/wp-content/uploads/2022/08/Screen-Shot-2022-08-06-at-10.43.12-PM.png"
          className="post__image"
        />
        <p className="post__image__subtext">
          GET Protocol statistics and tickets can be viewed at{" "}
          <a
            href="https://explorer.get-protocol.io/"
            target="_blank"
            rel="noreferrer"
          >
            explorer.get-protocol.io
          </a>
        </p>
      </div>
      <p>
        As a fan, you may be wondering, “What are the benefits of a NFT ticket?”
        The first major win will be the end of counterfeit tickets. A NFT
        functions as a cryptographically secure certificate of authenticity. By
        using NFTs, each ticket can be easily verified as legitimate.
      </p>
      <p>
        Secondary sales will see a huge benefit from NFT tickets. If you’ve ever
        bought bad tickets from a scalper, you’ll love NFT Ticketing. With NFTs,
        all transactions are public knowledge. Everyone can track a NFT ticket
        right back to its source. In addition, artists can now track their
        tickets as they are sold in secondary markets. Artists can even set a
        secondary-sale fee to discourage scalping. With NFTs, all owners and
        transactions will be publicly viewable.
      </p>
      <p>
        Not only will the NFT ticket provide entrance to an event, but it can
        also provide a lifetime of value to both its holder and issuer. A NFT
        ticket, like all NFTs, can be used in a variety of manners. Artists can
        now turn their ticket buyers into an exclusive fan club. Owning a NFT
        ticket could get you a discount on future NFT tickets or unlock real
        world experiences. It could also open an entire digital experience.
      </p>
      <p>
        At <a href="/">NFT Concerts</a>, we are focused on that digital
        experience. Our mission is to turn concert recordings into digital
        collectibles using NFTs. Instead of releasing the recording to the
        public, we keep it private and create a set of NFTs that grant access.
        While Artists can only sell tickets locally, they can sell that same
        performance as a NFT Concert to their global fanbase. If you’re
        interested in NFTs, NFT tickets, and NFT Concerts be sure to sign up to
        our mailing list in the footer below.
      </p>
      <p className="post__call__to__action">
        If you want to be among the first users to see NFT Concerts, join the{" "}
        <a href="/production-team">Production Team</a>
      </p>
    </BlogPost>
  );
};

export default NftTicketingForConcerts;
