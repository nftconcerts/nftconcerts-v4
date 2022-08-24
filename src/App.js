import { Suspense, lazy } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home/Home";
import ProductionTeam from "./components/home/ProductionTeam";

import ResetPassword from "./components/register/ResetPassword";

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function App() {
  const Register = lazy(() => import("./components/register/Register"));
  const Login = lazy(() => import("./components/register/Login"));
  const MyAccount = lazy(() => import("./components/register/MyAccount"));
  const Admin = lazy(() => import("./components/register/Admin"));
  const ArtistApp = lazy(() => import("./components/register/ArtistApp"));

  const Player = lazy(() => import("./components/Player"));
  const ContractPage = lazy(() => import("./components/ContractPage"));
  const ListingPage = lazy(() => import("./components/ListingPage"));

  const Upload = lazy(() => import("./components/upload/Upload"));
  const TermsOfService = lazy(() =>
    import("./components/paperwork/TermsOfService")
  );
  const FAQs = lazy(() => import("./components/paperwork/FAQs"));
  const Contact = lazy(() => import("./components/paperwork/Contact"));
  const connectors = {
    injected: {},
    walletconnect: {},
  };

  const getLibrary = (provider) => {
    const library = new Web3Provider(provider, "any");
    library.pollingInterval = 15000;
    return library;
  };

  window.Buffer = window.Buffer || require("buffer").Buffer;

  return (
    <ThirdwebProvider connectors={connectors} desiredChainId={ChainId.Mainnet}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
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
