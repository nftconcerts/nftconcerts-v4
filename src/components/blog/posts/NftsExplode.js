import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const NftsExplode = () => {
  return (
    <BlogPost
      postTitle="NFTs Explode While Concerts and Music Festivals Make a Comeback"
      postDate="August 5, 2021"
      prevPost="/live-music-is-back-is-this-the-end-of-streaming-shows"
      nextPost="/can-i-make-my-music-into-nfts"
    >
      <Helmet>
        <title>
          NFTs Explode While Concerts and Music Festivals Make a Comeback
        </title>
        <meta
          name="description"
          content="NFT sales are rapidly exploding while in-person concerts and festivals return across the nation. When will live events and NFTs mix?"
        />
      </Helmet>
      <p>
        Music is back! As live in-person events return across the nation, music
        fans and party goers are quickly running back to the dance floor. While
        attendees are happy to interact with fellow humans, industry
        professionals are feeling relief as many of them have spent the last
        year attempting to survive with their profession shut down.
      </p>
      <p>
        While many artists turned to live streams during the pandemic, with
        in-person events returning the focus on a digital experience has been
        put to the wayside. There is a tremendous push to return to the
        pre-pandemic status quo. While we all want festivals and shows to be
        back in force, many are forgetting the valuable lessons learned by
        streaming shows.
      </p>
      <p>
        There are serious benefits to offering a digital show experience, even
        when the event takes place in the real world. Due to geographic
        distance, financial constraints, and even real-world disabilities, many
        music fans find themselves unable to attend live shows. By recording and
        releasing shows as digital collectibles, Artists can offer that ‘Live’
        experience to their full fanbase.
      </p>
      <p>
        Additionally, by recording the show officially artists will preserve a
        piece of music history. When it comes to live music, there is no faking
        the funk. True music fans know that one live show will always be
        different from another live show, even if the set lists are the same.
        Hopefully, by offering an official recording artists will be able to cut
        down on the percentage of fans who spend 100% of the show holding a
        phone above their head attempting to capture crappy iPhone video.
      </p>
      <p>
        There is tremendous value in a live show recording that is not currently
        realized. Traditional distribution methods for digital audio and video
        files are not optimized to extract the most value from a concert
        recording. Recordings have a high value for a small amount of people and
        attempting to release them through traditional methods such as album
        sales or commemorative DVD’s is generally a losing proposition.
      </p>
      <p>
        <a href="/">NFT Concerts </a>attempts to remedy this problem by turning
        your live concert recording into an exclusive digital collectible. By
        using NFT’s to gate access to the show recording, artists will be able
        to release a digital file to a limited audience. Our platform allows
        artists to determine the number of issues for a concert, whether that be
        1 or 10,000 issues per show. Each issue owner will have the ability to
        stream the show. By using non-fungible tokens, everyone will know the
        exclusivity of the show and be able to verify ownership, as well as
        offer their token for resale. Sell the NFT Concert, lose access to the
        show recording.
      </p>
      <p>
        We believe this distribution method will be used with all types of
        digital files, but we plan to prove this method first using full length
        show recordings. Built out of a love of live music, NFT Concerts wants
        to encourage artists to record their shows. Ideally, artists will be
        able to generate a new revenue stream from their current content. Live
        shows only happen once, and you never know when that magic moment might
        appear on stage. Record and release your next show via NFT Concerts.
      </p>
    </BlogPost>
  );
};

export default NftsExplode;
