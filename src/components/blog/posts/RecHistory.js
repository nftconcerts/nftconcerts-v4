import React from "react";
import BlogPost from "./BlogPost";
import { Helmet } from "react-helmet";

const RecHistory = () => {
  return (
    <BlogPost
      postTitle="The Evolution of Recorded Music: From Edison's Phonograph to Music NFTs"
      postDate="December 12, 2022"
      nextPost="/blog"
      prevPost="/nft-ticketing-for-concerts-events"
    >
      <Helmet>
        <title>
          The Evolution of Recorded Music: From Edison's Phonograph to Music
          NFTs
        </title>
        <meta
          name="description"
          content="Famed DJ and musician Don Diablo just shook up the NFT world by releasing the first full length NFT concert. However, there are some issues!"
        />
      </Helmet>
      <p>
        The history of recorded music can be traced back to the late 19th
        century, when new technologies and inventions allowed for the creation
        of sound recordings. Prior to this, music was primarily experienced
        live, and there was no way to capture and preserve the sounds of musical
        performances.
      </p>
      <p>
        One of the earliest forms of recorded music was the phonograph, invented
        by Thomas Edison in 1877. The phonograph used a cylinder wrapped in
        tinfoil to record and play back sound, and was initially used for
        recording and reproducing spoken words. Later versions of the phonograph
        were developed that could record and play back music, and these became
        popular for home entertainment and as a way for people to hear their
        favorite songs and performers.
      </p>
      <p>
        The development of the gramophone and the vinyl record in the early 20th
        century allowed for the creation of more advanced and high-quality
        recordings. The gramophone used a flat disk to record and play back
        sound, which allowed for a longer playing time and improved sound
        quality compared to the phonograph. Vinyl records became the most
        popular medium for recorded music, and were used for commercial
        recordings of all genres of music.
      </p>
      <p>
        The introduction of magnetic tape in the 1950s led to the development of
        the cassette tape, which allowed for portable and convenient playback of
        recorded music. Cassette tapes became popular in the 1970s and 1980s,
        and were used for both commercial recordings and home recording.
      </p>
      <p>
        The rise of digital technology in the 1980s and 1990s led to the
        development of new formats for recorded music, such as the CD and the
        MP3. CDs offered improved sound quality and durability compared to vinyl
        records, and quickly became the dominant format for commercial
        recordings. MP3s and other digital formats allowed for easy sharing and
        downloading of music, and marked the beginning of the era of digital
        music.
      </p>
      <p>
        This has had a significant impact on the music industry. The widespread
        availability of pirated music on the internet made it difficult for
        artists and record labels to earn revenue from the sale of CDs and other
        physical formats.
      </p>
      <p>
        In response to this trend, the music industry embraced streaming music
        as a way to provide consumers with legal and convenient access to music.
        Streaming services such as Spotify, Apple Music, and Pandora allow users
        to listen to music on demand and pay a subscription fee or listen to
        advertisements in exchange for access to a vast library of music. This
        model has proven to be successful, and has helped to combat piracy by
        providing consumers with a legitimate and affordable way to access
        music. However, despite the popularity of streaming services, the vast
        majority of artists do not earn a significant amount of money from
        streaming music.
      </p>
      <p>
        One of the main reasons for this is that the revenue generated by
        streaming music is shared among a large number of parties, and the
        amount that actually reaches the artists is relatively small. The price
        paid per stream is between $0.003-$0.005 cents. This means that even if
        a song is streamed millions of times, the artist may only receive a
        small fraction of the revenue.
      </p>
      <p>
        In addition, many artists do not have a large enough fan base to
        generate significant revenue from streaming. The vast majority of songs
        played on streaming platforms are from established and popular artists.
        It can be difficult for independent or emerging artists to gain traction
        and build a following. As a result, many artists do not earn enough from
        streaming to pay for lunch, let alone earn a living. Musicians must rely
        on other sources of income such as touring, merchandise, and licensing
        their music for use in other media.
      </p>
      <p>
        Non-fungible tokens (NFTs) offer a potential solution to this problem
        and could provide artists with a new way to earn revenue from their
        music. NFTs are unique digital assets that are stored on a blockchain.
        They can represent a wide range of items such as art, collectibles, and
        digital media. In the case of music, an NFT could represent a song, an
        album, or a concert.
      </p>
      <p>
        The use of NFTs for music offers several benefits for artists. First, it
        allows for the creation of unique and limited editions of music, which
        can be sold for a higher price than a standard streaming or download.
        This provides artists with the opportunity to earn more money from their
        music, offer fans unique experience, and compensate for the low revenue
        generated by streaming.
      </p>
      <p>
        NFTs allow for the creation of exclusive experiences and content that
        can only be accessed by the owner of the NFT. In the case of NFT
        Concerts, we are focused on concert recordings. While many concerts are
        recorded, few are ever released. I believe concert recordings are the
        perfect digital collectible. Fans get access to exclusive content from
        their favorite show and artist generate additional revenue.
      </p>
      <p>
        Additionally, <a href="www.nftconcerts.com">NFT Concerts</a> puts fans
        and artists on the same side of the table. If the artist succeeds, the
        popularity of their NFT Concerts goes up and everyone wins. Fans become
        tangible members of an online community, are featured as audience
        members on the concert listing page, and have an opportunity to profit
        from their favorite artists’ success.{" "}
      </p>
      <p>
        NFT Concerts uses NFTs as the keys to unlock streaming media. If you’re
        still confused, think of it as a limited edition DVD, but instead of
        using discs and DVD players we are using NFTs to unlocks streaming
        video. The use of blockchain technology means that these NFTs are unique
        and cannot be replicated or copied, which ensures that the owners are
        the only ones who can unlock the music. This distribution method
        provides artists with greater control over their music and ensure that
        they are properly compensated for their work. Now they can monetize
        through exclusivity, tapping the passion of their fanbase.{" "}
      </p>
      <p>
        Overall, NFT Concerts offers a potential solution to the problem of low
        revenue from streaming, and could provide artists with a new way to earn
        money from their live performances. By offering unique and limited
        editions of their concerts for fans, and using blockchain technology to
        verify and authenticate their work, artists can earn more money from
        their live music while building a stronger connection with their fans.
      </p>
      <p>
        If you’re an artist interested in releasing a NFT Concert, fill out the
        Artist Application. The first three NFT Concerts are currently minting
        right now. If you’re a music fan, be sure to collect a NFT Concert and
        unlock access to a unique concert recording!
      </p>
    </BlogPost>
  );
};

export default RecHistory;
