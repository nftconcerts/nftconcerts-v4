import React from "react";
import BlogPost from "./BlogPost";
import ReactPlayer from "react-player";

const NftProfilePhoto = () => {
  return (
    <BlogPost
      postTitle="10 Days With a NFT Profile Picture"
      postDate="January 10, 2022"
      nextPost="/5-music-nft-companies-set-to-explode-in-2022"
      prevPost="/how-to-get-started-with-nfts"
    >
      <p>
        Like many individuals, when I first discovered NFTs I was blown away by
        what was actually being sold. I couldn’t believe that a group of images
        or short animations could be worth that amount of money. I did not see
        the appeal of an NFT profile picture, and I had a hard time
        understanding why people would spend serious money on images or clips
        that anyone can download.
      </p>
      <p>
        Seeing the potential of the technology but looking to modify the use
        case, I started NFT Concerts. We are currently building out a streaming
        platform focused on live music performance recordings. Instead of making
        the recordings public, we make them private and issue a set of NFTs that
        grant access to the performance recording. Each recording gets its own
        set of NFTs, allowing artists to monetize their performance through
        exclusivity. In my opinion, these NFTs offer greater value to their
        owners than a simple JPEG image.
      </p>
      <p>
        However, as part of my New Year’s resolution I was determined to learn
        more about the potential and popularity of NFT PFP collections. While I
        had been aware and following NFT profile pictures, I decided it was time
        to finally purchase my own PFP NFT. I discovered the{" "}
        <a href="https://www.noodlesnft.art/" target="_blank" rel="noreferrer">
          Noodles NFT Collection
        </a>
        , one of the first two official derivatives of the immensely popular
        Doodles PFP NFTs. Having seen the Mutant Ape Yacht Club quickly follow
        the Bored Ape Yacht Club to the stratosphere, I decided it was a safe
        first option that was still in my price range.
      </p>
      <div className="post__photo__div">
        <img
          src="https://nftconcerts.com/wp-content/uploads/2022/01/4483-1536x1536.png"
          className="post__photo__two"
        />
      </div>
      <p>
        On January 1, I purchased Noodle #4483. I repurposed an old anonymous
        Twitter account, updated my username (
        <a href="https://twitter.com/jimiseth" target="_blank" rel="noreferrer">
          @jimiseth
        </a>
        ), and set my Noodle as my profile picture. Seeing that the official{" "}
        <a
          href="https://twitter.com/Noodles_NFT"
          target="_blank"
          rel="noreferrer"
        >
          @Noodles_NFT
        </a>{" "}
        twitter account only had 5000 followers, I decided the best thing that I
        could do to protect my asset would be to help promote the Noodles. I
        spent a few hours animating short gifs of various Noodles, and within 7
        days I went from 10 to over 200 followers due to my Noodle art. I
        checked the prices of the Noodles on OpenSea about 10,000 times and made
        multiple direct connections with Noodles owners.
      </p>
      <div className="post__photo__div">
        <div className="post__video__player__div">
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
            playing={false}
            controls={true}
            url="//cdn-cf-east.streamable.com/video/mp4/hzuy0s.mp4?Expires=1664053200&Signature=foHRIZI19Rt7p8uk-2gAjnkFK71hmlO~wWwBqBn3sIrJC6CntpHJSYx2~L2WV03ehCjweUkpGJCoOsY8dEA2eyqyPaONZcpJtFNcf~XK8r0TyXYFiLj~W6IMX3Q-jfKC3~Y3cjU4sjDitBmZUh9wGMJh6Xo9nZ3cHgMq~BzGN6XTuaQkeoC4bhLKivihowzkJBAUg5sklMYsJBoysxmAkUcob6Spoio3rdordNmjsZCKmXitn25Z5mdk1BSPkiHJXw4FUp~HNxqztnKhJ8IrfIHBjuWF7pOHJ7KInIavVyCD5X~EtN4jSDOWK0NFtJ1oArrvZbtsP-q-FnuKKrqfNQ__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ"
          />
        </div>
      </div>
      <p>
        Having been sports fan my whole life, I immediately recognized the
        feeling of being on a team. I started to feel like I was on team Noodle.
        I had originally listed my Noodle for sale for almost 3x the purchase
        price, but as the floor closed in on my Noodle, I felt nervous. I’m on
        team Noodle and #4483 is my jersey. What happens if my noodle sells and
        I can’t get another one? What about my Noodle friends? I had dinner
        plans, but right before going out, I pulled the trigger. I decided to
        spend almost .01 ETH ($30) to remove the listing. My noodle is not for
        sale. There are many noodles like him, but he is mine.
      </p>
    </BlogPost>
  );
};

export default NftProfilePhoto;
