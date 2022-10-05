import React, { useState } from "react";
import BlogPost from "./BlogPost";
import emailjs from "@emailjs/browser";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const NftPricingCalc = () => {
  const [igFollowers, setIgFollowers] = useState(0);
  const [twitterFollowers, setTwitterFollowers] = useState(0);
  const [fbFollowers, setFbFollowers] = useState(0);
  const [spotifyFollowers, setSpotifyFollowers] = useState(0);

  const priceResult =
    (igFollowers + twitterFollowers + fbFollowers + spotifyFollowers) * 0.14;

  const usDollarFormat = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const result = usDollarFormat.format(priceResult);
  const [email, setEmail] = useState("");
  const [artist, setArtist] = useState("");
  const [showResult, setShowResult] = useState(false);

  const calculate = () => {
    if (artist === "") {
      return alert("Artist Name Required");
    } else if (email === "") {
      return alert("Eamil Required");
    } else {
      sendEmail();
    }
  };

  const [messageSent, setMessageSent] = useState(false);

  const sendEmail = () => {
    let myMessage =
      "Artist Name: " +
      artist +
      " | Email: " +
      email +
      " | IG: " +
      igFollowers +
      " | FB: " +
      fbFollowers +
      " | Twitter: " +
      twitterFollowers +
      " |  Spotify: " +
      spotifyFollowers +
      " | Result: " +
      result;
    var template_params = {
      email: "jimmy@nftconcerts.com",
      subject: "NFT Pricing Calculator Submission",
      message: myMessage,
    };
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        "template_blank",
        template_params,
        process.env.REACT_APP_EMAIL_USER_ID
      )
      .then(
        (result) => {
          console.log(result.text);
          setMessageSent(true);
          setShowResult(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <BlogPost
      postTitle="How Should I Price My NFT Release?"
      postDate="January 30, 2022"
      prevPost="/top-9-music-nfts-of-2021/"
      nextPost="/nft-tickets-vs-nft-music-music-entertainment-nfts"
    >
      <Helmet>
        <title>
          How Should I Price My NFT Release? - NFT Pricing Calculator for
          Musicians
        </title>
        <meta
          name="description"
          content="Stop guesssing on how to price your NFT release. Using data from our market research, we have built a NFT pricing calculator for musicians."
        />
      </Helmet>
      <p>
        While it is awesome to see so many musicians and artists continue to
        enter the NFT space, there has been minimal analysis on what is actually
        working. Here at NFT Concerts, we have been studying the financial
        success of various music NFTs. We have determined a simple formula which
        we believe artists should use to price their initial NFT release. Feel
        free to try out our NFT price calculator and see how it compares to your
        real-world examples.
      </p>
      <div className="nft__pricing__calc__div">
        <h3 className="company__name">
          NFT Release Pricing Calculator for Musicians
        </h3>
        {(!showResult && (
          <>
            <h5 className="calc__input__label">Instagram Followers</h5>
            <input
              className="calc__input"
              defaultValue={igFollowers}
              onChange={(e) => {
                setIgFollowers(e.value);
              }}
            />
            <h5 className="calc__input__label">Twitter Followers</h5>
            <input
              className="calc__input"
              defaultValue={twitterFollowers}
              onChange={(e) => {
                setTwitterFollowers(e.value);
              }}
            />
            <h5 className="calc__input__label">Facebook Followers</h5>
            <input
              className="calc__input"
              defaultValue={fbFollowers}
              onChange={(e) => {
                setFbFollowers(e.value);
              }}
            />
            <h5 className="calc__input__label">Spotify Followers</h5>
            <input
              className="calc__input"
              defaultValue={spotifyFollowers}
              onChange={(e) => {
                setSpotifyFollowers(e.value);
              }}
            />
            <h5 className="calc__input__label">Email</h5>
            <input
              className="calc__input"
              defaultValue={email}
              onChange={(e) => {
                setEmail(e.value);
              }}
            />
            <h5 className="calc__input__label">Artist Name</h5>
            <input
              className="calc__input"
              defaultValue={artist}
              onChange={(e) => {
                setArtist(e.value);
              }}
            />
            <button className="calc__submit__button" onClick={calculate}>
              Submit
            </button>
          </>
        )) || (
          <>
            <h3>
              Welcome {artist}, you should price your NFT drop at a total of{" "}
              {result}
            </h3>
            <button
              className="calc__submit__button"
              onClick={() => {
                Navigate("/apply");
              }}
            >
              Release a NFT Concert
            </button>
          </>
        )}
      </div>
      <p>
        While this calculator may give you an idea of the potential of NFTs,
        there are certainly no guarantees. However, when it comes to NFTs, there
        are also no limits. New records are being set all the time. Some of the
        NFT releases we studied absolutely smashed our formula’s predictions.
        Make sure to do your research on various NFT options and develop a NFT
        strategy that reflects your brand. Check out our write up on the{" "}
        <a href="/top-9-music-nfts-of-2021/">Top 9 Music NFTs of 2021 </a>to see
        a whole range of NFT releases done by musicians.
      </p>
      <p>
        If you are interested in releasing the next generation of music
        memorabilia, it’s time to consider a <a href="/">NFT Concert</a>. Don’t
        cut up your performance into short highlights. Instead, release the full
        length concert recording unlocked by NFTs. Fill out our{" "}
        <a href="/apply">Artist Application </a>to learn how you can become a
        part of our initial launch.{" "}
      </p>
    </BlogPost>
  );
};

export default NftPricingCalc;
