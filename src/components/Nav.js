import React, { useEffect, useState } from "react";
import "./Nav.css";
import {
  auth,
  logout,
  fetchCurrentUser,
  setMobileMode,
  getMobileMode,
  resetMobileMode,
  truncateAddress,
} from "./../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  ref as dRef,
  set,
  get,
  onValue,
  onDisconnect,
} from "firebase/database";
import { db } from "./../firebase";
import {
  useAddress,
  useNetwork,
  useNetworkMismatch,
  ChainId,
  useMetamask,
  useTokenBalance,
  ThirdwebProvider,
  useWalletConnect,
  useDisconnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { GetUSDExchangeRate, GetMaticUSDExchangeRate, getGas } from "./api";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import checkProductionTeam from "../scripts/checkProductionTeam";
import checkEthBalance from "../scripts/checkEthBalance";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Nav = () => {
  const [show, handleShow] = useState(false);
  const [menuPopup, handleMenuPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser());
  const [userData, setUserData] = useState();
  const [adminUser, setAdminUser] = useState(false);
  const [artistUser, setArtistUser] = useState(false);
  const navigate = useNavigate();
  const disconnect = useDisconnect();
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const [navMobileMode, setNavMobileMode] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const [ethBalance, setEthBalance] = useState("0.00");
  const [maticBalance, setMaticBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState();
  const [metamaskDetected, setMetamaskDetected] = useState(false);
  const [usdExRate, setUsdExRate] = useState();
  const [balanceInUSD, setBalanceInUSD] = useState("0.00");
  const [gasPrice, setGasPrice] = useState();
  const [apiRefresh, setApiRefresh] = useState();
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [userConnectionType, setUserConnectionType] = useState();

  //eth to usd api call
  useEffect(() => {
    Refresh(10);
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
    getGas()
      .then((res) => {
        if (res) {
          setGasPrice(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, [apiRefresh]);

  //price formatting
  useEffect(() => {
    if (usdExRate && ethBalance) {
      var newPrice = ethBalance * usdExRate;

      let roundedPrice = newPrice.toFixed(2);

      setBalanceInUSD(roundedPrice);
    } else setBalanceInUSD("err");
  }, [usdExRate, ethBalance]);

  //check if mobile mode is enabled.
  useEffect(() => {
    setNavMobileMode(getMobileMode());
  }, [networkMismatch]);

  const Refresh = async (time) => {
    await delay(time * 1000);
    setApiRefresh(!apiRefresh);
  };

  const scrollClr = () => {};

  //change background color on scroll
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll", scrollClr);
    };
  }, []);

  //pop menu
  const menuPop = () => {
    setCurrentUser(fetchCurrentUser());
    if (menuPopup) {
      handleMenuPopup(false);
    } else {
      handleMenuPopup(true);
    }
  };

  //get user data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, []);

  //check if user is admin or artist
  useEffect(() => {
    if (userData?.userType === "admin") {
      setAdminUser(true);
    } else if (userData?.userType === "artist") {
      setArtistUser(true);
    } else {
      setAdminUser(false);
      setArtistUser(false);
    }
  }, [currentUser, userData]);

  //logout user from menu
  const menuLogout = async () => {
    await logout();
    menuPop();
    disconnect();
    navigate("/");
    window.location.reload();
  };

  //check if metamask is detected and set wallet address
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }

    if (address) {
      setEthBalance(checkEthBalance(address));
    } else if (userData?.walletID) {
      setEthBalance(checkEthBalance(userData?.walletID));
    }
  }, [address, userData, networkMismatch]);

  //determine what type of connection used by user
  useEffect(() => {
    if (userData?.connectionType) {
      setUserConnectionType(userData?.connectionType);
    }
  }, [currentUser, userData]);

  //check if user is holding production team NFT
  const [productionTeam, setProductionTeam] = useState(false);

  const productionCheck = async () => {
    if (address) {
      var checkResult = await checkProductionTeam(address);
      if (checkResult[0] > 0) {
        setProductionTeam(true);
      } else if (checkResult[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    } else if (!address && userData?.walletID) {
      var checkResultMobile = await checkProductionTeam(userData.walletID);
      if (checkResultMobile[0] > 0) {
        setProductionTeam(true);
      } else if (checkResultMobile[1] > 0) {
        setProductionTeam(true);
      } else {
        setProductionTeam(false);
      }
    }
  };

  //check user eth balance and update
  const ethBalanceCheck = async () => {
    if (address) {
      var currentBalance = await checkEthBalance(address);
      setEthBalance(currentBalance);
    } else if (userData?.walletID) {
      var mobileBalance = await checkEthBalance(userData?.walletID);
      setEthBalance(mobileBalance);
    }
  };

  useEffect(() => {
    productionCheck();
    ethBalanceCheck();
  }, [address, userData]);

  return (
    <div className="total_nav">
      {navMobileMode && userData && (
        <div className="network__mismatch__div">
          <div className="network__mismatch__prompt wallet__balance__prompt">
            <div className="wallet__prompt__top">
              <div className="icon__spacer__div"> </div>
              <div>
                Welcome {userData?.name}{" "}
                {!userData && address && <>{truncateAddress(address)}</>}
              </div>
              <div
                className="wallet__info__icon"
                onClick={() => {
                  setShowWalletInfo(!showWalletInfo);
                }}
              >
                <i className="fa-solid fa-wallet" />
              </div>
            </div>
            {showWalletInfo && (
              <div className="two__buttons__div">
                <button
                  className="network__prompt__button buy__matic__button full__width__button"
                  onClick={() => {
                    window.open(
                      `https://pay.sendwyre.com/purchase?&destCurrency=ETH&utm_medium=widget&paymentMethod=debit-card&autoRedirect=false&dest=matic%3A${address}&utm_source=checkout`
                    );
                  }}
                >
                  {ethBalance && (
                    <span>ETH: {ethBalance.substring(0, 6) || "0.00"} </span>
                  )}
                  <span className="wallet__usd__bal">(${balanceInUSD})</span>
                </button>
                <div className="gas__div">
                  <i className="fa-solid fa-gas-pump" />
                  {gasPrice}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!navMobileMode && (
        <>
          {userConnectionType === "metamask" && (
            <>
              {address && networkMismatch && (
                <div className="network__mismatch__div">
                  <div className="network__mismatch__prompt">
                    Wrong Network. Switch to Mainnet{" "}
                    <div className="two__buttons__div">
                      <button
                        onClick={() => switchNetwork(ChainId.Mainnet)}
                        className="network__prompt__button"
                      >
                        Switch to Ethereum
                      </button>
                      <button
                        className="network__prompt__button network__prompt__button__right"
                        onClick={() => {
                          setMobileMode();
                          setNavMobileMode(true);
                          window.location.reload(false);
                        }}
                      >
                        Use in Mobile Mode
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {address && !networkMismatch && (
                <div className="network__mismatch__div">
                  <div className="network__mismatch__prompt wallet__balance__prompt">
                    <div className="wallet__prompt__top">
                      <div className="icon__spacer__div"> </div>
                      <div>
                        Welcome {userData?.name}{" "}
                        {!userData && address && (
                          <>{truncateAddress(address)}</>
                        )}
                      </div>
                      <div
                        className="wallet__info__icon"
                        onClick={() => {
                          setShowWalletInfo(!showWalletInfo);
                        }}
                      >
                        <i className="fa-solid fa-wallet" />
                      </div>
                    </div>
                    {showWalletInfo && (
                      <div className="two__buttons__div">
                        <button
                          className="network__prompt__button buy__matic__button full__width__button"
                          onClick={() => {
                            window.open(
                              `https://pay.sendwyre.com/purchase?&destCurrency=ETH&utm_medium=widget&paymentMethod=debit-card&autoRedirect=false&dest=matic%3A${address}&utm_source=checkout`
                            );
                          }}
                        >
                          {ethBalance && (
                            <span>
                              ETH: {ethBalance.substring(0, 6) || "0.00"}{" "}
                            </span>
                          )}
                          <span className="wallet__usd__bal">
                            (${balanceInUSD})
                          </span>
                        </button>
                        <div className="gas__div">
                          <i className="fa-solid fa-gas-pump" />
                          {gasPrice}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!address && (
                <div className="network__mismatch__div">
                  <div className="network__mismatch__prompt">
                    Not Connected to Web3.{" "}
                    <div className="two__buttons__div">
                      <button
                        onClick={connectWithMetamask}
                        className="network__prompt__button "
                      >
                        Use MetaMask
                      </button>
                      <button
                        className="network__prompt__button network__prompt__button__right"
                        onClick={() => {
                          setMobileMode();
                          setNavMobileMode(true);
                          window.location.reload(false);
                        }}
                      >
                        Use in Mobile Mode
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {userConnectionType !== "metamask" && walletAddress && currentUser && (
            <div className="network__mismatch__div">
              <div className="network__mismatch__prompt wallet__balance__prompt">
                <div className="wallet__prompt__top">
                  <div className="icon__spacer__div"> </div>
                  <div>
                    Welcome {userData?.name}{" "}
                    {!userData && address && <>{truncateAddress(address)}</>}
                  </div>
                  <div
                    className="wallet__info__icon"
                    onClick={() => {
                      setShowWalletInfo(!showWalletInfo);
                    }}
                  >
                    <i className="fa-solid fa-wallet" />
                  </div>
                </div>
                {showWalletInfo && (
                  <div className="two__buttons__div">
                    <button
                      className="network__prompt__button buy__matic__button full__width__button"
                      onClick={() => {
                        window.open(
                          `https://pay.sendwyre.com/purchase?&destCurrency=ETH&utm_medium=widget&paymentMethod=debit-card&autoRedirect=false&dest=matic%3A${address}&utm_source=checkout`
                        );
                      }}
                    >
                      <span>ETH: {ethBalance.substring(0, 6)} </span>
                      <span className="wallet__usd__bal">
                        (${balanceInUSD})
                      </span>
                    </button>
                    <div className="gas__div">
                      <i className="fa-solid fa-gas-pump" />
                      {gasPrice}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!currentUser && (
            <div className="network__mismatch__div">
              <div className="network__mismatch__prompt wallet__balance__prompt">
                Welcome to NFT Concerts
                <div className="two__buttons__div">
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="network__prompt__button"
                  >
                    Login
                  </button>
                  <button
                    className="network__prompt__button network__prompt__button__right"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!address && metamaskDetected && navMobileMode && (
        <div className="network__mismatch__div mobile__hide">
          <div className="network__mismatch__prompt">
            Mobile Mode Enabled.
            <div className="two__buttons__div">
              <button
                onClick={() => {
                  connectWithMetamask();
                }}
                className="network__prompt__button"
              >
                Use Metamask
              </button>
              <button
                className="network__prompt__button network__prompt__button__right"
                onClick={() => {
                  connectWithWalletConnect();
                }}
              >
                Use Wallet Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {navMobileMode && (
        <div className="network__mismatch__div nav__mobile__hide">
          <div className="network__mismatch__prompt">
            Moblie Mode Enabled{" "}
            <div className="two__buttons__div">
              <button
                onClick={() => {
                  resetMobileMode();
                  setNavMobileMode(false);
                  connectWithMetamask();
                  window.location.reload(false);
                }}
                className="network__prompt__button full__width__button"
              >
                Connect to Web3
              </button>
            </div>
          </div>
        </div>
      )} */}
      {address && currentUser && <div className="user__wallet"></div>}
      <div className={`nav ${show && "nav__black"}`}>
        <img
          className="nav__logo"
          src="https://nftconcerts.com/wp-content/uploads/2021/02/arc-logo-600x190-White-1.png"
          alt="NFT Concerts Logo"
          onClick={() => {
            if (productionTeam) {
              navigate("/home");
            } else {
              navigate("/");
            }
          }}
        />

        <img
          className="nav__avatar"
          src="https://nftconcerts.com/wp-content/uploads/2022/01/NFTC-Icon-2022-512x512-web.png"
          alt="NFT Concerts Icon"
          onClick={menuPop}
        />
      </div>
      {menuPopup && (
        <div className="menu__pop">
          {currentUser == null && (
            <>
              <div
                className="menu__item"
                onClick={() => {
                  menuPop();
                  navigate("/register");
                }}
              >
                Register Now
              </div>
              <div
                className="menu__item"
                onClick={() => {
                  menuPop();
                  navigate("/login");
                }}
              >
                Login
              </div>{" "}
              <a
                href="https://nftconcerts.com/about"
                className="menu__item"
                onClick={menuPop}
              >
                Learn More..
              </a>
            </>
          )}
          {currentUser && !artistUser && !adminUser && (
            <>
              {" "}
              <div
                className="menu__item"
                onClick={() => {
                  menuPop();
                  navigate("/my-account");
                }}
              >
                My Account
              </div>
              <div
                className="menu__item"
                onClick={() => {
                  menuPop();
                  navigate("/home");
                }}
              >
                Discover
              </div>
              <div className="menu__item" onClick={menuLogout}>
                Logout
              </div>
            </>
          )}
          {currentUser && artistUser && (
            <>
              {" "}
              <div
                href="/my-account"
                className="menu__item"
                onClick={() => {
                  menuPop();
                  navigate("/my-account");
                }}
              >
                My Account
              </div>
              <div
                className="menu__item"
                onClick={() => {
                  menuPop();
                  navigate("/upload");
                }}
              >
                Upload
              </div>
              <div className="menu__item" onClick={menuLogout}>
                Logout
              </div>
            </>
          )}
          {currentUser && adminUser && (
            <>
              {" "}
              <a href="/my-account" className="menu__item" onClick={menuPop}>
                My Account
              </a>
              <a href="/admin" className="menu__item" onClick={menuPop}>
                Admin Panel
              </a>
              <a href="/upload" className="menu__item" onClick={menuPop}>
                Upload
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Nav;
