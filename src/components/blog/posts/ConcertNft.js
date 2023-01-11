import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const ConcertNft = () => {
  return (
    <BlogPost
      postTitle="What is a Concert NFT?"
      postDate="September 9, 2021"
      prevPost="/nft-scam"
      nextPost="/top-9-music-nfts-of-2021"
    >
      <Helmet>
        <title>What is a Concert NFT?</title>
        <meta
          name="description"
          content="Concert NFTs, or NFT Concerts, is a new standard of releasing concert recordings as digital collectibles."
        />
      </Helmet>
      <p>
        NFTs and music are quickly getting into bed together. The power of
        non-fungible tokens to monetize digital content is rapidly creating a
        new source of revenue for artists of all types. While there have been
        songs, albums, and artwork released by musicians as NFTs, we would like
        to encourage bands and musicians to turn their concerts into
        collectibles using NFTs.
      </p>
      <p>
        While there have been a couple of NFT projects announced dealing with
        concert tickets, and even{" "}
        <a
          href="/don-diablos-600eth-1-2m-nft-concert/"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Don Diablo’s one-off virtual show
        </a>
        , here at NFT Concerts we have developed a method to monetize live
        concert recordings though exclusivity. Only the owners may access and
        stream the show.
      </p>
      <p>
        Concert recordings are niche content. To passionate fans, a concert
        recording is priceless. This is especially true when it is a recording
        of a show you personally attended. Over $3.5 billion of music
        merchandise is sold each year to fans trying to take home a piece of
        that magic.
      </p>
      <p>
        The current release methods for concert recordings are deeply flawed.
        Public release through YouTube or SoundCloud, or subscription services
        such as Nugs.net are both interested in the same thing – the number of
        views.
      </p>
      <p>
        Concert recordings will never generate the same view count as an
        official album release or music videos. Additionally, many artists play
        similar sets show after show, and there is a disadvantage to releasing
        the same show to the public twice.
      </p>
      <p>
        At NFT Concerts, we have solved the problem by making concert recording
        exclusive. For an individual show, a set number of NFTs are released
        that unlock streaming access to that concert recording. Our streaming
        platform checks for that NFT to unlock the file. The NFT functions as a
        key, offering ownership over the right to view that concert recording.
      </p>
      <p>
        If an owner sells the NFT, they will instantly lose access to that
        concert recording. Each concert recording will have its own set of NFTs,
        and as a result, its own set of owners. Artists are able to determine
        the exclusivity of each show by choosing the number of NFTs. Our NFT
        experts work with artists to ensure they release the right number of
        NFTs at the right price point for their fanbase.
      </p>
      <p>
        If you are an artists or content owner interested in releasing an NFT
        Concert, be sure to fill out our Artist Application. We will be in touch
        shortly with more details. If you are a fan looking for ownership over
        exclusive concert recordings, register an account or sign up for our
        mailing list below. Are you ready for NFT Concerts?
      </p>
    </BlogPost>
  );
};

export default ConcertNft;
