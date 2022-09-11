import React from "react";
import "./About.css";
import YouTube from "react-youtube";

const About = () => {
  const opts = {
    height: "300",
    playerVars: {
      color: "white",
      modestbranding: 1,
    },
  };

  return (
    <div className="about__page">
      <div className="about__header">
        <div className="about__header__contents">
          <h1 className="about__title">NFT Concerts</h1>
          <h3 className="about__subtitle">Own the Show</h3>
        </div>
        <div className="about__fadeBottom"></div>
      </div>

      <div className="about__featured__div">
        <div className="about__featured__contained">
          <div className="three__fourths">
            <h3 className="about__section__heading">The Pitch </h3>
            <p>
              NFT Concerts has an extremely narrow focus - transform concert
              recordings into digital collectibles using non-fungible tokens.
            </p>
            <p>
              Mint a NFT Concert to unlock and stream a full performance
              recording. Each performance is token gated, available exclusivley
              to the NFT Concert owners.{" "}
            </p>
          </div>
          <div className="one__fourth">
            <div className="youtube__video">
              <YouTube
                videoId="BFxzPgO86Rc"
                opts={opts}
                className="youtube__video"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="about__featured__div">
        <div className="about__featured__contained">
          <div className="three__fourths">
            <h3 className="about__section__heading">
              Minting & Streaming a NFT Concert{" "}
            </h3>
            <p>
              The NFT Concerts platform is designed to be as simple as possible
              for users to mint, unlock, and stream NFT Concerts.
            </p>
            <p>
              This video turtorial showcases the minting and playback
              experience.
            </p>
          </div>
          <div className="one__fourth">
            <YouTube
              videoId="M2C2Ej2jmGU"
              opts={opts}
              className="youtube__video"
            />
          </div>
        </div>
      </div>

      <div className="about__featured__div">
        <div className="about__featured__contained">
          <div className="three__fourths">
            <h3 className="about__section__heading">
              Uploading & Creating a NFT Concert{" "}
            </h3>
            <p>
              Artists, if you know how to upload to YouTube, you have all the
              technical skills required to create a NFT Concert.
            </p>
            <p>
              This video tutorial of our step-by-step uploader walks through the
              simple process of creating a NFT Concert.
            </p>
          </div>
          <div className="one__fourth flex__down">
            <img
              src="https://i.imgur.com/1Eu2Q4K.jpg"
              className="video__stand__in"
            />
            <p className="text__center">Video Coming Soon</p>
          </div>
        </div>
      </div>
      <div className="about__featured__div">
        <div className="about__featured__contained">
          <div className="three__fourths">
            <h3 className="about__section__heading">
              Join the Production Team{" "}
            </h3>
            <p>Want early access to NFT Concerts? Join the Production Team.</p>
            <p>
              Explore the closed Beta and recieve early access to mint all
              future NFT Concerts. Watch the video for more information.
            </p>
          </div>
          <div className="one__fourth flex__down">
            <img
              src="https://imgur.com/zi1XNyx.jpg"
              className="video__stand__in"
            />
            <p className="text__center">Video Coming Soon</p>
          </div>
        </div>
      </div>
      <div className="about__team__div">
        <div className="about__team__contained">
          <h1 className="about__section__heading">The Team</h1>
          <img
            src="https://shoutoutsocal.com/wp-content/uploads/2022/03/c-PersonalJimmyDendrinos__jimmyprofilepic2_1645328489075.jpg"
            className="jimmy__photo"
          />
          <h3 className="team__name">Jimmy Dendrinos</h3>
          <h5>Founder</h5>
          <div className="jimmy__social__icons">
            <div
              className="jimmy__social__icon__div"
              onClick={() => {
                window.open("https://www.linkedin.com/in/jdendrinos/");
              }}
            >
              <i className="fa-brands fa-linkedin-in jimmy__social__icon" />
            </div>
            <div
              className="jimmy__social__icon__div"
              onClick={() => {
                window.open("https://www.instagram.com/jimisphotos/");
              }}
            >
              <i className="fa-brands fa-instagram jimmy__social__icon" />
            </div>
            <div
              className="jimmy__social__icon__div"
              onClick={() => {
                window.open("https://twitter.com/jimiseth");
              }}
            >
              <i className="fa-brands fa-twitter jimmy__social__icon" />
            </div>
            <div
              className="jimmy__social__icon__div"
              onClick={() => {
                window.open("https://jdendrinos.com/");
              }}
            >
              <i className="fa-solid fa-globe jimmy__social__icon" />
            </div>
            <div
              className="jimmy__social__icon__div"
              onClick={() => {
                window.open(
                  "https://shoutoutsocal.com/meet-jimmy-dendrinos-founder-of-nft-concerts/"
                );
              }}
            >
              <i className="fa-solid fa-newspaper jimmy__social__icon" />
            </div>
          </div>
          <div className="call__to__action">
            Interested in joining the NFT Concerts Team? Send an email to{" "}
            <a href="mailto:info@nftconcerts.com" className="white__link">
              info@nftconcerts.com
            </a>{" "}
          </div>
        </div>
      </div>
      <div className="roadmap__div">
        <div className="about__team__contained">
          <h1 className="roadmap__section__heading">The Roadmap</h1>
          <img src="/media/nftc-truck.png" className="nftc__truck" />
          <div className="roadmap__dates__div">
            <div className="start__col">
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">2/21/21</div>
                <div className="roadmap__objective">Jimmy Discovered NFTs</div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">2/23/21 </div>
                <div className="roadmap__objective">
                  NFT Concerts Domain Purchased & Socials Registered
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">3/31/21</div>
                <div className="roadmap__objective">
                  {" "}
                  Launched Initial Wordpress Website with{" "}
                  <a
                    href="https://nftconcerts.com/blog"
                    target="_blank"
                    rel="noreffer"
                  >
                    Blog
                  </a>
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">4/16/21</div>
                <div className="roadmap__objective">
                  First Meeting with Serious Investment Team
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">6/1/21</div>
                <div className="roadmap__objective">
                  Completed{" "}
                  <a
                    href="https://xd.adobe.com/view/857f637b-8813-458e-ae1f-e471f463ef56-d02c/"
                    target="_blank"
                    rel="noreffer"
                  >
                    NFT Concerts Prototype
                  </a>{" "}
                  in Adobe XD
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">9/3/21</div>
                <div className="roadmap__objective">
                  Sold the First{" "}
                  <a
                    href="https://nftconcerts.com/product/nft-concerts-snapback-hat-black/"
                    target="_blank"
                    rel="noreffer"
                  >
                    NFT Concert Hat
                  </a>{" "}
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">11/25/21</div>
                <div className="roadmap__objective">
                  NFT Concerts Inc. Incorporated as a Delaware C-Corp
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">2/1/22</div>
                <div className="roadmap__objective">
                  Development Started on the NFT Concerts Platform
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">3/12/22</div>
                <div className="roadmap__objective">
                  First{" "}
                  <a
                    href="https://witlingo.com/lingofest-nft-dendrinos/"
                    target="_blank"
                    rel="noreffer"
                  >
                    Podcast Interview
                  </a>{" "}
                  Featuring NFT Concerts on Witlingo
                </div>
              </div>
            </div>
            <div className="end__col">
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">3/15/22</div>
                <div className="roadmap__objective">
                  <a
                    href="https://shoutoutsocal.com/meet-jimmy-dendrinos-founder-of-nft-concerts/"
                    target="_blank"
                    rel="noreffer"
                  >
                    {" "}
                    Featured Article{" "}
                  </a>{" "}
                  published in Shoutout SoCal
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">8/4/22</div>
                <div className="roadmap__objective">
                  Released the <a href="/">NFT Concerts Production Team</a> and
                  sold the first NFT
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date done__date">9/1/22</div>
                <div className="roadmap__objective">
                  NFT Concerts Beta opens with NFT Concert #1 by Babs.0
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date">10/1/22</div>
                <div className="roadmap__objective">
                  NFT Concerts Opens to the Public
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date">12/30/22</div>
                <div className="roadmap__objective">Reach 100 NFT Concerts</div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date">3/1/22</div>
                <div className="roadmap__objective">Reach 500 NFT Concerts</div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date">6/1/22</div>
                <div className="roadmap__objective">
                  iPhone & Android Mobile Applications
                </div>
              </div>
              <div className="roadmap__single__date">
                <div className="roadmap__date">12/1/22</div>
                <div className="roadmap__objective">
                  Reach 1500 NFT Concerts
                </div>
              </div>

              <div className="roadmap__single__date">
                <div className="roadmap__date">7/4/23</div>
                <div className="roadmap__objective">
                  The first NFT Concert on the Moon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
