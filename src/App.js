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
import SignUp from "./components/register/SignUp";
import MyAccount from "./components/register/MyAccount";
import ResetPassword from "./components/register/ResetPassword";
import FormBox from "./components/form/FormBox";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

function App() {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/form" element={<FormBox />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThirdwebProvider>
  );
}

function Home() {
  return (
    <div className="home__page">
      <Banner />
      <Row title="First Release" isLargeRow />
      <Row title="Trending Now" />
      <Row title="Recommended" />
      <Row title="Resale Marketplace" />
      <Row title="1/1" />
      <Row title="Latest Release" />
      <Row title="Classic Shows" />
      <Row title="Audio Only" />
      <FooterTop />
    </div>
  );
}
export default App;
