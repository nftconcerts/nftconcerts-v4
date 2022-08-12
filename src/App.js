import { useState, useEffect } from "react";
import "./App.css";
import Row from "./components/home/Row";
import Banner from "./components/Banner";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FooterTop from "./components/FooterTop";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/register/Register";
import Upload from "./components/upload/Upload";
import Login from "./components/register/Login";
import MyAccount from "./components/register/MyAccount";
import ResetPassword from "./components/register/ResetPassword";
import FormBox from "./components/form/FormBox";
import {
  ThirdwebProvider,
  ChainId,
  useNetworkMismatch,
  useNetwork,
} from "@thirdweb-dev/react";
import Player from "./components/Player";
import ContractPage from "./components/ContractPage";
import ListingPage from "./components/ListingPage";
import Home from "./components/home/Home";
import { ref as dRef, onValue } from "firebase/database";
import { db, fetchCurrentUser } from "./firebase";
import Admin from "./components/register/Admin";
import ArtistApp from "./components/register/ArtistApp";

function App() {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/form" element={<FormBox />} />
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
      </Router>
    </ThirdwebProvider>
  );
}

export default App;
