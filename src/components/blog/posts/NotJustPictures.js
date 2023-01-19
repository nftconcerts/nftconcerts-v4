import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const NotJustPictures = () => {
  return (
    <BlogPost
      postTitle="NFTs Are Not Just Pictures"
      postDate="January 30, 2022"
      prevPost="/5-music-nft-companies-set-to-explode-in-2022"
      nextPost="/what-coachella-nfts-say-about-the-future-of-music"
    >
      <Helmet>
        <title>NFTs Are Not Just Pictures</title>
        <meta
          name="description"
          content="There seems to be some confusion among the general public about NFTs. No, they are not just pictures - but they can be?"
        />
      </Helmet>
      <p>
        Over the past year, NFT profile pictures have exploded in popularity.
        From famous musicians, athletes, movie stars, and even your next-door
        neighbor – it seems everyone is rocking their latest NFT as their
        profile picture. Social media platforms have taken notice and earlier
        this month Twitter officially rolled out NFT verification for Twitter
        Blue users. For $2.99 per month, you can display your verified NFT
        inside of a super cool hexagon instead of the boring old circle. This
        will help weed out some of the fraudulent accounts claiming ownership
        over expensive NFTs and add additional clout to legitimate NFT owner
        profiles. There is no doubt this feature will convince thousands of free
        Twitter users to upgrade to a premium Twitter Blue subscription.
      </p>
      <div className="post__tweet__div">
        <blockquote className="twitter-tweet">
          <p lang="en" dir="ltr">
            If my pfp is ever a hexagon you can unfollow. I won&#39;t even be
            mad.
          </p>
          &mdash; Linus LinusMediaGroup (@linusgsebastian){" "}
          <a href="https://twitter.com/linusgsebastian/status/1485834171314442243?ref_src=twsrc%5Etfw">
            January 25, 2022
          </a>
        </blockquote>{" "}
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <p>
        While there are several benefits to purchasing a NFT profile picture and
        joining one of these communities, NFTs are not simply limited to graphic
        art. There is a common misconception that all NFTs are simple pictures
        or short animations. Non-fungible tokens (NFTs) have nothing to do with
        the art they represent. Stop thinking of the NFT as the art and start
        thinking of the NFT as the certificate of authenticity for that artwork.
        NFTs exist on a blockchain and as such have a verified point of origin
        and public transaction record. While you can screenshot or download the
        artwork associated with an NFT, you cannot change the owners address on
        the NFT contract without a verified transaction on the blockchain and
        the owners wallet signature.
      </p>
      <div className="post__photo__div">
        <a href="https://nft.coachella.com/" target="_blank" rel="noreferrer">
          <img
            src="https://merch.nftconcerts.com/wp-content/uploads/2022/01/screenshot-a-nft.jpg"
            className="post__photo__two"
            alt="Screenshot a NFT"
          />
        </a>
      </div>
      <p>
        When you start viewing NFTs as certificate of authenticity, you can
        begin to see the true potential of the technology. While the current
        standard is to issue a NFT for public artwork, there is the alternative
        model of issuing an NFT that grants access to private content. At{" "}
        <a href="/">NFT Concerts</a>, we are developing a new distribution
        method using NFTs that unlock private content. While every NFT Concert
        will have a publicly viewable thumbnail, all NFTs created and sold via
        the NFT Concerts platform will unlock access to a full concert
        recording. The NFT will function as a key. Only the owner(s) of that NFT
        will be able to unlock and stream the show recording on-demand. Sell the
        NFT, lose access to the underlying concert recording. This model will
        allow artists to monetize their live performance recordings using
        exclusivity and will generate NFTs that offer their owners exclusive
        content.
      </p>
      <p>
        Beyond concert recordings, this distribution method will prove to be
        popular with all sorts of niche content. By relying on public
        transaction records on the blockchain, platforms can ensure a
        trustworthy experience on all fronts. Now users will be able to see
        exactly how many people have access to any particular piece of content
        and most importantly, they will have the option to resell the NFT
        granting access to that content for a price of their choosing. NFT
        technology is revolutionary, and we are only starting to see the start
        of mass adoption. If you’re an artist or musician interested in creating
        a NFT Concert, please fill out our{" "}
        <a href="/apply">Artist Application</a>. Otherwise, be sure to sign up
        for our mailing list in the footer below to get notified of the latest
        NFT Concert news and information.
      </p>
    </BlogPost>
  );
};

export default NotJustPictures;
