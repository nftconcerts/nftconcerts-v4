import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const CollectibleNftArt = () => {
  return (
    <BlogPost
      postTitle="Musicians, Turn Your Live Concerts into Collectible NFT Art"
      postDate="May 4, 2021"
      prevPost="/the-past-present-and-future-of-concert-bootlegs"
      nextPost="/nfts-and-music-a-revolution-in-distribution"
    >
      <Helmet>
        <title>The Past, Present, and Future of Concert Bootlegs</title>
        <meta
          name="description"
          content="Concert bootlegs, or unofficial live music recordings have a long and storied history in the music world - but what does the future hold?"
        />
      </Helmet>
      <p>
        NFT’s are currently exploding in popularity. Artists from around the
        world are quickly recognizing the potential of non-fungible tokens to
        monetize previously difficult mediums. Currently this crypto art
        gold-rush is creating a rapid explosion of artists appearing on the
        scene. Tens of thousands of NFT collectibles are appearing on
        marketplaces across the web.
      </p>
      <p>
        The industry standard is a publicly viewable digital art piece with
        ownership being auctioned off in the form of NFT’s. 3D Animations and
        collectible sets do quite well. While this model has established
        non-fungible token technology, it is not geared toward musicians. Facing
        a requirement to produce visual art, musicians are struggling to fully
        unlock the potential of NFT’s. In fact,{" "}
        <a href="https://opensea.io" target="_blank" rel="noreferrer">
          OpenSea
        </a>
        , the largest NFT marketplace requires a visual component to an NFT to
        list on their marketplace. This barrier has caused multiple musicians to
        form partnerships with digital artists, releasing collaborative digital
        art that is on brand with both artists.
      </p>
      <p>
        While collaboration is great, at NFT Concerts we believe musicians
        deserve a platform designed for them. While there are many blockchain
        music projects, few are aimed at live music. Stop allowing bootleggers
        to profit off your live shows. Our platform allows artists to create
        exclusive digital collectibles simply and easily with their live show
        recordings.
      </p>
      <p>
        Musicians, takes the guesswork out of NFT’s and turn your live music
        into a true digital collectible. Preserve music history, record the
        show, and release a NFT Concert. All NFT Concerts are fully secure and
        private. Only the owners of the NFT Concert will be able to stream the
        show. Our revolutionary distribution network ensures your show
        recordings are only viewable by the owners. Relying on the same
        encryption standards as Amazon or a Spotify, we offer digital data
        protection for a fraction of the FAANG fees. At NFT Concerts, we strive
        to offer musicians an additional revenue stream. If you’re an interested
        Artist, fill out our <a href="/apply">Artist Application</a>. If you’re
        a fan and find NFT Concert, sign up for our mailing list! We will be
        sure to notify you when we launch to the public.
      </p>
    </BlogPost>
  );
};

export default CollectibleNftArt;
