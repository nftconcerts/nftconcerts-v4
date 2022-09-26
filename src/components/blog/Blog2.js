import React from "react";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

const Blog = () => {
  let navigate = useNavigate();
  return (
    <div className="blog__page">
      <div className="blog__header">
        <div className="blog__header__contents">
          <div className="blog__text__background">
            <div className="blog__header__logo">
              <img
                src="/media/nftc-logo.png"
                className="blog__header__logo__image"
              />
            </div>
            <h1 className="blog__title">NFT Concerts Blog</h1>
            <h3 className="blog__subtitle">Industry News, Company Updates</h3>
          </div>
        </div>
        <div className="blog__fadeBottom"></div>
      </div>
      <div className="blog__cards__div">
        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/how-should-i-price-my-nft-release");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/10/How-to-price-a-music-nft-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                How Should I Price My NFT Release?
              </h3>
              <p className="blog__card__preview">
                Here at NFT Concerts, we have determined a simple formula which
                we believe artists should use to price their initial NFT
                release. Feel free to try out our NFT price calculator and see
                how it compares to your real-world results.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/how-should-i-price-my-nft-release");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>October 15, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/top-9-music-nfts-of-2021");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/09/Top-9-Music-NFTs-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                NFT Scorecard – Ranking the Top 9 Music NFTs of 2021
              </h3>
              <p className="blog__card__preview">
                For the first time, we rank some of the most popular NFT
                releases in the music scene. Discover which artist is an NFT
                King, and which major rap star had an NFT flop.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/top-9-music-nfts-of-2021");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>September 18, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/concert-nft");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/09/NFTC-Post-Thumbnail-Template-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">What is a Concert NFT?</h3>
              <p className="blog__card__preview">
                While there have been a couple of NFT projects announced dealing
                with concert tickets, and even Don Diablo’s one-off virtual
                show, here at NFT Concerts we have developed a method to
                monetize live concert recordings though exclusivity.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/concert-nft");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>September 9, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/nft-scam");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/09/Are-NFTs-a-Scam-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">Are NFTs a Scam</h3>
              <p className="blog__card__preview">
                As the NFT gold rush continues, many individuals are jumping
                into the NFT space with minimal understanding of the underlying
                technology. An increasing number of “investors” and
                entrepreneurs are looking to get rich quick in the NFT space,
                creating a potentially toxic market.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/nft-scam");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>September 3, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/5-ways-musicians-can-make-money-with-nfts");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/08/5-Ways-Musicians-Can-Make-Money-with-NFTs-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                5 Ways Musicians Can Make Money with NFTs
              </h3>
              <p className="blog__card__preview">
                While many musicians are entering the NFT space, there have been
                several different NFT implementations used successfully. Learn 5
                ways to make money with NFTs as a musician.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/5-ways-musicians-can-make-money-with-nfts");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>August 22, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/can-i-make-my-music-into-nfts");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/08/Can-I-Make-My-Music-Into-NFTs-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Can I Make My Music Into NFTs?
              </h3>
              <p className="blog__card__preview">
                With the recent NFT gold rush, many musicians find themselves
                wondering, “Can I turn my music into NFTs?” Check out the
                current options available to musicians and artist looking to
                create NFT music.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/can-i-make-my-music-into-nfts");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>August 17, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate(
                  "/nfts-explode-while-concerts-and-music-festivals-make-a-comeback"
                );
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/08/NFTs-Explode-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                NFTs Explode While Concerts and Music Festivals Make a Comeback
              </h3>
              <p className="blog__card__preview">
                July has been an amazing month for both live music and NFTs.
                Record sales of non-fungible tokens continue to show that the
                NFT market is here to stay.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate(
                    "/nfts-explode-while-concerts-and-music-festivals-make-a-comeback"
                  );
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>August 5, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate(
                  "/live-music-is-back-is-this-the-end-of-streaming-shows"
                );
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/05/Live-Music-is-Back-Thumbnail-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Live Music is Back! Is This the End of Streaming Shows…?
              </h3>
              <p className="blog__card__preview">
                Music is back! While artists turned to live streams during the
                pandemic, with in-person events returning, is this the end of
                streaming shows
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate(
                    "/live-music-is-back-is-this-the-end-of-streaming-shows"
                  );
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>May 31, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/nfts-and-music-a-revolution-in-distribution");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/05/Unlockable-NFTs-768x768.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Unlockable NFTs and Music – A Revolution in Distribution
              </h3>
              <p className="blog__card__preview">
                NFT Concerts plans to be among the first to offer true
                unlockable content through NFT technology. Only the owner(s) of
                the NFT Concert will be able to steam the show.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/nfts-and-music-a-revolution-in-distribution");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p> May 14, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/collectible-nft-art");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/05/NFT-Concerts-Collectibles-web-768x768.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Musicians, Turn Your Live Concerts into Collectible NFT Art
              </h3>
              <p className="blog__card__preview">
                Musicians, explore the possibility of turning your existing live
                show recordings into valuable digital collectibles. NFT Concerts
                makes it easy.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/collectible-nft-art");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>May 4, 2021</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/the-past-present-and-future-of-concert-bootlegs");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/04/concert-bootlegs-768x768.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                The Past, Present, and Future of Concert Bootlegs
              </h3>
              <p className="blog__card__preview">
                Concert bootlegs, or unofficial live music recordings have a
                long and storied history in the music world. Can we use NFTs to
                legitimize and monetize official bootlegs?
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/the-past-present-and-future-of-concert-bootlegs");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>April 22, 2021</p>{" "}
            </div>
          </div>
        </div>
        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/don-diablos-600eth-1-2m-nft-concert");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/04/DD-3-768x768.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Serious Issues with Don Diablo’s 600 ETH ($1.2 M) NFT Concert
              </h3>
              <p className="blog__card__preview">
                Famed DJ and musician Don Diablo just shook up the NFT world by
                releasing the first full length NFT concert. Let's look at some
                issues.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/don-diablos-600eth-1-2m-nft-concert");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>April 12, 2021</p>{" "}
            </div>
          </div>
        </div>
        <div className="blog__page__buttons">
          <button
            className="page__button"
            onClick={() => {
              navigate("/blog");
            }}
          >
            &#171; Previous
          </button>
          <button className="page__button" disabled={true}>
            Next &#187;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
