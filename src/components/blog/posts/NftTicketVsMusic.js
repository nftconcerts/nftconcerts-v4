import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const NftTicketVsMusic = () => {
  return (
    <BlogPost
      postTitle="NFT Tickets vs. NFT Music – Music, Entertainment, & NFTs"
      postDate="November 15, 2021"
      nextPost="/how-to-get-started-with-nfts"
      prevPost="/how-should-i-price-my-nft-release"
    >
      {" "}
      <Helmet>
        <title>NFT Tickets vs. NFT Music – Music, Entertainment, & NFTs</title>
        <meta
          name="description"
          content="NFT Tickets and NFT Music are both growing in popularity, but what is the difference? Which one should you bet on?"
        />
      </Helmet>
      <p>
        The music community is quickly engaging non-fungible tokens in new and
        creative ways. While certain artists are using NFTs as a lottery system
        to{" "}
        <a
          href="https://www.oneof.com/drops/2cb06f76-ed0b-448d-94b9-5876c22451a9/details"
          target="_blank"
          rel="noreferrer"
        >
          send some of their fans to space
        </a>
        , others are taking a more practical approach. NFT ticketing and NFT
        music are beginning to replace traditional music monetization methods
        and for good reason.
      </p>
      <h3 className="company__name">NFT Ticket</h3>
      <p>
        A NFT Ticket offers many practical benefits compared to traditional
        ticketing methods. By utilizing blockchain technology, every NFT ticket
        is easily verifiable both as legitimate and has a public transaction
        record indicating current ownership. Say goodbye to counterfeit tickets
        and enjoy a trustworthy secondary resale market.
      </p>
      <p>
        Additionally, having a non-fungible token attached to a ticket opens a
        world of possibilities. Artists can now create a fan club of ticket
        holders, send out exclusive content, and set rules around the secondary
        resale of their tickets to discourage scalpers.
      </p>
      <p>
        Live Nation has dipped their toes into NFT ticketing with the
        announcement of{" "}
        <a
          href="https://www.livenationentertainment.com/2021/10/live-nation-unveils-live-stubs-digital-collectible-nft-ticket-stubs-minting-first-ever-set-for-the-swedish-house-mafia-paradise-again-tour/"
          target="_blank"
          rel="noreferrer"
        >
          Live Stubs
        </a>
        . This is the entertainment giants first use of non-fungible tokens. The
        first Live Stubs will be issued for the Swedish House Mafia – Paradise
        Again Tour. While the NFT backed ‘Live Stub’ will be included for free
        with the ticket, it will not be used to access the event. Rather, it is
        simply a collector’s item that can be gifted or resold by the original
        ticket buyer. It is unclear how much additional value Live Nation
        intends to generate with these Live Stubs.
      </p>
      <p>
        The GET Protocol allows artist and event coordinators to create and
        issue their own NFT tickets. They recently passed{" "}
        <a
          href="https://cointelegraph.com/press-releases/a-one-in-a-million-nft-milestone-get-protocol-issues-its-millionth-on-chain-event-ticket"
          target="_blank"
          rel="noreferrer"
        >
          1,000,000 on chain tickets sold
        </a>
        . While the GET Protocol is popular, there are several NFT Ticketing
        companies competing for control of the market. While NFT tickets can be
        advertised as NFTs, they can also be dressed up as traditional digital
        tickets. You may have purchased a NFT ticket and not even known it.
      </p>
      <h3 className="company__name">NFT Music</h3>
      <p>
        NFT music is a new and exciting frontier in the NFT space. Music is an
        especially enticing NFT purchase as it has the potential to generate
        ongoing royalties. Artists are experimenting with selling their music
        royalties through a set of non-fungible tokens. The NFT King himself,
        3LAU is among the founders of the new platform Royal, which is setting
        out to be a leader in this space.
      </p>
      <p>
        Music royalties and NFTs have already generated headlines. Damon Dash
        tried to sell his partial ownership of Jay-Z’s Reasonable Doubt album
        via a NFT auction and quickly found himself on the receiving side of
        lawsuit. The auction was stopped before it was public.
      </p>
      <h3 className="company__name">Other Music NFT Options</h3>
      <p>
        Here at <a href="/">NFT Concerts</a>, we have developed our own NFT
        platform to enable artists to release concert recordings and studio
        performances through the issuance access tokens. These access tokens are
        not a one-off ticket. Instead, they guarantee the token owner lifetime
        access to stream the performance recording on-demand.
      </p>
      <p>
        Functioning in a similar ways to a limited run DVD, only the owner(s) of
        the access token(s) will be able to unlock and stream the recording.
        Sell the access token, lose access to the show. Enjoy a subscription
        free, ad-free user experience with superior streaming quality. Our
        platform allows artists to generate additional value from their live
        performances, create unique digital experiences, and monetize their art
        through exclusivity without having to give up ownership.
      </p>
      <p>
        If you are a musician or artist interested in transforming existing or
        future concerts into unique digital collectibles, fill out our{" "}
        <a href="/apply"> Artist Application</a>. We will work with you to
        determine the right NFT strategy to fit your goals. If you’re a fan
        looking to collect unique music experiences, stay up to date by joining
        our mailing list in the footer below.
      </p>
    </BlogPost>
  );
};

export default NftTicketVsMusic;
