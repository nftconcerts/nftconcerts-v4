import React from "react";
import BlogPost from "./BlogPost";
import YouTube from "react-youtube";
import { Helmet } from "react-helmet";

const CanWeb3End2FA = () => {
  const opts = {
    playerVars: {
      color: "white",
      modestbranding: 1,
    },
  };
  return (
    <BlogPost
      postTitle="Can Web3 End Two-Factor Authentication?"
      postDate="July 19, 2022"
      prevPost="/nfts-are-here-to-stay"
      nextPost="/nft-ticketing-for-concerts-events"
    >
      <Helmet>
        <title>Can Web3 End Two-Factor Authentication?</title>
        <meta
          name="description"
          content="You don’t have to be
          a web expert to be aware of the push for two-factor authentication. Is there a better option with web3?"
        />
      </Helmet>
      <p>
        While this week’s blog post is aimed at developers, if you’ve ever
        logged into a website, you may find it interesting. You don’t have to be
        a web expert to be aware of the push for two-factor authentication.
        These text messages or confirmation emails add an extra level of
        security to our most valuable online accounts.
      </p>
      <p>
        Unfortunately, the standard implementation for two-factor authentication
        adds a significant amount of friction to the user experience. We’ve all
        had to search for our phone or sit there refreshing the email inbox
        waiting on that security code.
      </p>
      <p>
        With the rise of web3, can developers implement a more efficient form of
        two-factor authentication? In an attempt to blend web2 and web3
        authentication systems, I may have stumbled onto a clever solution. Why
        can’t I use a browser-connected wallet as the second form of
        authentication?
      </p>
      <p>Check out the video below to see an example of the login process.</p>
      <div className="post__youtube__div">
        <YouTube videoId="WlWwwbJefK4" opts={opts} className="post__youtube" />
      </div>
      <p>
        From a technical standpoint, I log in a temporary user using the
        traditional email and password. I check that temporary users stored
        wallet ID captured when they register an account. I fire a{" "}
        <a href="https://metamask.io/" target="_blank" rel="noreferrer">
          Metamask
        </a>{" "}
        connection request and check if the connected address is the same as the
        stored wallet ID. If they are a match, the user is allowed to login. Any
        attempt to leave the page will log the temporary user out.
      </p>
      <p>
        While I agree that this method is not quite as secure as a stand-alone
        authentication application, the user experience is streamlined. A login
        request with authentication can take less than 10 seconds. Everything
        happens in the same viewport and there is no need to switch applications
        or track down a secondary device.
      </p>
      <p>
        Security experts, I would welcome any criticism of this method. Please
        let me know if I’m missing something. <a href="/">NFT Concerts</a> fans,
        enjoy the sneak peek at our beta. If you’re like me and can’t wait to
        start collecting concert recordings, be sure to sign up to our mailing
        list in the footer below.
      </p>
    </BlogPost>
  );
};

export default CanWeb3End2FA;
