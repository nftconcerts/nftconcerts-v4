import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const UnlockableNfts = () => {
  return (
    <BlogPost
      postTitle="Unlockable NFTs and Music – A Revolution in Distribution"
      postDate="May 14, 2021"
      prevPost="/collectible-nft-art"
      nextPost="/live-music-is-back-is-this-the-end-of-streaming-shows"
    >
      {" "}
      <Helmet>
        <title>Unlockable NFTs and Music – A Revolution in Distribution</title>
        <meta
          name="description"
          content="NFT Concerts is proud to be one of the leaders in unlockable NFTs. Every NFT Concert unlocks a full performance available on demand."
        />
      </Helmet>
      <p>
        As non-fungible tokens continue to gain traction in the digital art
        world, musicians and bands are currently exploring how best to utilize
        NFT technology. Artists are attempting to bring an offering of value to
        their fanbase as quickly as possible. Currently, musicians with
        followings are teaming up with digital artists to release NFT’s that
        follow the standard model of a short digital animated clip with a
        soundtrack by the musician. While these NFT’s are selling, they tend to
        offer little benefit to the owner beyond bragging rights.
      </p>
      <p>
        Forward thinking artists are exploring projects that add additional
        value to NFT’s. The Slovenian dance music producer UMEK just released an{" "}
        <a href="https://nft.viberate.com/" target="_blank" rel="noreferrer">
          NFT project
        </a>{" "}
        in collaboration with Vibrate offering the winner a private live
        performance. This auction proved to be a success, selling for the
        equivalent of $10,000 through the marketplace BlockParty.
      </p>
      <p>
        Zhu just announced their plans to build an{" "}
        <a
          href="https://edm.com/gear-tech/zhu-nft-based-fan-community"
          target="_blank"
          rel="noreferrer"
        >
          NFT-based community
        </a>
        , offering a limited run of NFT’s to attendees of the Red Rocks
        concerts. This project, title “DREAMROCKS” is another great idea to add
        additional value to an NFT release.
      </p>
      <p>
        However, the missing piece so far is exclusive digital content. While{" "}
        <a href="https://opensea.io" target="_blank" rel="noreferrer">
          OpenSea
        </a>{" "}
        allows for unlockable content, that content is limited to a text input.
        You can put a link to a file, but you cannot protect it. Our platform,
        NFT Concerts is proud to be among the first companies to allow artist to
        protect their digital files using NFT’s. Only the owner(s) of the NFT
        Concert will be able to access and stream the show on demand. Owners may
        sell the token, but upon sale they will no longer have access. We use
        the NFT to unlock an encrypted file, a true revolution in digital rights
        management.
      </p>
      <p>
        Offering the same content protection as Amazon, Spotify, or any other
        big platform for a fraction of the cost, we aim to allow artists to
        monetize their live show recordings as simply as possible while
        protecting them from unauthorized access. Our simple uploader interface
        allows you to upload and list a past show, or schedule an NFT release
        for a future show. Artists, <a href="/apply">apply today</a> to turn
        your next live show into a digital collectible. Fans, sign up to our
        mailing list to be notified of our first round of shows.
      </p>
    </BlogPost>
  );
};

export default UnlockableNfts;
