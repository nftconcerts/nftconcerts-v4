import React from "react";
import BlogPost from "./BlogPost";

const CoachellaNfts = () => {
  return (
    <BlogPost
      postTitle="What Coachella NFTs Say About the Future of Music"
      postDate="February 3, 2022"
      nextPost="/nfts-are-coming-to-a-live-event-near-you"
      prevPost="/nfts-are-not-just-pictures"
    >
      <p>
        NFTs have officially gone mainstream in the music industry. While we
        have yet to see mass adoption when it comes to music distribution;
        artists, record labels, and music festivals are continuing to enter the
        NFT space. Everyone wants in, and the possibilities and implementations
        currently being developed are fascinating. Just two days ago, Coachella
        announced that they are jumping headfirst into the NFT game.
      </p>
      <p>
        Coachella is launching their own{" "}
        <a href="https://nft.coachella.com/" target="_blank" rel="noreferrer">
          NFT marketplace
        </a>{" "}
        designed by FTX US. Coachella has three distinct initial offerings. An
        affordable 10,000-piece photo collection where the NFT owner can claim a
        physical print. A mid-tier 1,000-piece collection of Coachella inspired
        artwork. And the final,{" "}
        <a
          href="https://nft.coachella.com/marketplace"
          target="_blank"
          rel="noreferrer"
        >
          10-piece Coachella Keys Collection
        </a>{" "}
        – granting their owners lifetime access to the Coachella Music Festival.{" "}
      </p>
      <p>
        The 10 NFTs that are a part of the Coachella Keys Collection will be
        auctioned off starting February 4th. Buyers should be aware; they only
        get access to a single weekend per year. Personally, I believe they
        should get access to both weekends as there is no better feeling than
        heading back to Coachella for weekend 2.
      </p>
      <div className="post__image__div">
        <img
          src="https://merch.nftconcerts.com/wp-content/uploads/2022/02/Coachella-from-a-distance-scaled.jpg"
          className="post__image"
        />
        <p className="post__image__subtext">
          I’ve taken over 4,000 photographs at Coachella yet this is the only
          one I feel comfortable posting here… Please don’t sue. (
          <a
            href="https://jdendrinos.com/photography/events/coachella/"
            target="_blank"
            rel="noreferrer"
          >
            Full Gallery
          </a>
          )
        </p>
      </div>
      <p>
        While Coachella has the necessary resources to develop their own NFT
        marketplace and unique drops, not every artist or event will have the
        technical knowledge, skills, or time to build their own NFT platform. At
        <a href="/"> NFT Concerts</a>, we are developing a platform where
        musicians of all genres and audience sizes can take their concert
        recordings and release them using NFTs. Generate a unique NFT that
        grants your fans access to exclusive full-length content. If you’re an
        artist or content owner looking to transform live performances into
        digital collectibles, please fill out our{" "}
        <a href="/apply">Artist Application</a>.{" "}
      </p>
      <p>
        If the idea of ditching a streaming service and purchasing a NFT Concert
        direct from your favorite artist appeals to you, be sure to sign up for
        our mailing list in the footer below. And if you really want to help us
        out, follow NFT Concerts on your favorite social platforms.{" "}
      </p>
    </BlogPost>
  );
};

export default CoachellaNfts;
