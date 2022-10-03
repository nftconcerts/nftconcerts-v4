import React, { useState, useEffect } from "react";
import "./Login.css";
import FormBox from "../form/FormBox";
import {
  login,
  logout,
  fetchCurrentUser,
  truncateAddress,
  setMobileMode,
  db,
} from "./../../firebase";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import { ref as dRef, set, update, onValue } from "firebase/database";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import WalletLink from "walletlink";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [errorMsg, setErrorMessage] = useState("");
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const [userData, setUserData] = useState();
  const [wcAddress, setWcAddress] = useState();
  const [cbAddress, setCbAddress] = useState();

  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  let navigate = useNavigate();
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  //download User Data
  useEffect(() => {
    if (tempUser) {
      var userDataRef = dRef(db, "users/" + tempUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    } else if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [tempUser, currentUser]);

  const inlineLogout = () => {
    logout();
    setTempUser(null);
    setCurrentUser(null);
    window.location.reload();
  };

  const inlineLogin = async () => {
    await login(email, password);
    setTempUser(fetchCurrentUser());
    logout();
  };

  const confirmUser = async () => {
    await login(email, password);
    setCurrentUser(tempUser);
    navigate("/");
    window.location.reload();
  };

  //wallet connenct variables
  const [web3Library, setWeb3Library] = React.useState();
  const [web3Account, setWeb3Account] = React.useState();
  const [walletlinkProvider, setWalletlinkProvider] = React.useState();
  const [walletConnectProvider, setWalletConnectProvider] = React.useState();

  //vanilla walletconnect
  const connectWalletConnect = async () => {
    try {
      const RPC_URLS = {
        1: "https://mainnet.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4",
        4: "https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4",
      };
      const provider = new WalletConnectProvider({
        rpc: {
          1: RPC_URLS[1],
          4: RPC_URLS[4],
        },
        qrcode: true,
        pollingInterval: 15000,
      });
      setWalletConnectProvider(provider);
      const accounts = await provider.enable();
      const account = accounts[0];

      const library = new Web3Provider(provider, "any");

      setWeb3Library(library);
      setWeb3Account(account);
      setWcAddress(account);
    } catch (ex) {
      console.log(ex);
    }
  };
  const disconnectWalletConnect = () => {
    walletConnectProvider.disconnect();
    setWalletConnectProvider(null);
  };
  //vanilla coinbase
  const connectCoinbase = async () => {
    try {
      // Initialize WalletLink
      const walletLink = new WalletLink({
        appName: "NFT Concerts",
        darkMode: true,
      });

      const provider = walletLink.makeWeb3Provider(
        "https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4",
        4
      );
      setWalletlinkProvider(provider);
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      const library = new Web3Provider(provider, "any");

      setWeb3Library(library);
      setWeb3Account(account);
      setCbAddress(account);
    } catch (ex) {
      console.log(ex);
    }
  };
  const disconnectCoinbase = () => {
    walletlinkProvider.close();
    setWalletlinkProvider(null);
  };

  return (
    <FormBox>
      {!currentUser && !tempUser && (
        <div className="login__form">
          <div className="email__login">
            <h3 className="login__heading">Please Log In to Your Account</h3>
            <label>Email</label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                inlineLogin();
              }}
            >
              <input
                placeholder="Email"
                name="email"
                className="login__input"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
              <label>Password</label>
              <input
                placeholder="Password"
                name="password"
                type="password"
                className="login__input"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
              <input type="submit" value="Log In" className="login__button" />
            </form>
            <div className="reset__password">
              <a href="/reset-password">Forgot Password?</a>
            </div>
          </div>
          <div className="or__split">
            <h3>Featuring Two-Factor Authentication </h3>
            <div className="new__user__prompt">
              New User? <a href="/register">Register Now!</a>
            </div>
          </div>
        </div>
      )}
      {tempUser && !currentUser && (
        <div className="temp__user__box">
          <div className="temp__user__info">
            <p className="info__p">Logging in as</p>
            <p className="info__p"> {tempUser.user.displayName}</p>
            <p className="info__p"> {tempUser.user.email}</p>

            {userData?.connectionType === "metamask" && (
              <>
                {" "}
                {address && address === userData?.walletID && (
                  <>
                    <input
                      type="button"
                      value="Address Confirmed - Login"
                      className="register__button"
                      onClick={confirmUser}
                      disabled={false}
                    />

                    <div className="connected__info">
                      Connected as {truncateAddress(address)}
                    </div>
                  </>
                )}
                {address && address !== userData?.walletID && (
                  <>
                    <input
                      type="button"
                      value="Wrong Address"
                      className="register__button"
                      onClick={() => {
                        disconnect();
                      }}
                    />
                    <div className="connected__info">
                      <p className="current__wallet">
                        Connected as {truncateAddress(address)}
                      </p>
                      <p className="necessary__wallet">
                        Please switch to {truncateAddress(userData?.walletID)}
                      </p>
                    </div>
                  </>
                )}
                {!address && (
                  <div className="temp__buttons">
                    <input
                      type="button"
                      value="Confirm with MetaMask"
                      className="register__button"
                      onClick={connectWithMetamask}
                    />

                    <input
                      type="button"
                      value="Mobile Mode (Limited)"
                      className="register__button"
                      onClick={() => {
                        setMobileMode();
                        confirmUser();
                      }}
                    />
                  </div>
                )}
              </>
            )}
            {userData?.connectionType === "walletconnect" && (
              <>
                {!wcAddress && (
                  <div className="temp__buttons">
                    <input
                      type="button"
                      value="Confirm with Wallet Connect"
                      className="register__button"
                      onClick={connectWalletConnect}
                    />

                    <input
                      type="button"
                      value="Mobile Mode (Limited)"
                      className="register__button"
                      onClick={() => {
                        setMobileMode();
                        confirmUser();
                      }}
                    />
                  </div>
                )}
                {wcAddress && wcAddress !== userData?.walletID && (
                  <>
                    <input
                      type="button"
                      value="Wrong Address - Disconnect"
                      className="register__button"
                      onClick={() => {
                        disconnectWalletConnect();
                        setWcAddress("");
                      }}
                    />
                    <div className="connected__info">
                      <p className="current__wallet">
                        Connected as {truncateAddress(wcAddress)}
                      </p>
                      <p className="necessary__wallet">
                        {/* Please switch to {truncateAddress(userData?.walletID)} */}
                      </p>
                    </div>
                  </>
                )}
                {wcAddress && wcAddress === userData?.walletID && (
                  <>
                    <input
                      type="button"
                      value="Address Confirmed - Login"
                      className="register__button"
                      onClick={confirmUser}
                      disabled={false}
                    />
                    <div className="connected__info">
                      Connected as {truncateAddress(wcAddress)}
                    </div>
                  </>
                )}
              </>
            )}
            {userData?.connectionType === "coinbase" && (
              <>
                {!cbAddress && (
                  <div className="temp__buttons">
                    <input
                      type="button"
                      value="Confirm with Coinbase"
                      className="register__button"
                      onClick={connectCoinbase}
                    />

                    <input
                      type="button"
                      value="Mobile Mode (Limited)"
                      className="register__button"
                      onClick={() => {
                        setMobileMode();
                        confirmUser();
                      }}
                    />
                  </div>
                )}
                {cbAddress && cbAddress !== userData?.walletID && (
                  <>
                    <input
                      type="button"
                      value="Wrong Address - Disconnect"
                      className="register__button"
                      onClick={() => {
                        disconnectCoinbase();
                        setCbAddress("");
                      }}
                    />
                    <div className="connected__info">
                      <p className="current__wallet">
                        Connected as {truncateAddress(cbAddress)}
                      </p>
                      <p className="necessary__wallet">
                        Please switch to {truncateAddress(userData?.walletID)}
                      </p>
                    </div>
                  </>
                )}
                {cbAddress && cbAddress === userData?.walletID && (
                  <>
                    <input
                      type="button"
                      value="Address Confirmed - Login"
                      className="register__button"
                      onClick={confirmUser}
                      disabled={false}
                    />
                    <div className="connected__info">
                      Connected as {truncateAddress(cbAddress)}
                    </div>
                  </>
                )}
              </>
            )}
            {userData?.connectionType === "managedWallet" && (
              <>
                <>
                  <input
                    type="button"
                    value="Confirm Login"
                    className="register__button"
                    onClick={confirmUser}
                    disabled={false}
                  />
                </>
              </>
            )}
          </div>

          <div className="temp__user__logout__div">
            <input
              type="button"
              value="Switch Account"
              className="register__button switch__button"
              onClick={inlineLogout}
            />
          </div>
        </div>
      )}
      {currentUser && (
        <div className="login__form">
          <div className="logged__in__already">
            <p>Currently Logged in as </p>
            <p className="logged__in__email">{currentUser?.user.displayName}</p>
            <p className="logged__in__email">{currentUser?.user.email}</p>
            {userData?.walletID && (
              <p className="logged__in__email">
                {truncateAddress(userData?.walletID)}
                {networkMismatch}
              </p>
            )}
            <button
              className="login__button logout__button"
              onClick={inlineLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </FormBox>
  );
}

export default Login;
