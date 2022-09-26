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
                navigate("/nft-ticketing-for-concerts-events");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/08/NFT-Ticketing-for-Concerts-and-Events-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                NFT Ticketing for Concerts & Events
              </h3>
              <p className="blog__card__preview">
                NFT tickets for Concerts and Events are about to explode.
                Discover the potential of using a NFT ticket for your next
                concert or live event. A NFT ticket can provide a lifetime of
                value for both fans and artists.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/nft-ticketing-for-concerts-events");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>August 6, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/can-web3-end-two-factor-authentication/");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/07/New-Factor-Authentication-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Can Web3 End Two-Factor Authentication?
              </h3>
              <p className="blog__card__preview">
                While this week’s blog post is aimed at developers, if you’ve
                ever logged into a website, you may find it interesting. You
                don’t have to be a security expert to be aware of the push for
                two-factor authentication.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/can-web3-end-two-factor-authentication/");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>July 19, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/nfts-are-here-to-stay");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/07/NFTs-Are-Here-to-Stay-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">NFTs Are Here to Stay</h3>
              <p className="blog__card__preview">
                It may just be me, but I’m seeing an unfortunate amount of talk
                during this crypto cooldown about the “death of NFTs.” It
                appears there is a prevailing sentiment in the general
                population that NFTs are just another fad. This could not be
                further from the truth.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/nfts-are-here-to-stay");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>July 7, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate(
                  "/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
                );
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/03/10-Reasons-to-Turn-Your-Next-Performance-into-a-NFT-Concert-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                10 Reasons to Turn Your Next Performance into a NFT Concert
              </h3>
              <p className="blog__card__preview">
                At NFT Concerts, we are focused on releasing live performance
                recordings using NFTs. But why would you want to do this? Learn
                10 benefits of releasing a NFT Concert.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate(
                    "/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
                  );
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>March 9, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/music-festivals-nfts-in-2022");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/02/Music-Festivals-and-NFTs-in-2022-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Music Festivals & NFTs in 2022
              </h3>
              <p className="blog__card__preview">
                Event management should look at NFTs as the perfect souvenir. An
                active community of NFT holdershyping up your event all year
                round is a dream for any promoter.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/music-festivals-nfts-in-2022");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>February 27, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/nfts-are-coming-to-a-live-event-near-you");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/02/NFTs-are-coming-to-a-live-event-near-you-v2-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                NFTs are Coming to a Live Event Near You
              </h3>
              <p className="blog__card__preview">
                While there are NFT centered professional conferences such as
                NFT NYC and NFT LA, a better indicator of public adoption is the
                increasing number of concerts, music festivals, and sporting
                events releasing NFT collectibles
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/nfts-are-coming-to-a-live-event-near-you");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>February 8, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/what-coachella-nfts-say-about-the-future-of-music");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/02/coachella-NFTs-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                What Coachella NFTs Say About the Future of Music
              </h3>
              <p className="blog__card__preview">
                Coachella Music Festival is officially joining the NFT
                community. Capped off by their most exclusive offering – The
                Coachella Keys Collection – 10 NFTs that grant their owners
                lifetime access to the Coachella Music Festival.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate(
                    "/what-coachella-nfts-say-about-the-future-of-music"
                  );
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>February 3, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/nfts-are-not-just-pictures");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/01/NFTs-Are-Not-Just-Profile-Pictures-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">NFTs Are Not Just Pictures</h3>
              <p className="blog__card__preview">
                Over the past year NFT profile pictures have exploded in
                popularity. From musicians, athletes, movie stars, and even your
                next door neighbor – it seems like everyone is rocking an NFT.
                But is this the best use case for NFT technology?
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/nfts-are-not-just-pictures");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>January 30, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/5-music-nft-companies-set-to-explode-in-2022");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/01/Top-5-Music-NFT-Companies-web-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                5 Music NFT Companies Set to Explode in 2022
              </h3>
              <p className="blog__card__preview">
                With the crypto market crashing and exceptional volatility in
                both coins and NFTs, investors may be considering safer options.
                Consider betting on a NFT company instead of an NFT.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/5-music-nft-companies-set-to-explode-in-2022");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>January 23, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/10-days-with-a-nft-profile-picture");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2022/01/10-days-nft-pfp-thumbnail-image-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                10 Days With a NFT Profile Picture
              </h3>
              <p className="blog__card__preview">
                On January 1, I purchased Noodle #4483. I repurposed an old
                anonymous Twitter account, updated my username (@jimiseth), and
                set my Noodle as my profile picture.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/10-days-with-a-nft-profile-picture");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>January 10, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/how-to-get-started-with-nfts");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/12/How-to-Get-Started-with-NFTs-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                How to Get Started with NFTs
              </h3>
              <p className="blog__card__preview">
                Do you want to discover the potential of NFTs? Follow this
                simple guide to learn how to setup a crypto wallet, receive a
                free NFT, fund your account, and begin to explore the
                possibilities of web3.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/how-to-get-started-with-nfts");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>December 1, 2021</p>{" "}
            </div>
          </div>
        </div>
        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/nft-tickets-vs-nft-music-music-entertainment-nfts");
              }}
            >
              <img
                src="https://merch.nftconcerts.com/wp-content/uploads/2021/11/NFT-Tickets-vs-NFT-Music-600x600.jpg"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">NFT Tickets vs. NFT Music</h3>
              <p className="blog__card__preview">
                The music community is quickly engaging non-fungible tokens in
                new and creative ways. While certain artists are using NFTs as a
                lottery system to send some of their fans to space, others are
                taking a more practical approach.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate(
                    "/nft-tickets-vs-nft-music-music-entertainment-nfts"
                  );
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>November 15, 2021</p>{" "}
            </div>
          </div>
        </div>
        <div className="blog__page__buttons">
          <button className="page__button" disabled={true}>
            &#171; Previous
          </button>
          <button
            className="page__button"
            onClick={() => {
              navigate("/blog/page/2");
            }}
          >
            Next &#187;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
