import React from "react";
import BlogPost from "./BlogPost";

const MusicFestivalsAndNfts = () => {
  return (
    <BlogPost
      postTitle="Music Festivals & NFTs in 2022"
      postDate="February 27, 2022"
      nextPost="/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
      prevPost="/nfts-are-coming-to-a-live-event-near-you"
    >
      <p>
        Over the past year we have seen an explosion in NFTs. While we have yet
        to see mass public adoption, the overall market trend is astronomical.
        Talented people are taking NFTs and adapting their use cases to a
        variety of industries. While digital artwork still dominates the market,
        NFTs are quickly being utilized in everything from real estate to event
        tickets. In particular, music festivals are beginning to cater to the
        NFT crowd.
      </p>
      <p>
        You may have heard the news about the Coachella NFT drop. Be sure to
        check out our article on the{" "}
        <a
          href="https://nftconcerts.com/what-coachella-nfts-say-about-the-future-of-music/"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Coachella NFT drop
        </a>{" "}
        for the full details. While Coachella may be the biggest name in the
        industry, they are far from the only festival exploring NFTs in 2022.
      </p>
      <div className="post__photo__div">
        <a href="https://nft.coachella.com/" target="_blank" rel="noreferrer">
          <img
            src="https://nftconcerts.com/wp-content/uploads/2022/02/Screen-Shot-2022-02-27-at-11.37.40-AM-1536x761.png"
            className="post__photo__two"
          />
        </a>
      </div>
      <p>
        SXSW music and tech conference has been the focus of numerous NFT
        projects. Blockchain Creative Labs launched their own SXSW NFT Discord.
        At the actual festival, there will be a NFT Art Gallery, a NFT Meetup,
        and a few talks from both NFT artists as well as NFT company executives.
        To see the full list of official SXSW NFT events,{" "}
        <a href="https://schedule.sxsw.com/2022/search?q=NFT">go here</a>.
      </p>
      <p>
        The Doodles community just announced they will be hosting their own
        Doodles land for SXSW featuring secret music performances in an entire
        Doodle themed land. If unable to attend, Doodles holders will be able to
        live stream the event from the comfort of their home.
      </p>
      <div className="post__photo__div">
        <a
          href="https://twitter.com/doodles/status/1497268841860284423"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://pbs.twimg.com/media/FMdd4AHWUAkrZPj?format=jpg&name=4096x4096"
            className="post__photo__two"
          />
        </a>
      </div>
      <p>
        Event management should look at NFTs as the perfect souvenir. They can
        generate additional revenue and form an online community at the same
        time. As an event, the last thing you want is for your event to be
        forgotten. An active community of NFT holders hyping up your event all
        year round is a dream for any promoter. In addition, any announcement of
        a NFT drop associated with an event generates headlines. Simply put,
        it’s a ROI positive advertisement for the festival.
      </p>
      <p>
        At <a href="/">NFT Concerts</a>, we have developed a NFT release method
        focused on live events. Our goal is to build the most comprehensive NFT
        package for concerts. To ensure long term value for owners, we require
        the full concert recording. Instead of making the recording public, we
        keep it private and issue a set of NFTs that unlock access to that
        recording. Only the NFT holders will be able to stream the show.
      </p>
      <p>
        This is a way to release the performance recording that is ad-free,
        subscription-free, and exclusive. We’ve brought back the idea of
        valuable bootlegs recordings in a legitimate way using NFTS. If you’re
        an artist or event looking to explore NFTs, be sure to contact us or
        fill out the <a href="/apply">Artist Application</a> If you can’t wait
        to Own the Show, sign up for our mailing list in the footer below.
      </p>
    </BlogPost>
  );
};

export default MusicFestivalsAndNfts;
