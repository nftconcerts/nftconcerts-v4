import React from "react";
import BlogPost from "./BlogPost";

const MakeMusicNfts = () => {
  return (
    <BlogPost
      postTitle="Can I Make My Music Into NFTs?"
      postDate="August 17, 2021"
      prevPost="/nfts-explode-while-concerts-and-music-festivals-make-a-comeback"
      nextPost="/5-ways-musicians-can-make-money-with-nfts/"
    >
      <p>
        If you’re looking to turn your music into an NFT, you’ve come to the
        right spot. Due to the recent gold rush of non-fungible token (NFT) art
        sales, artists of all types are looking to enter the scene. Many
        musicians find themselves wondering, “How can I turn my music into an
        NFT?”
      </p>
      <p>
        Music and NFTs are just getting off the ground. One of the most popular
        NFT marketplaces{" "}
        <a href="https://opensea.io" target="_blank" rel="noreferrer">
          OpenSea
        </a>{" "}
        recently added support for audio NFTs. Through their system you can
        upload your mp3 or wav file and issue NFTs on your music. With a
        verified account, you can list your minted music NFTs directly for sale
        on their marketplace.
      </p>
      <p>
        If you’re looking for a marketplace designed exclusively for music, be
        sure to check out{" "}
        <a href="https://mintsongs.com" target="_blank" rel="noreferrer">
          Mint Songs
        </a>
        . This is a new platform takes advantage of the Polygon Network to allow
        artist to mint NFTs to their music for free. Despite being early in
        development, it has a much more natural feel for music and is showing
        early signs of promise.
      </p>
      <p>
        While OpenSea, Mint Songs, and other NFT platforms will allow you to
        tokenize your music, all current platforms will have your music hosted
        publicly. <a href="/">NFT Concerts</a> is different. While individual
        songs are not allowed, full concert recordings in both audio and video
        formats are accepted to be listed on our marketplace.
      </p>
      <p>
        While others in the NFT space make your music private, NFT Concerts
        encrypts and secures your content so only the owners of the issued NFTs
        can access and stream the show. Downloads are not possible and the sale
        of the NFT causes an immediate loss of access to the underlying content.
        Through this unique implementation, NFT Concerts is determined to create
        a valuable digital asset that proves to be the future of digital content
        distribution. If you are an artist looking to tokenize your live concert
        recordings, please visit our <a href="/apply">Artists</a> page and fill
        out our application for more details. Let’s create the future of music
        memorabilia together.
      </p>
    </BlogPost>
  );
};

export default MakeMusicNfts;
