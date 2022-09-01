import React, { useState, useEffect } from "react";
import "./Row.css";
import { useNavigate } from "react-router-dom";
import { GetUSDExchangeRate } from "../api";
import { truncateAddress } from "./../../firebase";
import ReactPlayer from "react-player";
import { useActiveClaimCondition, useEditionDrop } from "@thirdweb-dev/react";
import editionDrop from "../../scripts/getContract.mjs";
import dateformat from "dateformat";
import "./ComingSoonRow.css";

function ComingSoonRow({ title, isLargeRow, concerts, isFinalRow }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [copied, setCopied] = useState(false);
  let navigate = useNavigate();

  const handleClick = (concert) => {
    if (trailerUrl) {
      setTrailerUrl("");
      setCopied(false);
    } else {
      setTrailerUrl("full");
    }
  };

  //custom twitter share link
  var twitterLink =
    "https://twitter.com/intent/tweet?text=Have%20you%20heard%20of%20NFT%20Concerts%3F%20%0A%0AThe%20%40nftconcerts%20platform%20lets%20artists%20turn%20concert%20%26%20studio%20recordings%20into%20digital%20collectibles.%20%F0%9F%94%A7%F0%9F%94%92%0A%0APurchase%20a%20NFT%20Concert%20to%20unlock%20the%20full%20performance%20recording.%20%F0%9F%94%93%F0%9F%94%A5%F0%9F%94%A5%0A%0AIf%20you%20love%20music%2C%20go%20check%20it%20out!%0A%0A%23nfts%20%23musicnfts%20%23nftconcerts";

  return (
    <>
      <div className={`row ${isLargeRow && "row1"}`}>
        <h2 className="row__title">{title}</h2>
        {/* container -> posters */}

        <div className="row__posters">
          {concerts.map((concert) => (
            <img
              key={concert}
              onClick={() => handleClick(concert)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2FComing%20Soon%20Token%20Template.png?alt=media&token=c3c3498a-6db2-48f0-8c49-e48093cb713a"
              alt={"More NFT Concerts Coming Soon"}
            />
          ))}
        </div>

        {trailerUrl && (
          <div className={`click__preview ${isFinalRow && "final__row"}`}>
            <div>
              <h1 className="preview__title coming__soon__title">
                Want to see more Artists release NFT Concerts?
              </h1>

              <>
                <div className="row__media__player no__media__player__row">
                  {" "}
                  <h3 className="promo__h3">Spread the Word!</h3>
                  <p>Share NFT Concerts with Friends, Family, and Musicians</p>
                  <div className="share__buttons__div">
                    <a href={twitterLink} target="_blank" rel="noreferrer">
                      <button className="fa-brands fa-twitter share__button" />
                    </a>
                    <button
                      className="fa-solid fa-clipboard share__button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "https://beta.nftconcerts.com"
                        );
                        setCopied(!copied);
                      }}
                    />
                  </div>
                  {copied && (
                    <p className="copied">
                      URL copied to clipboard. Please share and tag{" "}
                      <span className="red__emph">@nftconcerts</span>.
                    </p>
                  )}
                </div>
              </>
            </div>
            <div className="preview__contents coming__soon__bottom">
              <b className="emph">
                NFT Concerts relies on the good will of our fans to help spread
                the word.{" "}
              </b>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ComingSoonRow;
