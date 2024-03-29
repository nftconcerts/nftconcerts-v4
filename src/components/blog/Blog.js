import React from "react";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

import { Helmet } from "react-helmet";

const Blog = () => {
  let navigate = useNavigate();
  return (
    <div className="blog__page">
      <Helmet>
        <title>NFT Concerts Blog</title>
        <meta
          name="description"
          content="NFT Concerts news, company updates, and general music NFT news and information."
        />
      </Helmet>
      <div className="blog__header">
        <div className="blog__header__contents">
          <div className="blog__text__background">
            <div className="blog__header__logo">
              <img
                src="/media/nftc-logo.png"
                className="blog__header__logo__image"
                alt="Blog Header logo"
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
                navigate("/spotify-embraces-token-gated-content");
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2FSpotify%20Embraces%20Token%20Gated%20Content.jpg?alt=media&token=d07edc00-b9db-4a35-9ebd-094908d5030c"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                Spotify's Embrace of Token-Gated Content: A Major Milestone for
                NFTs and Music Fans
              </h3>
              <p className="blog__card__preview">
                Spotify has made headlines by partnering with KINGSHIP to launch
                its first token-gated playlist, accessible only to those who
                hold a KINGSHIP Key Card NFT.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/spotify-embraces-token-gated-content");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>February 23, 2022</p>{" "}
            </div>
          </div>
        </div>
        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/future-of-music");
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FThe%20Future%20of%20Music%20is%20Here.jpg?alt=media&token=73d92a4b-bd37-4550-b7d3-48644fa3dcfa"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                The Future of Music is Here: NFT Concerts Take the Stage
              </h3>
              <p className="blog__card__preview">
                While many are becoming aware of music NFTs representing
                individual songs are albums, a few savvy artists and collectors
                are experimenting with NFT Concerts.
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/future-of-music");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>February 13, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div className="blog__card">
            <div
              className="blog__card__thumbnail__div"
              onClick={() => {
                navigate("/evolution-of-recorded-music");
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2Fhistory%20of%20recorded%20music.jpg?alt=media&token=2d4ae40c-138d-48c2-b965-9da554fcd3d5"
                className="blog__card__thumbnail__image"
              />
            </div>
            <div className="blog__card__info__div">
              <h3 className="blog__card__title">
                The Evolution of Recorded Music: From Edison's Phonograph to
                Music NFTs
              </h3>
              <p className="blog__card__preview">
                The history of recorded music started in the late 1800's. Now we
                have music NFTs. How did we get here and are things better or
                worse for artists?
              </p>
              <button
                className="blog__read__more__button"
                onClick={() => {
                  navigate("/evolution-of-recorded-music");
                }}
              >
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>December 12, 2022</p>{" "}
            </div>
          </div>
        </div>

        <div className="blog__card__div">
          <div
            className="blog__card"
            onClick={() => {
              navigate("/nft-ticketing-for-concerts-events");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FNFT%20Ticketing%20for%20Concerts%20and%20Events.jpg?alt=media&token=4e19e535-5343-43bd-817b-971b9aec737a"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/can-web3-end-two-factor-authentication/");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FNew%20Factor%20Authentication.jpg?alt=media&token=7782acaf-2a74-4575-86f3-75bea1b95acb"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/nfts-are-here-to-stay");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FNFTs%20Are%20Here%20to%20Stay.jpg?alt=media&token=d9dd3f79-49d5-483c-846d-5797b917e2a3"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate(
                "/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
              );
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2F10%20Reasons%20to%20Turn%20Your%20Next%20Performance%20into%20a%20NFT%20Concert.jpg?alt=media&token=86bf61cc-7a9c-4025-884c-45ea1f8209b6"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/music-festivals-nfts-in-2022");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FMusic%20Festivals%20and%20NFTs%20in%202022.jpg?alt=media&token=19c3dd78-e900-44c8-bc4c-f8b036ab6b03"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail"
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/nfts-are-coming-to-a-live-event-near-you");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FNFTs%20are%20coming%20to%20a%20live%20event%20near%20you%20v2.jpg?alt=media&token=c79799fc-0a92-4ece-a0cf-f2869161e812"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail"
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/what-coachella-nfts-say-about-the-future-of-music");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2Fcoachella%20NFTs.jpg?alt=media&token=d8bdf17c-0509-4f00-9c23-b46c23e4e86d"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail"
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/nfts-are-not-just-pictures");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FNFTs%20Are%20Not%20Just%20Profile%20Pictures.jpg?alt=media&token=1c262487-590a-4965-90d1-8fd9097d01ab"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/5-music-nft-companies-set-to-explode-in-2022");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2FTop%205%20Music%20NFT%20Companies%20web.jpg?alt=media&token=a0e0d55d-e173-4054-b9f1-be1f44c85dde"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
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
          <div
            className="blog__card"
            onClick={() => {
              navigate("/10-days-with-a-nft-profile-picture");
            }}
          >
            <div className="blog__card__thumbnail__div">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fpost__images%2F10%20days%20nft%20pfp%20thumbnail%20image.jpg?alt=media&token=b9bbfc97-3b4e-4e31-8bce-d0e56873cbc2"
                className="blog__card__thumbnail__image"
                alt="Blog Thumbnail "
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
              <button className="blog__read__more__button">
                Read More &#187;
              </button>
            </div>
            <div className="blog__card__metadata__div">
              <p>Jimmy Dendrinos</p>
              <p>January 10, 2022</p>{" "}
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
