import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const NftScam = () => {
  return (
    <BlogPost
      postTitle="Are NFTs a Scam?"
      postDate="September 3, 2021"
      prevPost="/5-ways-musicians-can-make-money-with-nfts"
      nextPost="/concert-nft"
    >
      <Helmet>
        <title>Are NFTs a Scam?</title>
        <meta
          name="description"
          content="While there are scam NFT projects and people committing scams with NFTs, NFTs are a technology not a scam. "
        />
      </Helmet>
      <p>
        We recently released the{" "}
        <a
          href="https://www.youtube.com/watch?v=7n35A1Zt8kc"
          target="_blank"
          rel="noreferrer"
        >
          first promotional video
        </a>{" "}
        for NFT Concerts and immediately got hit with several negative comments.
        Many of these comments encouraged viewers to avoid NFTs, and some even
        referred to NFTs as a total scam. So, in this article, we are going to
        look at the question, “Are NFTs a Scam?”
      </p>
      <p>
        As the NFT gold rush continues, many individuals are jumping into the
        NFT space with minimal understanding of the underlying technology. An
        increasing number of “investors” and entrepreneurs are looking to get
        rich quick in the NFT space, creating a potentially toxic market.
      </p>
      <p>
        In order to understand if NFTs are a scam, we first need to answer the
        question, “what is a NFT?” A non-fungible token (NFT) is an individual
        token existing on a blockchain. A NFT is unique from other crypto coins
        in that one token cannot be exchanged for another. To understand
        fungible tokens, consider bitcoin. Bitcoin is a fungible token and as
        such can be compared to a dollar bill. One dollar bill can be exchanged
        for another, no problem. Just like dollar bills, one bitcoin can be
        exchanged for another bitcoin, no problem.
      </p>
      <p>
        NFTs are better represented by paintings. You can’t simply swap one
        painting for another and expect an equal transaction. Every painting is
        unique, and every painting has its own value. A non-fungible token is a
        unique token, in that can’t be swapped for another.
      </p>
      <p>
        The current NFT standard is to issue a non-fungible token to a public
        image or short video clip, offering ownership over that clip. Through
        the blockchain, this token can be authenticated as having been issued by
        the creator and has a provable public transaction record to verify the
        current owner of the token.
      </p>
      <p>
        By using NFTs, popular internet gifs and memes are now getting
        monetized. Headlines are made by the gif of{" "}
        <a
          href="https://www.businessinsider.com/ethereum-nft-meme-art-nyan-cat-sells-for-300-eth-2021-2"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          NyanCat selling for over $600,000
        </a>
        , or
        <a
          href="https://www.nytimes.com/2021/04/29/arts/disaster-girl-meme-nft.html"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Disaster Girl{" "}
        </a>
        meme selling for over half a million dollars. These high value
        transactions for novelty images show that there is real hype surrounding
        the NFT space, but at the same time, they make traditional investors
        wary.
      </p>
      <p>
        While even I will admit that there are individual NFTs, and even whole
        NFT projects that are scams or scammy in nature, the underlying
        technology is legitimate. Personally, I believe that the future of NFTs
        lies in building additional use cases with this technology.
      </p>
      <p>
        Here at NFT Concerts, we are using NFTs as a key to unlock encrypted
        content, specifically full length audio and video concert recordings.
        Only the owners of the NFT Concert will be able to unlock and stream the
        show. While ownership over public content is great, our NFT solution
        offers ownership over private content, offering real value for fans and
        content protection for artists.
      </p>
      <p>
        NFT technology is certainly not a scam. While consumers should be
        careful with their money and research the NFTs they choose prior to
        purchase, there is real potential for a variety of use cases involving
        NFTs. In the end, educated consumers will determine what NFT projects
        have value both in the short term and the long term. The underlying
        technology of NFTs is sound, and NFTs will be a here for the foreseeable
        future.
      </p>
      <p>
        If you would like to learn more about NFT Concerts, check out our
        <a href="/"> homepage</a>. We are currently lining up artists for our
        initial launch. If you are a musician or content owner, please fill out
        our <a href="/apply">Artist Application</a> for more information. If you
        are a music fan interested in owning exclusive access to previously
        unreleased concert recordings, be sure to subscribe to our mailing list
        below.
      </p>
    </BlogPost>
  );
};

export default NftScam;
