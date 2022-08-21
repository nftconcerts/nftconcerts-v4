import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db, fetchCurrentUser, storage } from "../firebase";
import { ref as dRef, onValue, set } from "firebase/database";
import Contract from "./form/Contract";
import ReactPlayer from "react-player";
import dateFormat from "dateformat";
import "./upload/Confirmation.css";
import { GetUSDExchangeRate } from "./api";
import html2canvas from "html2canvas";
import {
  getDownloadURL,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";
import makeid from "./../scripts/makeid";
import createNFT from "../scripts/createNft.mjs";

import { FileUploader } from "react-drag-drop-files";
import "./upload/Confirmation.css";
import "./upload/Upload.css";
import "./upload/UploadRecording.css";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";

const fileTypes = ["PNG"];

const ContractPage = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let concertID = parseInt(searchParams.get("id"));
  const [userData, setUserData] = useState();
  const [concertData, setconcertData] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [validUser, setValidUser] = useState(false);
  const [adminUser, setAdminUser] = useState(false);
  const [fileUrl, updateFileUrl] = useState(``);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [approvedListing, setApprovedListing] = useState(false);

  //Set the current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //format ETH Price
  useEffect(() => {
    if (parseFloat(concertData?.concertPrice) < 1) {
      setFormatPrice(parseFloat(concertData?.concertPrice));
    } else setFormatPrice(concertData?.concertPrice);
  }, [concertData]);

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

  //Check if user is admin or was uploader
  useEffect(() => {
    if (userData?.userType === "admin") {
      setValidUser(true);
      setAdminUser(true);
    } else if (userData?.userType === "artist") {
      if (userData?.walletID === concertData?.uploaderWalletID) {
        setValidUser(true);
      }
    } else setValidUser(false);
  }, [currentUser, userData]);

  //download concert data
  useEffect(() => {
    var concertDataRef = dRef(db, "submittedConcerts/" + concertID + "/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setconcertData(cData);
    });
  }, [currentUser, concertID]);

  //check if concert is approved
  useEffect(() => {
    if (concertData?.listingApproval === "Approved") {
      setApprovedListing(true);
      console.log("#", concertID, " is approved");
    }
  }, [concertData, concertID]);

  //price formats
  const resaleFee = parseFloat(concertData?.concertResaleFee) + 5;
  const [formatPrice, setFormatPrice] = useState("");

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);

  useEffect(() => {
    if (parseFloat(concertData?.concertPrice)) {
      var newPrice = parseFloat(concertData?.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (concertData?.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [concertData?.concertPrice, usdExRate]);

  //displays the individual songs for the setlist coonfirmation
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
          const songPlaceholder = `Song ${n}`;
          return (
            <div className="song__div">
              <p className="song__num">{n}:</p>
              <p className="song__name">
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

  //ADMIN VIEW ONLY - screenshot + donwload image for corrections.

  const [showUploadPop, setShowUploadPop] = useState(false);

  const [tokenFileUrl, setTokenFileUrl] = useState();

  const printRef = React.useRef();
  const captureImage = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 3,
    });

    const data = canvas.toDataURL(concertID.toString());

    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = data;
      link.download = `${concertID} - Token Outline.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const uploadPop = () => {
    setShowUploadPop(true);
  };

  //ADMIN UPLOAD FINAL TOKEN IMAGE
  //upload files to Firebase Storage
  const [file, setFile] = useState("");
  const [whileUploading, setWhileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file, folder) => {
    var tokenRef = dRef(db, "concerts/" + concertID + "/concertTokenImage");
    if (!file) return;
    const storageRef = sRef(storage, `/public/${folder}/${file.name}`);
    setWhileUploading(true);
    const uploadTask = uploadBytesResumable(storageRef, file);
    // const response = await fetch(file.uri);
    // const blob = await response.blob();
    // var ref = storage().ref().child("colors");
    // ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(prog);
        if (prog === 100) {
          setWhileUploading(true);
        }
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setTokenFileUrl(url);
          set(tokenRef, url);
        });
      }
    );
  };
  const handleChange = (file) => {
    setFile(file);
    uploadFile(file, "Token Image");
    uploadFileToIpfs(file);
  };

  const projectId = `${process.env.REACT_APP_INFURA_PROJECT_ID}`;
  const projectSecret = `${process.env.REACT_APP_INFURA_PROJECT_SECRET}`;

  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  //infura upload function
  const [ipfsUrl, setIpfsUrl] = useState("");

  useEffect(() => {
    if (concertData) {
      setIpfsUrl(concertData.tokenIpfs);
      console.log("ipfs: ", concertData.tokenIpfs);
    }
  }, [concertData]);

  async function uploadFileToIpfs(file) {
    var ipfsRef = dRef(db, "concerts/" + concertID + "/tokenIpfs");
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const ipfsUrl = `ipfs://${added.path}`;
      set(ipfsRef, ipfsUrl);
      updateFileUrl(url);
      setIpfsUrl(ipfsUrl);
      console.log("File Url: ", url);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setErrorMessage("Error uploading file: ", error);
      setShowError(true);
    }
  }
  //approve concert
  const [mintLoading, setMintLoading] = useState(false);

  const approveConcert = async () => {
    var tokenIdRef = dRef(db, "concerts/" + concertID + "/tokenId");
    var listingApprovalRef = dRef(
      db,
      "concerts/" + concertID + "/listingApproval"
    );
    setMintLoading(true);
    console.log("minting attempt");
    const mint = await createNFT(
      concertData.concertName,
      concertData.concertArtist,
      concertData.concertDescription,
      ipfsUrl
    );
    console.log("minted");
    const firstTokenId = mint[0].id;
    set(tokenIdRef, firstTokenId.toString());
    set(listingApprovalRef, "Approved");
    console.log("New Token: ", firstTokenId);
    setMintLoading(false);
  };

  return (
    <>
      {(validUser && (
        <Contract>
          {mintLoading && (
            <div className="minting__alert">
              <h3>Creating NFT.</h3>
              <div className="center">
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
          )}

          <h2>This is a copy of your listing contract.</h2>
          <div className="listing__status__div">
            Current Listing Status:{" "}
            <span className="bold">{concertData?.listingApproval}</span>
          </div>
          <div className="keep__left">
            <div className="review__content__div">
              <div className="col1">
                <h3>Concert Recording (Private)</h3>
                <ReactPlayer
                  url={concertData?.concertRecording}
                  width={315}
                  height={200}
                  playing={false}
                  controls={true}
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              </div>
              <div className="col2">
                <h3>Promo Clip (Public)</h3>
                {!concertData?.concertPromoClip && (
                  <div className="no__promo__clip">
                    <div className="pad__me">
                      <span className="with__emp">Missing Promo Clip</span>
                    </div>
                    <br />
                    This is not required but it is recommended.
                  </div>
                )}
                {concertData?.concertPromoClip && (
                  <ReactPlayer
                    url={concertData?.concertPromoClip}
                    width={315}
                    height={200}
                    playing={false}
                    controls={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
            <div className="my__columns">
              <div className="text__info__div">
                <p className="text__info__header">
                  This is a listing contract for:
                  <br />
                  <span className="with__emp">{concertData?.concertName}</span>
                </p>
                <div className="text__info__scroll__area">
                  <p>
                    Performance Date: <br />
                    <span className="with__emp">
                      {dateFormat(
                        concertData?.concertPerformanceDate,
                        "m/d/yyyy, h:MM TT "
                      )}{" "}
                    </span>
                  </p>
                  <p>
                    Venue: <br />
                    <span className="with__emp">
                      {concertData?.concertVenue}
                    </span>
                  </p>
                  <p className="no__overflow">
                    Location: <br />
                    <span className="with__emp">
                      {concertData?.concertLocation}
                    </span>
                  </p>
                  {concertData?.concertTourName && (
                    <p>
                      Tour Name: <br />
                      <span className="with__emp">
                        {concertData?.concertTourName}
                      </span>
                    </p>
                  )}
                  {concertData?.concertLiveAttendance && (
                    <p>
                      Live Attendance: <br />
                      <span className="with__emp">
                        {concertData?.concertLiveAttendance}
                      </span>
                    </p>
                  )}
                  <p>
                    Recording Type:
                    <br />
                    <span className="with__emp">
                      {" "}
                      {concertData?.concertRecordingType}
                    </span>
                  </p>

                  {concertData?.concertDescription && (
                    <p>
                      Description: <br />
                      <span className="with__emp">
                        {concertData?.concertDescription}
                      </span>
                    </p>
                  )}

                  <p className="setlist__title">
                    Setlist - {concertData?.concertNumSongs} Songs{" "}
                  </p>
                  {displaySongs()}

                  <p>
                    NFT Supply: <br />
                    <span className="with__emp">
                      {concertData?.concertSupply}
                    </span>
                  </p>
                  <p>
                    Price per NFT: <br />
                    <img
                      src="/media/eth-logo.png"
                      height={15}
                      className="c__eth__logo"
                    />
                    <span className="with__emp">{formatPrice}</span>{" "}
                    <span className="c__price__in__usd">(${priceInUSD})</span>
                  </p>
                  <p>
                    Secondary Sale Fee: <br />
                    <span className="with__emp">{resaleFee}%</span>
                    <span className="c__price__in__usd">
                      {concertData?.concertResaleFee > 0 && (
                        <>({concertData?.concertResaleFee}% Artist Fee + 5% </>
                      )}
                      NFT Concerts Fee
                      {concertData?.concertResaleFee > 0 && <>)</>}
                    </span>
                  </p>
                  <p>
                    NFT Drop Date and Time: <br />
                    <span className="with__emp">
                      {dateFormat(
                        concertData?.concertReleaseDate,
                        "m/d/yyyy, h:MM TT Z "
                      )}
                    </span>
                  </p>

                  <p>
                    Listing Privacy: <br />
                    <span className="with__emp">
                      {concertData?.concertListingPrivacy}
                    </span>
                  </p>
                </div>
              </div>
              <div className="token__div">
                <h3 className="token__heading">Non-Fungible Token (NFT)</h3>
                <div className="token__box" ref={printRef}>
                  <div className="token__header">
                    <div className="first__third">
                      <p>
                        {dateFormat(
                          concertData?.concertPerformanceDate,
                          "m/d/yyyy"
                        )}
                      </p>
                    </div>
                    <div className="col__thirds">
                      <div className="missing__tab" />
                    </div>
                    <div className="last__third">
                      <p>TOTAL QTY: {concertData?.concertSupply}</p>
                    </div>
                  </div>
                  <div className="token__thumbnail__box">
                    <img
                      src={concertData?.concertThumbnailImage + "?not-cache"}
                      height="300px"
                    />
                  </div>
                  <div className="token__footer">
                    <div className="token__concert__name">
                      {concertData?.concertName}
                    </div>
                    <div className="token__concert__name token__artist__name">
                      {concertData?.concertArtist}
                    </div>
                    <img
                      src="/media/nftc-logo.png"
                      className="center__logo token__logo"
                      alt="NFT Concerts Logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="confirmation__button__div">
            <input
              type="button"
              value="Back to My Account"
              className="login__button c__back__button"
              onClick={() => {
                navigate("/my-account");
              }}
            />

            <input
              type="button"
              value="Request Edits"
              className="login__button c__confirm__button"
            />
          </div>
          {adminUser && (
            <div className="admin__panel">
              <h3>Admin Panel</h3>
              {approvedListing && (
                <p>This listing has already been approved.</p>
              )}
              {!approvedListing && (
                <div className="confirmation__button__div">
                  <input
                    type="button"
                    value="Print Token Outline"
                    className="login__button c__confirm__button admin__button"
                    onClick={captureImage}
                  />

                  <input
                    type="button"
                    value="Upload Final Token"
                    className="login__button c__confirm__button admin__button"
                    onClick={uploadPop}
                  />
                </div>
              )}
              {!approvedListing && concertData?.concertTokenImage && (
                <>
                  {!showUploadPop && (
                    <div className="flex__div">
                      <div className="token__preview">
                        <h3 className="token__image__heading">Current Token</h3>
                        <img
                          src={concertData.concertTokenImage}
                          className="token__preview__img"
                        />
                      </div>
                      <input
                        type="button"
                        value="Approve Listing"
                        className="login__button c__confirm__button approve__button"
                        onClick={approveConcert}
                        disabled={mintLoading}
                      />
                      {mintLoading && (
                        <div className="minting__alert__div">
                          <h3>Creating NFT.</h3>
                          <div className="center bottom__center">
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
                      )}
                    </div>
                  )}
                </>
              )}
              {showUploadPop && (
                <div className="upload__token__pop">
                  {!mintLoading && (
                    <>
                      <div className="center__title">
                        {file && (
                          <h3 className="float__title">File: {file.name}</h3>
                        )}
                        {file === "" && (
                          <h3 className="float__title">Upload Final Token</h3>
                        )}
                      </div>
                      <div className="admin__two__col">
                        <div className="uploader__box admin__upload__box">
                          <FileUploader
                            className="uploader__box"
                            handleChange={handleChange}
                            name="concertRecording"
                            types={fileTypes}
                            multiple={false}
                            children={
                              <div className="upload__box__modified">
                                <div className="upload__box__top">
                                  <>
                                    {" "}
                                    Drag &#38; Drop or{" "}
                                    <span className="highlight">
                                      Click to Upload
                                    </span>
                                  </>
                                </div>
                                <p className="upload__box__bottom">[PNG]</p>
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {file && (
                    <div className="approve__button__div">
                      <h3 className="token__image__heading">
                        Final Token Image
                      </h3>
                      <div className="token__preview">
                        <img
                          src={URL.createObjectURL(file)}
                          className="token__preview__img"
                        />
                      </div>
                      <input
                        type="button"
                        value="Approve Listing"
                        className="login__button c__confirm__button approve__button"
                        onClick={approveConcert}
                        disabled={mintLoading}
                      />
                      {mintLoading && (
                        <div className="minting__alert__div">
                          <h3>Creating NFT.</h3>
                          <div className="center bottom__center">
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
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Contract>
      )) || <Contract>Only the uploader may view the contact</Contract>}
    </>
  );
};

export default ContractPage;
