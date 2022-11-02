import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import "./ListingPage.css";
import "./upload/Confirmation.css";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  db,
  fetchCurrentUser,
  truncateAddress,
  getMobileMode,
} from "../firebase";
import { ref as dRef, onValue } from "firebase/database";
import dateFormat from "dateformat";
import { GetUSDExchangeRate } from "./api";
import FormBox from "./form/FormBox";
import {
  useActiveClaimCondition,
  useContractData,
  useEditionDrop,
  useContract,
} from "@thirdweb-dev/react";
import editionDrop, { editionDropAddress } from "../scripts/getContract.mjs";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import emailjs from "@emailjs/browser";
import { PaperCheckout } from "@paperxyz/react-client-sdk";
import sendMintEmails from "../scripts/sendMintEmails";
import MintPopUp from "./MintPopUp";
import { Helmet } from "react-helmet";

const ListingPage = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  let oldID = parseInt(searchParams.get("id"));
  let concertID = id;
  const [concertData, setConcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [formatPrice, setFormatPrice] = useState("");
  const [validListing, setValidListing] = useState(false);
  const [metamaskDetected, setMetamaskDetected] = useState(false);

  let bigId = ethers.BigNumber.from(concertID || 0);
  const { contract } = useContract(editionDropAddress, "edition-drop");
  const { data: activeClaimCondition } = useActiveClaimCondition(
    contract,
    bigId
  );
  let address = useAddress();
  let pageMobileMode = getMobileMode();
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (oldID) {
      navigate("/concert/" + oldID);
    }
  });

  //format concert eth price
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice) < 1) {
      setFormatPrice(parseFloat(concertData?.concertPrice));
    } else setFormatPrice(parseFloat(concertData?.concertPrice));
  }, [concertData]);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
    if (typeof window.ethereum !== "undefined") {
      setMetamaskDetected(true);
    }
  }, []);

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  //price formatting
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice)) {
      var newPrice = parseFloat(concertData?.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (concertData?.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

  //pull individual concert data
  useEffect(() => {
    if (concertID) {
      var concertDataRef = dRef(db, "concerts/" + concertID + "/");
      onValue(concertDataRef, (snapshot) => {
        var cData = snapshot.val();
        setConcertData(cData);
      });
    }
  }, [currentUser, concertID]);

  //download User Data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  //check if listing is valid

  useEffect(() => {
    if (concertData?.listingApproval === "Approved") {
      setValidListing(true);
    }
  }, [concertData]);

  //custom twitter share link
  var twitterLink =
    "https://twitter.com/intent/tweet?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Listen%20to%20this%20insane%20performance%20by%20" +
    encodeURI(concertData?.concertArtist) +
    "%20available%20exclusively%20on%20%40nftconcerts%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0APick%20up%20a%20copy%20(if%20you%20can)%20and%20check%20it%20out%20-%3E%20https%3A%2F%2Fnftconcerts.com%2Fconcert%3Fid%3D" +
    concertID +
    "%0A%0A%23nftconcerts%20%23livemusic%20%23nfts%20";

  //displays the songs.
  const displaySongs = () => {
    var songRows = [];
    var rowNums = parseInt(concertData?.concertNumSongs);
    if (concertData?.concertNumSongs === "") {
      return (
        <div className="no__songs__error">Please set the number of songs.</div>
      );
    } else {
      for (var i = 1; i <= rowNums; i++) {
        const songDiv = (n) => {
          return (
            <div className=" player__song__div">
              <p className="player__song__num">{n}:</p>
              <p className=" player__song__n">
                <span className="song__emp">
                  {""} {concertData?.concertSetList[n - 1]}
                </span>
              </p>
            </div>
          );
        };
        songRows.push(songDiv(i));
      }
      return songRows;
    }
  };

  //claim button

  const editionDropped = useEditionDrop(editionDropAddress);

  // State to track when a user is claiming an NFT
  const [claiming, setClaiming] = useState(false);
  const [tx, setTx] = useState();
  const [purchased, setPurchased] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);
  var transactionLink =
    "https://etherscan.io/tx/" + tx?.receipt.transactionHash;

  // Claim our NFT with the claim method - (token id, quantity)
  const [mintQty, setMintQty] = useState(1);
  let mintPrice = mintQty * parseFloat(concertData?.concertPrice);
  const claimButton = async () => {
    setClaiming(true);
    try {
      var result = await editionDropped?.claim(concertID, mintQty);
      setTx(result);
      setClaiming(false);
      setPurchased(true);
      setShowPurchased(true);
      setOwned(owned + 1);
      let currentEmail = userData.email;
      var template_params = {
        artistemail: concertData.uploaderEmail,
        artist: concertData.concertArtist,
        concertName: concertData.concertName,
        buyerName: userData.name,
        buyerEmail: currentEmail,
        mintQty: mintQty,
        mintPrice: mintPrice,
        remaining: activeClaimCondition?.availableSupply,
        concertSupply: concertData.concertSupply,
      };
      sendMintEmails(template_params);
    } catch (error) {
      console.log("Failed to claim. Error: ", error);
      console.log(error.message);
      setClaiming(false);
    }
  };

  // Check if user owns the current NFT Concert
  const [owned, setOwned] = useState(0);

  useEffect(() => {
    const checkIfOwned = async (userAddress) => {
      try {
        const balance = await editionDropped.balanceOf(userAddress, concertID);
        const balanceNum = parseInt(balance.toString());
        setOwned(balanceNum);
      } catch (err) {
        console.log("Fucked up check.");
      }
    };
    if (userData?.walletID) {
      checkIfOwned(userData?.walletID);
    }
  }, [userData]);

  const [showMintPopUp, setShowMintPopUp] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  let titleID = parseInt(concertID) + 1;
  const [listView, setListview] = useState(false);

  const resaleFee = parseFloat(concertData?.concertResaleFee) + 5;

  //control the list maximum
  const [maxList, setMaxList] = useState(8);
  const [showExpandList, setShowExpandList] = useState(true);

  //show the audience list based on spply and sales data
  const showAudienceList = () => {
    var audienceRows = [];

    if (concertData?.concertSupply === "") {
      return (
        <div className="no__songs__error">Please set the number of tokens.</div>
      );
    } else {
      for (var i = 1; i <= maxList; i++) {
        var sale = concertData.sales[i - 1];

        const rowDiv = (n) => {
          var saledate;
          var buyerData;
          if (sale) {
            saledate = new Date(sale.date);
            var buyerDataRef = dRef(db, "users/" + sale.buyerUID);
            onValue(buyerDataRef, (snapshot) => {
              var data = snapshot.val();
              buyerData = data;
            });
          }
          return (
            <div className=" audience__list__div">
              <p className="list__token__num">{n}:</p>
              <p className=" list__tx__date">
                <span className="song__emp">
                  {" "}
                  {(sale && (
                    <>
                      {saledate.toLocaleTimeString() +
                        ", " +
                        saledate.toLocaleDateString()}
                    </>
                  )) ||
                    "Not Minted"}
                </span>
              </p>
              <p className=" list__audience__name">
                <span className="song__emp">{buyerData?.name}</span>
              </p>
              <div className="list__audience__member__image__div">
                {(sale && (
                  <img
                    src={buyerData?.image}
                    className="audience__member__image list__audience__member__image"
                  />
                )) || (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fmissing%20m1.jpg?alt=media&token=3d1222d8-711f-4bc4-a074-b7d4f77268a1"
                    className="audience__member__image list__audience__member__image empty__member"
                  />
                )}
              </div>
              <div className="marketplace__icon__div list__icon__div">
                {(sale && (
                  <a
                    href={"https://etherscan.io/tx/" + sale.tx}
                    className="marketplace__icon__div list__icon__div"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="/media/etherscan-logo.png"
                      className="marketplace__icon"
                      alt="Etherscan Logo"
                    />
                  </a>
                )) || (
                  <img
                    src="/media/etherscan-logo.png"
                    className="marketplace__icon"
                    alt="Etherscan Logo"
                  />
                )}
              </div>
            </div>
          );
        };
        audienceRows.push(rowDiv(i));
      }
      return audienceRows;
    }
  };

  //show the audience based on the supply and sales data

  const [maxAudience, setMaxAudience] = useState(10);
  const [showExpandAudience, setShowExpandAudience] = useState(true);
  const [width, setWidth] = useState();

  useEffect(() => {
    console.log("w: ", width);
    if (!showExpandAudience) {
    } else if (maxAudience > parseInt(concertData?.concertSupply)) {
      setMaxAudience(concertData.concertSupply);
      setShowExpandAudience(false);
    } else if (width > 2016) {
      setMaxAudience(18);
    } else if (width > 1686) {
      setMaxAudience(15);
    } else if (width > 1356) {
      setMaxAudience(16);
    } else if (width > 1026) {
      setMaxAudience(12);
    } else if (width > 936) {
      setMaxAudience(15);
    } else if (width > 756) {
      setMaxAudience(16);
    } else if (width > 576) {
      setMaxAudience(12);
    } else {
      setMaxAudience(10);
    }
  }, [width, concertData]);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };
  const showAudience = () => {
    var audienceRows = [];
    var supply = parseInt(concertData?.concertSupply);
    for (var i = 0; i < maxAudience; i++) {
      var sale = concertData.sales[i];

      const audience = (i) => {
        var saledate;
        var buyerData;
        if (sale) {
          saledate = new Date(sale.date);
          var buyerDataRef = dRef(db, "users/" + sale.buyerUID);
          onValue(buyerDataRef, (snapshot) => {
            var data = snapshot.val();
            buyerData = data;
          });
        }
        return (
          <div className="audience__member__div">
            {(sale && (
              <div className="sales__div">
                <div className="sale__hover__div">
                  <div className="hover__buyer__name">{buyerData?.name}</div>
                  <div className="hover__buyer__date">
                    <div className="hover__date__text">
                      {saledate.toLocaleTimeString() +
                        ", " +
                        saledate.toLocaleDateString()}
                    </div>
                    <div className="hover__eth__logo__div">
                      <a
                        href={"https://etherscan.io/tx/" + sale.tx}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/media/etherscan-logo.png"
                          alt="Etherscan Logo"
                          className="hover__eth__logo"
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src={buyerData?.image}
                  className="audience__member__image"
                />
              </div>
            )) || (
              <div className="sales__div">
                <div className="not__minted__div">
                  <div class="hover__text">Not Minted</div>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/nftconcerts-v1.appspot.com/o/images%2Fmissing%20m1.jpg?alt=media&token=3d1222d8-711f-4bc4-a074-b7d4f77268a1"
                    className="audience__member__image empty__member"
                  />
                </div>
              </div>
            )}
          </div>
        );
      };

      audienceRows.push(audience(i));
    }

    return (
      <>
        <div className="audience__view__div">
          {(listView && (
            <button
              onClick={() => {
                setListview(false);
                setMaxList(8);
                setShowExpandList(true);
              }}
              className="audience__view__button"
            >
              <i className="fa-solid fa-people-group" />
            </button>
          )) || (
            <button
              onClick={() => {
                setListview(true);
              }}
              className="audience__view__button"
            >
              <i className="fa-solid fa-list" />
            </button>
          )}{" "}
        </div>
        <div className="audience__header">
          <h3>Audience</h3>
        </div>
        {(listView && (
          <div className="list__view__div">
            <div className="list__div">
              <div className="audience__list__header">
                <p className="list__token__header">Mint #</p>
                <p className="list__tx__date__header">Date</p>
                <p className="list__audience__name__header">Collector</p>
                <p className="list__tx__header">Tx</p>
              </div>
              <div className="audience__list__container__div">
                {showAudienceList()}
              </div>
              {(showExpandList && (
                <div className="expand__list__container">
                  <div className="expand__list__div">
                    <button
                      onClick={() => {
                        setMaxList(concertData?.concertSupply);
                        setShowExpandList(false);
                      }}
                      className="expand__list__button"
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                  </div>
                </div>
              )) || (
                <div className="close__list__floating__container">
                  <div className="close__list__floating__div">
                    {" "}
                    <button
                      onClick={() => {
                        setMaxList(8);
                        setShowExpandList(true);
                      }}
                      className="expand__list__button  collapse__list__button"
                    >
                      <i className="fa-solid fa-minus" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )) || (
          <>
            {" "}
            <div className="stadium__view__div">
              {audienceRows}{" "}
              {(showExpandAudience && (
                <div className="expand__audience__container">
                  <div className="expand__audience__div">
                    {" "}
                    <button
                      onClick={() => {
                        setMaxAudience(concertData?.concertSupply);
                        setShowExpandAudience(false);
                      }}
                      className="expand__audience__button"
                    >
                      Show All{" "}
                      <i className="fa-solid fa-plus in__button__icon" />
                    </button>
                  </div>
                </div>
              )) || (
                <>
                  <div className="close__list__floating__container">
                    <div className="close__list__floating__div">
                      {" "}
                      <button
                        onClick={() => {
                          setMaxAudience(10);
                          setShowExpandAudience(true);
                          setWidth(width + 1);
                        }}
                        className="expand__list__button  collapse__list__button"
                      >
                        <i className="fa-solid fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="expand__audience__container collapse__audience__container">
                    <div className="expand__audience__div">
                      {" "}
                      <button
                        onClick={() => {
                          setMaxAudience(10);
                          setShowExpandAudience(true);
                          setWidth(width + 1);
                        }}
                        className="expand__audience__button"
                      >
                        Collapse{" "}
                        <i className="fa-solid fa-minus in__button__icon" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {showMintPopUp && (
        <MintPopUp
          currentUser={currentUser}
          concertData={concertData}
          concertID={concertID}
          setShowMintPopUp={setShowMintPopUp}
          setCurrentUser={setCurrentUser}
        />
      )}
      {validListing && (
        <div className="player__page">
          <Helmet>
            <title>
              {concertData?.concertName} by {concertData?.concertArtist} - NFT
              Concert #{`${titleID} `}
            </title>
            <meta
              name="description"
              content={concertData?.concertDescription}
            />
          </Helmet>
          {(concertData?.concertPromoClip && (
            <>
              <div className="promo__clip__disclaimer">
                Enjoy this promo clip. Purchase the NFT Concert to unlock the
                full performance recording.{" "}
              </div>
              <div className="media__player__div">
                <ReactPlayer
                  config={{
                    file: {
                      attributes: {
                        onContextMenu: (e) => e.preventDefault(),
                        controlsList: "nodownload",
                      },
                    },
                  }}
                  url={concertData?.concertPromoClip}
                  width="100%"
                  height="100%"
                  playing={false}
                  controls={true}
                  playsinline={true}
                />
              </div>
            </>
          )) || (
            <>
              {/* {(pageMobileMode && (
                <div className="mobile__spacer mobile__show" />
              )) || <div className="mobile__spacer mobile__show grey" />} */}
              <div className="no__clip__div">
                <div className="no__clip">
                  {(claiming && (
                    <div className="img__replacement">
                      <h3>Minting NFT</h3>
                      <div className="row__center">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                    </div>
                  )) || (
                    <img
                      src={concertData?.concertTokenImage}
                      className="no__clip__token__image"
                      alt="NFT Concert Token Preview"
                    />
                  )}

                  <h3 className="promo__h3">Mint to Unlock the Show</h3>

                  <div className="buy__button__box">
                    <button
                      className="buy__now my__button preview__button buy__now__button"
                      onClick={() => {
                        setShowMintPopUp(true);
                      }}
                      disabled={claiming || !activeClaimCondition}
                    >
                      <div className="inside__button__div">
                        <div>Mint</div>{" "}
                        <div className="button__price">
                          <img
                            src="/media/eth-logo.png"
                            height={25}
                            className="c__eth__logo white__eth__logo"
                            alt="eth logo"
                          />
                          {formatPrice}{" "}
                          <span className="c__price__in__usd button__usd__price">
                            (${priceInUSD})
                          </span>
                        </div>
                      </div>
                    </button>
                    {/* 
                    <PaperCheckout
                      checkoutId="322fab2e-32ab-4065-8e5f-376eb638bcef"
                      display="DRAWER"
                      options={paperOptions}
                    >
                      <div className="marketplace__icon__div">
                        <img
                          src="/media/cc-logo.png"
                          className="marketplace__icon"
                        />
                      </div>
                    </PaperCheckout> */}

                    {purchased && (
                      <div className="transaction__result">
                        Purchase Completed - TX:{" "}
                        <a
                          href={transactionLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {truncateAddress(tx?.receipt.transactionHash)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="c__token__info__div">
            <div className="c__token__info__box">
              <div className="c__token__remaining">
                <p>
                  Total Qty:
                  <br className="mobile__show" />{" "}
                  <span className="blow__up__text">
                    {concertData?.concertSupply}
                  </span>
                </p>
              </div>
              <div className="c__token__supply">
                <p>
                  Available:
                  <br className="mobile__show" />{" "}
                  <span className="blow__up__text">
                    {activeClaimCondition?.availableSupply}
                  </span>
                </p>
                <div className="mobile__dots__center">
                  {!activeClaimCondition?.availableSupply && (
                    <div className="dots__div">
                      <div class="dot-flashing"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="c__token__price">
                Price: <br className="mobile__show" />
                <span className="blow__up__text">
                  <img
                    src="/media/eth-logo.png"
                    height={20}
                    className="c__eth__logo white__eth__logo"
                    alt="eth logo"
                  />
                  {formatPrice}{" "}
                </span>
                <span className="c__price__in__usd mobile__hide">
                  (${priceInUSD})
                </span>
              </div>
            </div>
          </div>
          <div className="split__col">
            <div className="concert__info__div">
              {(concertData?.concertPromoClip && (
                <>
                  {" "}
                  <div className="mint__div">
                    <div className="buy__button__box__left">
                      <button
                        className="buy__now my__button preview__button buy__now__button"
                        onClick={() => {
                          setShowMintPopUp(true);
                        }}
                        disabled={claiming || !activeClaimCondition}
                      >
                        <div className="inside__button__div">
                          <div>Mint</div>{" "}
                          <div className="button__price">
                            <img
                              src="/media/eth-logo.png"
                              height={25}
                              className="c__eth__logo white__eth__logo"
                              alt="eth logo"
                            />
                            {(formatPrice * mintQty).toFixed(3)}{" "}
                            <span className="c__price__in__usd button__usd__price">
                              (${(priceInUSD * mintQty).toFixed(2)})
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* <PaperCheckout
                    checkoutId="322fab2e-32ab-4065-8e5f-376eb638bcef"
                    display="DRAWER"
                    options={paperOptions}
                  >
                    <div className="marketplace__icon__div">
                      <img
                        src="/media/cc-logo.png"
                        className="marketplace__icon"
                      />
                    </div>
                  </PaperCheckout> */}
                    </div>
                  </div>
                  {/* <div className="quantity__div mint__quantity__div">
                    Select Quantity
                    <input
                      type="number"
                      min="1"
                      max="5"
                      defaultValue="1"
                      className="qantity__input"
                      onChange={(x) => {
                        setMintQty(parseInt(x.target.value));
                      }}
                    />
                  </div>{" "} */}
                  {purchased && (
                    <div className="transaction__result">
                      Purchase Completed - TX:{" "}
                      <a
                        href={transactionLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {truncateAddress(tx?.receipt.transactionHash)}
                      </a>
                    </div>
                  )}
                </>
              )) || <></>}

              <h1 className="c__name">
                {concertData?.concertName} by {concertData?.concertArtist}
              </h1>
              {owned > 1 && (
                <h3 className="owned__info">
                  {owned}x Copies Owned of {concertData?.concertSupply}
                </h3>
              )}
              {owned === 1 && (
                <h3 className="owned__info">
                  {owned} Copy Owned of {concertData?.concertSupply}
                </h3>
              )}
              {owned === 0 && concertData.concertPromoClip !== "" && (
                <h3 className="owned__info">Mint to access the show.</h3>
              )}
              <div className="underplayer__buttons__div listing__buttons__div">
                <a href={twitterLink} target="_blank" rel="noreferrer">
                  <button className="fa-brands fa-twitter player__icon__button" />
                </a>
                <button
                  className="fa-solid fa-play player__icon__button"
                  onClick={() => {
                    navigate("/player/" + concertID);
                  }}
                  disabled={!owned}
                />
              </div>
              <h3 className="c__detail">
                <i class="fa-solid fa-user c__icons" title="Artist" />
                {concertData?.concertArtist}
              </h3>
              <h3 className="c__detail">
                <i
                  class="fa-solid fa-calendar c__icons"
                  title="Performance Date"
                />
                {dateFormat(
                  concertData.concertPerformanceDate,
                  "m/d/yyyy, h:MM TT"
                )}
              </h3>

              <h3 className="c__detail">
                <i class="fa-solid fa-warehouse c__icons" title="Venue" />
                {concertData?.concertVenue}
              </h3>
              <h3 className="c__detail">
                <i
                  class="fa-solid fa-location-crosshairs c__icons"
                  title="Location"
                />
                {concertData?.concertLocation}
              </h3>
              {concertData?.concertTourName && (
                <h3 className="c__detail">
                  <i class="fa-solid fa-van-shuttle c__icons" title="Tour" />
                  {concertData?.concertTourName}
                </h3>
              )}
              {concertData?.concertLiveAttendance && (
                <h3 className="c__detail">
                  <i class="fa-solid fa-users-line c__icons" title="Tour" />
                  {concertData?.concertLiveAttendance}
                </h3>
              )}
              <h3 className="c__detail">
                <i class="fa-solid fa-video c__icons" title="Recording Type" />
                {concertData?.concertRecordingType}
              </h3>
              <h3 className="c__detail">
                <i
                  class="fa-solid fa-clock-rotate-left c__icons"
                  title="Duration"
                />
                {concertData?.concertDuration}
              </h3>
              <h3 className="c__detail">
                <i class="fa-solid fa-chart-pie c__icons" title="Duration" />
                {resaleFee}% Resale Fee
              </h3>
              <p className="c__description">
                {concertData?.concertDescription}
              </p>
              <div className="player__setlist__div">
                <h3 className="c__detail player__setlist__title">
                  Setlist - {concertData?.concertNumSongs} Songs
                </h3>
                {displaySongs()}
              </div>
            </div>
            <div className="token__div__container">
              <div className="token__div player__token__div">
                <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
                <img
                  src={concertData?.concertTokenImage}
                  className="token__image__image"
                  alt="NFT Concert Token Preview"
                />

                <div className="final__buy__button__div">
                  <button
                    className="buy__now my__button preview__button buy__now__button"
                    onClick={() => {
                      setShowMintPopUp(true);
                    }}
                    disabled={claiming || !activeClaimCondition}
                  >
                    <div className="inside__button__div">
                      <div>Mint</div>{" "}
                      <div className="button__price">
                        <img
                          src="/media/eth-logo.png"
                          height={25}
                          className="c__eth__logo white__eth__logo"
                          alt="eth logo"
                        />
                        {(formatPrice * mintQty).toFixed(3)}{" "}
                        <span className="c__price__in__usd button__usd__price">
                          (${(priceInUSD * mintQty).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </button>
                  {purchased && (
                    <div className="transaction__result">
                      Purchase Completed - TX:{" "}
                      <a
                        href={transactionLink}
                        target="_blank"
                        className="dark__link"
                        rel="noreferrer"
                      >
                        {truncateAddress(tx?.receipt.transactionHash)}
                      </a>
                    </div>
                  )}
                </div>
                <div className="marketplace__icons__div token__div__icons">
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://looksrare.org/collections/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/looksrare-logo.png"
                      className="marketplace__icon invert__icon"
                      alt="LooksRare Logo"
                    />
                  </div>
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/ethereum/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/opensea-logo.png"
                      className="marketplace__icon"
                      alt="OpenSea Logo"
                    />
                  </div>
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://x2y2.io/eth/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a/${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/x2y2-logo.png"
                      className="marketplace__icon"
                      alt="X2Y2 Logo"
                    />
                  </div>
                  <div
                    className="marketplace__icon__div"
                    onClick={() => {
                      window.open(
                        `https://etherscan.io/token/0x878D3F87C163951Ef2923D09859Aff45Dc34a45a?a=${concertID}`
                      );
                    }}
                  >
                    <img
                      src="/media/etherscan-logo.png"
                      className="marketplace__icon"
                      alt="Etherscan Logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="c__token__info__div audience__info__div">
            <p>Mint this NFT Concert for a Permanent Spot in the Audience</p>
          </div>
          <div className="audience__div">
            <div className="audience__content">{showAudience()}</div>
          </div>
        </div>
      )}{" "}
      {!validListing && (
        <FormBox>
          <div className="not__valid__listing__div">
            <h3>This is not a valid listing.</h3>
            <button onClick={() => navigate("/")} className="login__button">
              Go Home
            </button>
            <button
              onClick={() => navigate("/my-account")}
              className="login__button"
            >
              My Account
            </button>
          </div>
        </FormBox>
      )}
    </>
  );
};

export default ListingPage;
