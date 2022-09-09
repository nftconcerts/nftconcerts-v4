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
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "GTM-000000",
};

TagManager.initialize(tagManagerArgs);

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
  const Admin = lazy(() => import("./components/register/Admin"));
  const ArtistApp = lazy(() => import("./components/register/ArtistApp"));

  const Player = lazy(() => import("./components/Player"));
  const ContractPage = lazy(() => import("./components/ContractPage"));
  const ListingPage = lazy(() => import("./components/ListingPage"));
  const About = lazy(() => import("./components/about/About"));

  const Upload = lazy(() => import("./components/upload/Upload"));
  const TermsOfService = lazy(() =>
    import("./components/paperwork/TermsOfService")
  );
  const FAQs = lazy(() => import("./components/paperwork/FAQs"));
  const Contact = lazy(() => import("./components/paperwork/Contact"));
  const connectors = [
    "walletConnect",
    { name: "injected", options: { shimDisconnect: false } },
    {
      name: "walletLink",
      options: {
        appName: "NFT Concerts",
      },
    },
    {
      name: "magic",
      options: {
        apiKey: process.env.REACT_APP_MAGIC_API_KEY,
        rpcUrls: {
          [ChainId.Mainnet]: "https://mainnet.infura.io/v3",
        },
      },
    },
  ];

  const getLibrary = (provider) => {
    const library = new Web3Provider(provider, "any");
    library.pollingInterval = 15000;
    return library;
  };

  window.Buffer = window.Buffer || require("buffer").Buffer;

  return (
    <ThirdwebProvider
      walletConnectors={connectors}
      desiredChainId={ChainId.Mainnet}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<div className="loading__page">Loading...</div>}>
            <div className="App">
              <Nav />
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/player" element={<Player />} />
                <Route path="/contract" element={<ContractPage />} />
                <Route path="/concert" element={<ListingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/apply" element={<ArtistApp />} />
                <Route path="/home" element={<Home />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contact" element={<Contact />} />
                <Route exact path="/" element={<ProductionTeam />} />
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
