import React from "react";
import BlogPost from "./BlogPost";
import ReactPlayer from "react-player";

const NftsAreComing = () => {
  return (
    <BlogPost
      postTitle="NFTs are Coming to a Live Event Near You"
      postDate="March 9, 2022"
      prevPost="/what-coachella-nfts-say-about-the-future-of-music"
      nextPost="/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
    >
      <p>
        With the massive amount of excitement surrounding the metaverse, it can
        be easy to overlook the real-world live events currently implementing
        NFTs. While there are NFT centered professional conferences such as NFT
        NYC and NFT LA, a better indicator of public adoption is the increasing
        number of concerts, music festivals, and sporting events releasing NFT
        collectibles.
      </p>
      <p>
        Zhu got the game rolling way back in May with the release of the{" "}
        <a
          href="https://yh.io/nft-collection/zhu-nft-community-collection/"
          target="_blank"
          rel="noreferrer"
        >
          DREAMROCKS NFTs
        </a>
        , free to attendees of their Red Rocks shows. As far as I can find,
        these were the first NFTs released in conjunction with a live event.
        With plans to allow NFT owners access to exclusive content and a private
        Zhu fan club, the DREAMROCKS NFTs proved popular among fans.
      </p>
      <div className="post__photo__div">
        <a
          href="https://yh.io/nft-collection/zhu-nft-community-collection"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://lh3.googleusercontent.com/WcJIvk_j1P1RFLG6aKvsR5rJQJhRRptao_m97IgDIEvNeJaFEyYVRonOlUuwiM5wuRid0Uym1DHmgJR0_Z0m55rXin6luEDqqLSRSQ=w600"
            className="post__photo__two"
          />
        </a>
      </div>
      <p>
        Rolling Loud Music Festival had a unique NFT implementation that engaged
        fans at the actual event. Rolling Loud set up a{" "}
        <a
          href="https://www.rollingloud.com/nft"
          target="_blank"
          rel="noreferrer"
        >
          NFT scavenger hunt
        </a>
        , rewarding fans who tracked down hidden QR codes with a free NFTs. At
        the event, there was a legitimate buzz among collectors as they probed
        the venue for these exclusive collectibles.{" "}
      </p>
      <p>
        The NFL is getting in on the NFT action with the release of{" "}
        <a href="https://nfl.live-nfts.com/" target="_blank" rel="noreferrer">
          commemorative NFT tickets
        </a>
        . These tickets have been released for some of this year’s regular
        season games and all of the playoff games. They have proved immediately
        popular. Attendees of Super Bowl LVI will receive one of these
        commemorative NFT tickets featuring their seat number, row, and section.
      </p>
      <div className="post__photo__div">
        <div className="post__video__player__div">
          <a href="https://nfl.live-nfts.com/" target="_blank" rel="noreferrer">
            <ReactPlayer
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                  },
                },
              }}
              width="100%"
              height="100%"
              loop={true}
              playing={true}
              controls={true}
              url="https://imgcdn.socialos.io/web/files/61771d0ff1f70e205d4ceba7/1643825132219_LA_Rams_Generic_Superbowl_v001.mp4"
            />
          </a>
        </div>
      </div>
      <p>
        While events are exploring NFTs, my big question is where is the
        utility? While it would be hard to complain about a free NFT that comes
        with a ticket, the resale market on these event-centered NFTs is already
        poor. While the concept of an event based NFT is great, the market has
        not valued these assets in the long term. How can we add additional
        value to an event NFT that will encourage long term demand?
      </p>
      <p>
        At <a href="/">NFT Concerts</a>, we are developing a NFT platform
        designed to turn live performances into exclusive digital collectibles.
        Rather than just giving a NFT away for free with a ticket, we encourage
        artists to release a set of NFTs for a show separate from their ticket
        sales. These NFTs will be limited in quantity and grant their owners
        access to the full concert recording. Artists will now have the ability
        to monetize their concert recordings using exclusivity and can ditch
        subscription and ad-based distribution methods. Fans can now purchase
        the right to stream their favorite performances on-demand and have
        ownership over an exclusive digital asset tied to their favorite artist.
      </p>
      <p>
        Every concert is unique, and every show has value. By attaching a
        private recording to a public NFT, additional value is offered to the
        owner of an NFT Concert. Resell values of these NFTs should increase
        with the popularity of the artist. Additionally, by focusing NFT
        releases on singular events, artists open a new revenue stream by
        creating valuable digital assets that doesn’t step on or hurt the value
        of their previously released NFT works. There is no need to wait 6
        months between NFT drops when you are creating NFT Concerts.
      </p>
      <p>
        If you’re an artist interested in releasing an NFT Concert, please fill
        out our <a href="/apply">Artist Application</a>. If you’re a music fan
        who can’t wait to start collecting your favorite live performances, join
        our mailing list in the footer below to get notified of our imminent
        launch. As NFTs explode in popularity, keep your eyes out for a NFT
        release coming to a live event near you.{" "}
      </p>
    </BlogPost>
  );
};

export default NftsAreComing;
