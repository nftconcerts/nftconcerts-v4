import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const GetStarted = () => {
  return (
    <BlogPost
      postTitle="How to Get Started with NFTs"
      postDate="December 1, 2021"
      nextPost="/10-days-with-a-nft-profile-picture"
      prevPost="/nft-tickets-vs-nft-music-music-entertainment-nfts"
    >
      <Helmet>
        <title>How to Get Started with NFTs</title>
        <meta
          name="description"
          content="NFTs can be a little complicated. Check out this tutorial if you would like to learn how to setup a MetaMask wallet and start collecting NFTs"
        />
      </Helmet>
      <p>
        In this week’s blog post, we are going to back to the basics. In an
        effort to help newcomers familiarize themselves with NFTs, we have
        written up a simple guide. By the end of this article, you will be well
        on your way to collecting all sorts of amazing digital art. While there
        are plenty of NFTs out there, be sure to check out NFT Concerts for our
        unlockable music performances.
      </p>
      <h3 className="company__name">Step 1: Open a Crypto Wallet</h3>
      <p>
        Don’t worry, this isn’t as scary as it sounds. In order to buy and own
        NFTs, you will need a wallet. A crypto wallet is a place where you can
        securely keep your crypto assets such as NFTs. To quickly and easily
        setup a crypto wallet use Google Chrome and add the plugin MetaMask to
        your browser.
      </p>
      {/* <div className="post__photo__div">
        <a
          href="https://yh.io/nft-collection/zhu-nft-community-collection"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://merch.nftconcerts.com/wp-content/uploads/2021/12/metamask-plugin-v2.jpg"
            className="post__photo__two"
          />
        </a>
      </div> */}
      <div className="post__image__div">
        <img
          src="https://merch.nftconcerts.com/wp-content/uploads/2021/12/metamask-plugin-v2.jpg"
          className="post__image"
        />
        <p className="post__image__subtext">
          Download the{" "}
          <a
            href="https://jdendrinos.com/photography/events/coachella/"
            target="_blank"
            rel="noreferrer"
          >
            Metamask Plugin
          </a>{" "}
          on Google Chrome
        </p>
      </div>
      <p>
        Once added, MetaMask will launch a setup tutorial in a new tab. Click
        <span className="bold__text"> Get Started</span>, then select{" "}
        <span className="bold__text"> Create a Wallet</span>. Choose your data
        sharing preferences then set your password.
      </p>
      <div className="post__image__div">
        <img
          src="https://merch.nftconcerts.com/wp-content/uploads/2021/12/metamask-new-wallet.jpg"
          className="post__image"
        />
        <p className="post__image__subtext">Setup a New Wallet</p>
      </div>
      <p>
        <span className="bold__text">Watch the Video</span> regarding your
        secret recovery phase. It is vital that you protect this phrase as
        anyone with access to it can steal anything from your wallet. There is
        no recovering this phrase if it is forgotten or misplaced.{" "}
        <span className="bold__text">
          Be careful with your secret recovery phrase.
        </span>
      </p>
      <div className="post__image__div">
        <img
          src="https://merch.nftconcerts.com/wp-content/uploads/2021/12/metamask-interface.jpg"
          className="post__image"
        />
        <p className="post__image__subtext">
          Copy Your Wallet Address by Clicking on the 'Account 1' Button
        </p>
      </div>
      <p>
        Save your secret recovery phrase as directed, then confirm you have
        saved the phrase by selecting the correct order on the confirmation
        screen. Once confirmed, you will be directed to your wallet interface.
        Congratulations, you’ve completed step 1.
      </p>
      <h3 className="company__name">Step 2: Fund Your Account</h3>
      <p>
        Congratulations, welcome to the start of your NFT collection. While
        there are opportunities to get free NFTs, if you want to purchase NFTs
        you will need to have cryptocurrency in your wallet. There are numerous
        options when it comes to purchasing cryptocurrency. If you live in the
        United States, one of the safest and most convenient options is
        CoinBase.
      </p>
      <p>
        If you’re interested in purchasing NFTs, buy some ETH and withdraw it to
        your MetaMask wallet. Please be aware that your MetaMask wallet can
        connect to different blockchains (think of blockchains like networks –
        like AT&T vs Verizon) and that any cryptocurrency purchased on CoinBase
        and withdrawn to MetaMask will be on the Ethereum Mainnet.
      </p>
      <h3 className="company__name">Step 3: Discover the Metaverse</h3>
      <p>
        Welcome to world of web3. There’s a lot to discover here. Perhaps your
        first stop should be{" "}
        <a href="https://opensea.io" target="_blank" rel="noreferrer">
          OpenSea
        </a>{" "}
        – the eBay of NFTs. If you head to your account page, you will be able
        to view the NFT sent to you by NFT Concerts (please allow 24 hours for
        processing).
      </p>
      <p>
        If you’re a music fan, be sure to check out{" "}
        <a href="https://royal.io" target="_blank" rel="noreferrer">
          Royal
        </a>
        ,{" "}
        <a href="https://mintsongs.com" target="_blank" rel="noreferrer">
          MintSongs
        </a>
        , and{" "}
        <a href="https://rocki.com" target="_blank" rel="noreferrer">
          ROCKI
        </a>
        . If you’re into horse racing, go try out Zed Run. And as always, don’t
        forget to check out<a href="/"> NFT Concerts </a>for a full length
        concerts unlocked by NFTs.
      </p>
    </BlogPost>
  );
};

export default GetStarted;
