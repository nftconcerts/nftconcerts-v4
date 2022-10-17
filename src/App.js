import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./components/home/Home";
import ProductionTeam from "./components/home/ProductionTeam";
import ResetPassword from "./components/register/ResetPassword";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import NftProfilePhoto from "./components/blog/posts/NftProfilePhoto";
import { PaperSDKProvider } from "@paperxyz/react-client-sdk";

import { Helmet } from "react-helmet";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const Register = lazy(() => import("./components/register/Register"));
  const Login = lazy(() => import("./components/register/Login"));
  const MyAccount = lazy(() => import("./components/register/MyAccount"));
  const AccountInfo = lazy(() => import("./components/register/AccountInfo"));
  const ArtistAccount = lazy(() =>
    import("./components/register/ArtistAccount")
  );
  const Admin = lazy(() => import("./components/register/Admin"));
  const ArtistApp = lazy(() => import("./components/register/ArtistApp"));
  const ArtistPage = lazy(() => import("./components/ArtistPage"));

  const Player = lazy(() => import("./components/Player"));
  const ContractPage = lazy(() => import("./components/ContractPage"));
  const ListingPage = lazy(() => import("./components/ListingPage"));
  const About = lazy(() => import("./components/about/About"));

  const Upload = lazy(() => import("./components/upload/Upload"));
  const TermsOfService = lazy(() =>
    import("./components/paperwork/TermsOfService")
  );
  const PrivacyPolicy = lazy(() =>
    import("./components/paperwork/PrivacyPolicy")
  );
  const FAQs = lazy(() => import("./components/paperwork/FAQs"));
  const Contact = lazy(() => import("./components/paperwork/Contact"));
  const connectors = {
    injected: {},
    walletconnect: {},
    walletLink: {
      name: "magic",
      options: {
        apiKey: process.env.REACT_APP_PUBLIC_MAGIC_LINK_API_KEY,
      },
    },
  };
  const walletConnectors = [
    "metamask",
    "walletConnect",
    "walletLink",
    {
      name: "magic",
      options: {
        apiKey: process.env.REACT_APP_PUBLIC_MAGIC_LINK_API_KEY,
      },
    },
  ];

  const Blog = lazy(() => import("./components/blog/Blog"));
  const Blog2 = lazy(() => import("./components/blog/Blog2"));

  const NftTicketingForConcerts = lazy(() =>
    import("./components/blog/posts/NftTicketingForConcerts")
  );
  const CanWeb3End2FA = lazy(() =>
    import("./components/blog/posts/CanWeb3End2FA")
  );
  const NftsAreHereToStay = lazy(() =>
    import("./components/blog/posts/NftsAreHereToStay")
  );
  const TenReasons = lazy(() => import("./components/blog/posts/TenReasons"));
  const MusicFestivalsAndNfts = lazy(() =>
    import("./components/blog/posts/MusicFestivalsAndNfts")
  );
  const NftsAreComing = lazy(() =>
    import("./components/blog/posts/NftsAreComing")
  );
  const CoachellaNfts = lazy(() =>
    import("./components/blog/posts/CoachellaNfts")
  );
  const NotJustPictures = lazy(() =>
    import("./components/blog/posts/NotJustPictures")
  );
  const MusicNftCompnaies = lazy(() =>
    import("./components/blog/posts/MusicNftCompanies")
  );
  const GetStarted = lazy(() => import("./components/blog/posts/GetStarted"));
  const NftTicketVsMusic = lazy(() =>
    import("./components/blog/posts/NftTicketVsMusic")
  );
  const NftPricingCalc = lazy(() =>
    import("./components/blog/posts/NftPricingCalc")
  );
  const TopNineMusicNfts = lazy(() =>
    import("./components/blog/posts/TopNineMusicNfts")
  );
  const ConcertNft = lazy(() => import("./components/blog/posts/ConcertNft"));
  const NftScam = lazy(() => import("./components/blog/posts/NftScam"));
  const MakeMoneyNfts = lazy(() =>
    import("./components/blog/posts/MakeMoneyNfts")
  );
  const MakeMusicNfts = lazy(() =>
    import("./components/blog/posts/MakeMusicNfts")
  );
  const NftsExplode = lazy(() => import("./components/blog/posts/NftsExplode"));
  const LiveMusicIsBack = lazy(() =>
    import("./components/blog/posts/LiveMusicIsBack")
  );
  const UnlockableNfts = lazy(() =>
    import("./components/blog/posts/UnlockableNfts")
  );
  const CollectibleNftArt = lazy(() =>
    import("./components/blog/posts/CollectibleNftArt")
  );
  const ConcertBootlegs = lazy(() =>
    import("./components/blog/posts/ConcertBootlegs")
  );
  const DonDiablo = lazy(() => import("./components/blog/posts/DonDiablo"));

  const getLibrary = (provider) => {
    const library = new Web3Provider(provider, "any");
    library.pollingInterval = 15000;
    return library;
  };

  const NotFound = lazy(() => import("./components/paperwork/NotFound"));

  window.Buffer = window.Buffer || require("buffer").Buffer;

  return (
    <ThirdwebProvider
      walletConnectors={walletConnectors}
      desiredChainId={ChainId.Mainnet}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<div className="loading__page">Loading...</div>}>
            <div className="App">
              <Nav />
              <Helmet>
                <title>NFT Concerts</title>
                <meta
                  name="description"
                  content="Own the Show - Limited Edition Concert Recordings & Studio Sessions Unlocked by NFTs"
                />
              </Helmet>
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/my-account/settings" element={<AccountInfo />} />
                <Route path="/my-account/artist" element={<ArtistAccount />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/player" element={<Player />}>
                  <Route path=":id" element={<Player />} />
                </Route>
                <Route path="/contract" element={<ContractPage />} />
                <Route path="/concert" element={<ListingPage />}>
                  <Route path=":id" element={<ListingPage />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/apply" element={<ArtistApp />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/artist" element={<ArtistPage />}>
                  <Route path=":id" element={<ArtistPage />} />
                </Route>
                <Route path="/blog/page/2" element={<Blog2 />} />
                <Route
                  path="/nft-ticketing-for-concerts-events"
                  element={<NftTicketingForConcerts />}
                />
                <Route
                  path="/can-web3-end-two-factor-authentication"
                  element={<CanWeb3End2FA />}
                />
                <Route
                  path="/nfts-are-here-to-stay"
                  element={<NftsAreHereToStay />}
                />
                <Route
                  path="/10-reasons-to-turn-your-next-performance-into-a-nft-concert"
                  element={<TenReasons />}
                />
                <Route
                  path="/music-festivals-nfts-in-2022"
                  element={<MusicFestivalsAndNfts />}
                />
                <Route
                  path="/nfts-are-coming-to-a-live-event-near-you"
                  element={<NftsAreComing />}
                />
                <Route
                  path="/what-coachella-nfts-say-about-the-future-of-music"
                  element={<CoachellaNfts />}
                />
                <Route
                  path="/nfts-are-not-just-pictures"
                  element={<NotJustPictures />}
                />
                <Route
                  path="/5-music-nft-companies-set-to-explode-in-2022"
                  element={<MusicNftCompnaies />}
                />
                <Route
                  path="/10-days-with-a-nft-profile-picture"
                  element={<NftProfilePhoto />}
                />
                <Route
                  path="/how-to-get-started-with-nfts"
                  element={<GetStarted />}
                />
                <Route
                  path="/nft-tickets-vs-nft-music-music-entertainment-nfts"
                  element={<NftTicketVsMusic />}
                />
                <Route
                  path="/how-should-i-price-my-nft-release"
                  element={<NftPricingCalc />}
                />
                <Route
                  path="/top-9-music-nfts-of-2021"
                  element={<TopNineMusicNfts />}
                />
                <Route
                  path="/5-ways-musicians-can-make-money-with-nfts"
                  element={<MakeMoneyNfts />}
                />
                <Route
                  path="/can-i-make-my-music-into-nfts"
                  element={<MakeMusicNfts />}
                />
                <Route
                  path="/nfts-explode-while-concerts-and-music-festivals-make-a-comeback"
                  element={<NftsExplode />}
                />
                <Route
                  path="/live-music-is-back-is-this-the-end-of-streaming-shows"
                  element={<LiveMusicIsBack />}
                />
                <Route path="/concert-nft" element={<ConcertNft />} />
                <Route path="/nft-scam" element={<NftScam />} />
                <Route
                  path="/nfts-and-music-a-revolution-in-distribution"
                  element={<UnlockableNfts />}
                />
                <Route
                  path="/collectible-nft-art"
                  element={<CollectibleNftArt />}
                />
                <Route
                  path="/the-past-present-and-future-of-concert-bootlegs"
                  element={<ConcertBootlegs />}
                />
                <Route
                  path="/don-diablos-600eth-1-2m-nft-concert"
                  element={<DonDiablo />}
                />
                <Route path="/production-team" element={<ProductionTeam />} />
                <Route exact path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </Suspense>
        </Router>
      </Web3ReactProvider>
    </ThirdwebProvider>
  );
}

export default App;
