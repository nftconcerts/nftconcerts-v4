import React, { useEffect, useState } from "react";
import Contract from "../form/Contract";
import DatePicker from "react-datepicker";
import { fetchPlace } from "../fetchPlace";
import dateFormat from "dateformat";
import { FileUploader } from "react-drag-drop-files";
import "./ConcertInfo.css";
import { GetUSDExchangeRate } from "../api";

const imgFileTypes = ["PNG", "JPG"];

const ConcertInfo = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  setFormDate,
  whileUploading,
  infoBox,
  uploadFile1,
  thumbnailFile,
  setThumbnailFile,
}) => {
  //start date and set time for DatePicker
  const [startDate, setStartDate] = useState(values?.concertPerformanceDate);
  const [showInfo, setShowInfo] = useState(false);
  const switchShowInfo = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };

  const handleChangeRaw = (value) => {};

  //autocomplete city and state box via Mapbox API
  const [city, setCity] = useState("");
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  const handleCityChange = async (e) => {
    setCity(e.target.value);
    if (!city) return;

    const res = await fetchPlace(city);
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name));
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  const handleThumbnailChange = (file) => {
    setThumbnailFile(file);
    handleFormData("concertThumnbailImage");
    uploadFile1(file, "ThumbnailImage");
  };

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
  }, []);
  useEffect(() => {
    if (parseFloat(values.concertPrice)) {
      var newPrice = parseFloat(values.concertPrice) * usdExRate;
      let roundedPrice = newPrice.toFixed(2);
      setPriceInUSD(roundedPrice);
    } else if (values.concertPrice === "") {
      setPriceInUSD("0.00");
    } else setPriceInUSD("err");
  }, [values.concertPrice, usdExRate]);

  return (
    <Contract>
      {whileUploading && infoBox("contract__upload__alert")}
      {showInfo && (
        <div className="info__pop__up ">
          <div className="info__box contract__upload__alert">
            <p>
              Input concert information. <br /> All fields required.
            </p>
          </div>
        </div>
      )}
      <button className="back__button" type="button" onClick={prevStep}>
        Back
      </button>
      <i
        className="fa-solid fa-circle-info float__icon"
        style={{ marginLeft: "250px" }}
        onClick={switchShowInfo}
      ></i>
      <div className="two__col__div">
        <div className="left__col">
          <h3 className="inline__title">Concert Information</h3>
          <div className="required__star cthumbnail__star">&#42;</div>
          <div className="required__star cname__star">&#42;</div>
          <div className="required__star cartist__star">&#42;</div>
          <div className="required__star cperf__date__star">&#42;</div>
          <div className="required__star cvenue__star">&#42;</div>
          <div className="required__star clocation__star">&#42;</div>
          <div className="required__star crecording__type__star">&#42;</div>
          <div className="required__star cpricing__star">&#42;</div>
          <div className="top__upload__box">
            <div className="thumbnail__center__title">
              {thumbnailFile && (
                <>
                  <h3 className="thumbnail__float__title">
                    File: {thumbnailFile.name}
                  </h3>
                  <h5 className="subtitle__float__title ">
                    (Please ensure a 1:1 Aspect Ratio)
                  </h5>
                </>
              )}
              {thumbnailFile === "" && (
                <>
                  <h3 className="thumbnail__float__title">
                    Upload Thumbnail Image
                  </h3>
                  <h5 className="subtitle__float__title ">
                    (1:1 Aspect Ratio)
                  </h5>
                </>
              )}
            </div>
            <div className="uploader__box">
              <FileUploader
                className="uploader__box"
                required={true}
                handleChange={handleThumbnailChange}
                name="concertRecording"
                types={imgFileTypes}
                multiple={false}
                children={
                  <div className="thumbnail__uploader__box">
                    <p className="thumbnail__upload__box__top">
                      Drag &#38; Drop or{" "}
                      <span className="highlight">Click to Upload</span>
                    </p>
                    <p className="thumbnail__upload__box__bottom">[PNG, JPG]</p>
                  </div>
                }
              />
            </div>
          </div>
          {/* Concert Name Input */}
          <input
            className="first__input"
            name="concertName"
            type="text"
            placeholder="Concert Name"
            defaultValue={values.concertName}
            onChange={handleFormData("concertName")}
          />{" "}
          <input
            name="concertArtist"
            type="text"
            placeholder="Artist"
            defaultValue={values.concertArtist}
            onChange={handleFormData("concertArtist")}
          />{" "}
          {/* Concert Date Selector*/}
          <DatePicker
            selected={startDate}
            showTimeSelect
            maxDate={new Date()}
            onChange={(date) => {
              setStartDate(date);
              setFormDate(date, "concertPerformanceDate");
            }}
            onSelect={handleFormData("concertDate")}
            closeOnScroll={true}
            popperPlacement="bottom"
            popperModifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, -12],
                },
              },
              {
                name: "preventOverflow",
                options: {
                  rootBoundary: "viewport",
                  tether: false,
                  altAxis: true,
                },
              },
            ]}
            placeholderText="Performance Date &#38; Set Time"
            onChangeRaw={(event) => handleChangeRaw(event.target.value)}
            dateFormat="MM/dd/yyy, h:mm aa"
          />
          <input
            name="concertVenue"
            type="text"
            placeholder="Venue"
            defaultValue={values.concertVenue}
            onChange={handleFormData("concertVenue")}
          />{" "}
          {/* Concert Location Input (city, state, country) */}
          {autocompleteErr && console.log(autocompleteErr)}
          <input
            list="places"
            type="text"
            id="concertLocation"
            name="concertLocation"
            defaultValue={values.concertLocation}
            placeholder="Location (City, State)"
            onChange={handleCityChange}
            onChangeCapture={handleFormData("concertLocation")}
            required
            pattern={autocompleteCities.join("|")}
            autoComplete="off"
            className="place__input"
          />
          <datalist id="places">
            {autocompleteCities.map((city, i) => (
              <option key={i}>{city}</option>
            ))}
          </datalist>
          <div className="select">
            <select
              name="concertRecordingType"
              placeholder="Recording Type"
              defaultValue={values.concertRecordingType}
              onChange={handleFormData("concertRecordingType")}
            >
              <option
                className="placeholder__option"
                value=""
                disabled
                selected
              >
                Recording Type
              </option>
              <option className="valid__option" value="SingleCam Video">
                SingleCam Video
              </option>
              <option className="valid__option" value="MultiCam Video">
                MultiCam Video
              </option>
              <option className="valid__option" value="Audio Only">
                Audio Only
              </option>
            </select>
          </div>
        </div>
        <div className="right__col">
          {/* Next Page Button */}
          <div className="token__preview__div">
            <h3 className="token__heading">Non-Fungible Token Preview (NFT)</h3>
            <div className="token__box">
              <div className="token__header">
                <div className="first__third">
                  <p>{dateFormat(values.concertPerformanceDate, "m/d/yyyy")}</p>
                </div>
                <div className="col__thirds">
                  <div className="missing__tab" />
                </div>
                <div className="last__third">
                  <p>TOTAL QTY: {values.concertSupply}</p>
                </div>
              </div>
              <div className="token__thumbnail__box">
                <img
                  src={
                    values.concertThumbnailImage ||
                    "/media/upload-thumbnail.jpg"
                  }
                  height="300px"
                  alt="NFT Concert Token"
                />
              </div>
              <div className="token__footer">
                <div className="token__concert__name">
                  {values.concertName || "Concert Name"}
                </div>
                <div className="token__concert__name token__artist__name">
                  {values.concertArtist || "Artist"}
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
      <div className="token__pricing__div">
        <h3 className="token__heading">Token Supply + Pricing</h3>
        <div className="three__col__div">
          <div className="token__thirds">
            <p className="third__heading">NFT Quantity</p>
            <input
              className="tiny__input"
              name="concertSupply"
              placeholder="NFT Quantity"
              value={values.concertSupply}
              onChange={handleFormData("concertSupply")}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </div>

          <div className="token__thirds">
            <p className="third__heading">Price per NFT</p>
            <input
              name="concertPrice"
              className="tiny__input"
              placeholder="0.00"
              onKeyPress={(event) => {
                if (!/[0-9.]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              maxLength={5}
              value={values.concertPrice}
              onChange={handleFormData("concertPrice")}
            />{" "}
            <img
              src="/media/eth-logo.png"
              height={25}
              className="token__price__eth__logo"
              alt="ETH Logo"
            />
            <div className="token__eth__to__usd">(${priceInUSD})</div>
          </div>
          <div className="token__thirds">
            <p className="third__heading">Artist Resale Fee</p>
            <div className="select tiny__select margin__bump">
              <select
                className="tiny__select"
                name="concertResaleFee"
                placeholder="Resale Fee"
                onChange={handleFormData("concertResaleFee")}
                value={values.concertResaleFee}
              >
                <option value="0" selected>
                  0%
                </option>
                <option value="1">1%</option>
                <option value="2">2%</option>
                <option value="3">3%</option>
                <option value="4">4%</option>
                <option value="5">5%</option>
              </select>
            </div>
          </div>
        </div>
        <div className="fee__div">
          <p>
            NFT Concerts takes a 20% fee on minting. Please price accordingly.
          </p>
          {values.concertPrice && values.concertSupply && (
            <>
              <div className="payout__table">
                <div className="payout__row">
                  <div className="payout__description">Price per NFT</div>
                  <div className="payout__price">{values.concertPrice} ETH</div>
                  <div className="payout__price__usd concert__info__mobile__hide">
                    ($
                    {priceInUSD.toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                    )
                  </div>
                </div>
                <div className="payout__row">
                  <div className="payout__description">NFT Concerts Fee </div>
                  <div className="payout__price">
                    {" "}
                    {(values.concertPrice * 0.2).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    ETH
                  </div>
                  <div className="payout__price__usd concert__info__mobile__hide">
                    ($
                    {(priceInUSD * 0.2).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </div>
                </div>
                <div className="payout__row">
                  <div className="payout__description">
                    {" "}
                    Artist Payout per Mint
                  </div>
                  <div className="payout__price">
                    {(values.concertPrice * 0.8).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    ETH
                  </div>
                  <div className="payout__price__usd concert__info__mobile__hide">
                    ($
                    {(priceInUSD * 0.8).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </div>
                </div>
                <div className="payout__row last__row">
                  <div className="payout__description">
                    Sellout Artist Payout{" "}
                  </div>
                  <div className="payout__price">
                    {" "}
                    {(
                      values.concertPrice *
                      0.8 *
                      values.concertSupply
                    ).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    ETH
                  </div>
                  <div className="payout__price__usd concert__info__mobile__hide">
                    ($
                    {(priceInUSD * 0.8 * values.concertSupply).toLocaleString(
                      "en-us",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                    )
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="contract__full__width">
        <div className="contract__buttons__div">
          <input
            type="button"
            value="Next"
            className="login__button ci__button"
            onClick={nextStep}
          />
          <div className="progress__bar">
            <div className="progress__step step__2"></div>
          </div>
        </div>
      </div>
    </Contract>
  );
};

export default ConcertInfo;
