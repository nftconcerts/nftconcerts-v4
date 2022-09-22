import React from "react";
import BlogPost from "./BlogPost";

const NftsAreHereToStay = () => {
  return (
    <BlogPost
      postTitle="NFTs Are Here to Stay"
      postDate="July 7, 2022"
      nextPost="/can-web3-end-two-factor-authentication"
      prevPost="/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
    >
      <p>
        It may just be me, but I’m seeing an unfortunate amount of talk during
        this crypto cooldown about the “death of NFTs.” It appears there is a
        prevailing sentiment in the general population that NFTs are just
        another fad that has come, had its moment in the sun, and is slowly
        fading away. This could not be further from the truth. While this bear
        market will force a reevaluation of NFT-based businesses and business
        models, cryptocurrency and NFTs are here to stay for the long term.
      </p>
      <p>
        Are NFT sales shrinking? Well, according to market statistics provided
        by{" "}
        <a href="http://www.nftgo.io/" target="_blank" rel="noreferrer">
          nftgo.io
        </a>
        , the NFT market cap hit an all-time high of $36.9 billon on April 2nd,
        2022. In the three months since, the NFT market cap has slid to $23.3
        billion. While there has no doubt been a contraction of the NFT market,
        in those three months the price of Ethereum has collapsed from $3,500
        USD to $1,250 USD.
      </p>
      <p>
        With the majority of NFTs sold and valued in ETH, if the NFT market
        followed the Ethereum price collapse equally we should be seeing a
        market cap around $13 Billion. With a current market cap of $23.3
        billion, this is clearly not the case. Effectively, there is more
        cryptocurrency in the NFT market today than there was three months ago.
        However, the market cap is down due to the value of that cryptocurrency
        shrinking when compared to the US dollar.
      </p>
      <p>
        While there was nothing but excitement during the market build up, most
        of the revenue generated during that time revolved around rather basic
        NFT assets. PFP collections and 1-of-1 digital pieces were responsible
        for most high valued NFT sales. Luckily, the excitement and buzz
        surrounding NFTs brought attention and development into the space. While
        many people still think of an NFT as a picture of an ape, the true
        potential of non-fungible tokens is only just being released. The future
        use cases that will dominate the NFT market for years to come will be
        gaming, music, and digital rights management.
      </p>
      <p>
        NFT Concerts is focused on creating the perfect merge of digital
        content, live music, NFTs, and digital rights management. Our method is
        simple, issue a set of NFTs that unlock access to a full-length concert
        recording. Only the owner(s) of the NFT(s) have the right to unlock and
        stream the show recording. Artists can control the accessibility of any
        show by setting the quantity of tokens and the price point. Fans get to
        bring the fun back into collecting music with NFT Concerts. Everyone
        gets a welcome return to an ad-free subscription-free music experience
        where you buy once, stream unlimited times. Subscribe to the NFT
        Concerts mailing list in the footer below to stay up to date on all the
        latest NFT Concert news and information.
      </p>
    </BlogPost>
  );
};

export default NftsAreHereToStay;
