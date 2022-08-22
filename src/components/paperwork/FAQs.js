import React, { useState } from "react";
import Contract from "../form/Contract";
import "./TermsOfService.css";

const FAQs = () => {
  const [sf1, setSf1] = useState(false);
  const [sf2, setSf2] = useState(false);
  const [sf3, setSf3] = useState(false);
  const [sf4, setSf4] = useState(false);
  const [sf5, setSf5] = useState(false);
  const [sf6, setSf6] = useState(false);
  const [sf7, setSf7] = useState(false);
  const [sf8, setSf8] = useState(false);
  const [sf9, setSf9] = useState(false);
  const [sf10, setSf10] = useState(false);
  const [sf11, setSf11] = useState(false);
  const [sf12, setSf12] = useState(false);

  return (
    <Contract>
      <div className="faq__page__div">
        <h1 className="terms__heading__text">FAQs</h1>
        <p className="terms__disclaimer">Answers to Some of Your Questions</p>
        <div className="single__faq__div faq__break">
          {!sf1 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf1(true);
              }}
            />
          )}
          {sf1 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf1(false);
              }}
            />
          )}
          <div className="faq__question">What is NFT Concerts?</div>
        </div>
        {sf1 && (
          <div className="single__faq__expanded__div">
            <p>
              NFT Concerts is a full featured NFT marketplace and content
              streaming platfom built to enable artists to turn concert
              recordings into digital collecitbles using non-fungible tokens
              (NFTs).{" "}
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf2 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf2(true);
              }}
            />
          )}
          {sf2 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf2(false);
              }}
            />
          )}
          <div className="faq__question">What are NFTs?</div>
        </div>
        {sf2 && (
          <div className="single__faq__expanded__div">
            <p>
              A non-fungible token (NFT) is an individual token existing on a
              blockchain. A NFT is unique from other crypto coins in that one
              token cannot be exchanged for another. Each token is unique and
              identifiable. NFTs function as a verifiable certificate of
              authenticity, proving authenticity and offering verifiable
              ownership for digital assets.{" "}
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf3 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf3(true);
              }}
            />
          )}
          {sf3 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf3(false);
              }}
            />
          )}
          <div className="faq__question">
            How does NFT Concerts utilize NFT technology?
          </div>
        </div>
        {sf3 && (
          <div className="single__faq__expanded__div">
            <p>
              NFT Concerts uses NFTs to token gate access to full length concert
              recordings. Only the token owners may access and stream the full
              performance. Sell the NFT, lose access to the show.
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf4 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf4(true);
              }}
            />
          )}
          {sf4 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf4(false);
              }}
            />
          )}
          <div className="faq__question">How do I watch a NFT Concert?</div>
        </div>
        {sf4 && (
          <div className="single__faq__expanded__div">
            <p>
              You must own a NFT Concert to watch the full recording. If you own
              or purchased a NFT Concert, go to <a href="#">Your Account</a> and
              view your NFT Concerts in your library. Click the "Play" button to
              watch the full performance.
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf5 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf5(true);
              }}
            />
          )}
          {sf5 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf5(false);
              }}
            />
          )}
          <div className="faq__question">How do I purchase a NFT Concert?</div>
        </div>
        {sf5 && (
          <div className="single__faq__expanded__div">
            <p>
              NFT Concerts will be listed for initial sale through our
              marketplace. Purchases can be made with ETH through Metamask or
              WalletConnect. Additionally, purchases can be made with Credit
              Card via our <a href="https://paper.xyz/">Paper.xyz</a> checkout
              integration.
            </p>
            <p className="pad__top">
              Current access to our marketplace is restricted to Production Team
              owners. <br />
            </p>
            <p className="pad__top production__team__promo">
              <a className="pad__top " href="/">
                Join the Production Team
              </a>
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf6 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf6(true);
              }}
            />
          )}
          {sf6 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf6(false);
              }}
            />
          )}
          <div className="faq__question">Can I pay with Credit Card?</div>
        </div>
        {sf6 && (
          <div className="single__faq__expanded__div">
            <p>
              Yes - yes, you can can! Our checkout integration with{" "}
              <a href="https://paper.xyz/">Paper.xyz</a> allows anyone to
              purchase NFTs with a simple email address and a credit card.{" "}
            </p>
            <p className="pad__top">
              Paper checkout should launch immediately if you are not connected
              to Metamask. If you are connected via Metamask, click the Credit
              Card icon to checkout using Paper.
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf7 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf7(true);
              }}
            />
          )}
          {sf7 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf7(false);
              }}
            />
          )}
          <div className="faq__question">What are gas fees?</div>
        </div>
        {sf7 && (
          <div className="single__faq__expanded__div">
            <p>
              Gas fees are payments made to complete a transaction on a
              blockchain. These fees compensate miners for the energy required
              to verify a transaction.
            </p>
            <p className="pad__top">
              Gas fees vary based on network congestion and usage. If connected
              to Metamask, you'll see a handy gas tracker next to your current
              ETH balance.
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf8 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf8(true);
              }}
            />
          )}
          {sf8 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf8(false);
              }}
            />
          )}
          <div className="faq__question">
            Why is NFT Concerts on Ethereum Mainnet?
          </div>
        </div>
        {sf8 && (
          <div className="single__faq__expanded__div">
            <p>Safety, Stability, and Compatibility</p>
            <p className="pad__top">
              While we considered Polygon and Solana as potential alternatives,
              concerns over safety, blockchain stability, and the pricing of NFT
              Concerts in the native currency pushed the decision towards
              Ethereum Mainnet.
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf9 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf9(true);
              }}
            />
          )}
          {sf9 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf9(false);
              }}
            />
          )}
          <div className="faq__question">
            Can I resell a NFT Concert I've purchased?
          </div>
        </div>
        {sf9 && (
          <div className="single__faq__expanded__div">
            <p>
              Yes. We are working to support secondary sales direct on the NFT
              Concerts platform, but until our secondary marketplace is
              functional, feel free to list your NFT Concert for sale on any
              number of secondary NFT marketplaces.
            </p>
            <p className="pad__top">
              Every NFT Concert is an ERC-1155 NFT on the Ethereum Mainnet. As
              such, they will be easily viewable on secondary NFT marketplaces
              such as{" "}
              <a href="https://x2y2.io" target="_blank">
                X2Y2
              </a>
              ,{" "}
              <a href="https://looksrare.org" target="_blank">
                LooksRare
              </a>
              , or{" "}
              <a href="https://opensea.io" target="_blank">
                OpenSea
              </a>
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf10 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf10(true);
              }}
            />
          )}
          {sf10 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf10(false);
              }}
            />
          )}
          <div className="faq__question">Do Artists get Paid?</div>
        </div>
        {sf10 && (
          <div className="single__faq__expanded__div">
            <p>
              Yes of course! NFT Concerts operates on a simple revenue split.
              Artist get 80% of the first sale of any NFT Concerts. NFT Concerts
              gets 20% of the first sale.
            </p>
            <p className="pad__top">
              Additionally, Artists can set up to a 5% secondary sale fee to
              generate additonal revenue as collectors sell and trade their NFT
              Concerts in the future. NFT Concerts will set its own 5% secondary
              sale fee in addition to any artist secondary sale fee.
            </p>
            <p className="pad__top">
              While this is higher than OpenSea an other NFT platforms, NFT
              Concerts offer content protection and distribution along the likes
              of Netflix, Amazon, and Spotify at a fraction of the percentage.
            </p>
          </div>
        )}
        <div className="single__faq__div faq__break">
          {!sf11 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf11(true);
              }}
            />
          )}
          {sf11 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf11(false);
              }}
            />
          )}
          <div className="faq__question">
            I'm an Artist/Content Owner, how do I create a NFT Concert?
          </div>
        </div>
        {sf11 && (
          <div className="single__faq__expanded__div">
            <p>Welcome! This platfom was built for you. </p>
            <p className="pad__top">
              <a href="/register">Register</a> for an account and submit our{" "}
              <a href="/apply">Artist Application</a>.
            </p>
            <p className="pad__top">
              If you have the technical skills to upload to YouTube, you can
              create a NFT Concert.
            </p>
          </div>
        )}

        <div className="single__faq__div faq__break">
          {!sf12 && (
            <i
              className="fa-solid fa-circle-plus faq__expand"
              onClick={() => {
                setSf12(true);
              }}
            />
          )}
          {sf12 && (
            <i
              className="fa-solid fa-circle-minus faq__expand"
              onClick={() => {
                setSf12(false);
              }}
            />
          )}
          <div className="faq__question">
            Can you explain this like I was born in 1960?
          </div>
        </div>
        {sf12 && (
          <div className="single__faq__expanded__div">
            <p>
              Remember bootleg concert recordings on cassette tapes? It's that,
              but legitimate.
            </p>
            <p className="pad__top">
              If you want to watch the concert recording, you need to buy the
              NFT Concert. If you own the NFT Concert you can stream the show as
              many times as you want (the same as physical media). Sell the NFT
              Concert and you lose access to the show.{" "}
            </p>
            <p className="pad__top">
              The only difference, you can't copy a NFT. There is a limited
              known quanity and competetion to Own the Show could get fierce.{" "}
            </p>
          </div>
        )}
        <div className="extra__questions__div pad__top">
          Still have questions? <a href="/contact">Get in Touch</a>
        </div>
      </div>
    </Contract>
  );
};

export default FAQs;
