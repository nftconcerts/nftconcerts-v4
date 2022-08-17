import { Suspense, lazy } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home/Home";

import ResetPassword from "./components/register/ResetPassword";

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

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

  return (
    <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
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
              <Route exact path="/" element={<Home />} />
            </Routes>
            <Footer />
          </div>
        </Suspense>
      </Router>
    </ThirdwebProvider>
  );
}

export default App;
