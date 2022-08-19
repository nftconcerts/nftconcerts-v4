import { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import "./TokenInfo.css";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import { GetMaticUSDExchangeRate, GetETHExchangeRate } from "./../api";

const TokenInfo = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  setFormDate,
  whileUploading,
  infoBox,
}) => {
  const [startDate, setStartDate] = useState(values.concertReleaseDate);
  const [showInfo, setShowInfo] = useState(false);
  const switchShowInfo = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };
  const handleChangeRaw = (value) => {};

  const dateToString = (date) => {
    const dateString = JSON.stringify(date);
  };

  const timeToSTring = (date) => {
    const timeString = JSON.stringify(date);
  };

  //eth to usd api call
  const [usdExRate, setUsdExRate] = useState();
  const [priceInUSD, setPriceInUSD] = useState("0.00");

  useEffect(() => {
    GetMaticUSDExchangeRate().then((res) => {
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
    <>
      <FormBox>
        {whileUploading && infoBox()}
        {showInfo && (
          <div className="info__pop__up">
            <div className="info__box">
              <p>
                Input NFT release information. <br /> First Sale Earnings ={" "}
                <br /> (NFT Quantity) * (Price per NFT) * (0.8)
              </p>
            </div>
          </div>
        )}
        <div className="required__star supply__star">&#42;</div>
        <div className="required__star price__star">&#42;</div>
        <div className="required__star resale__fee__star">&#42;</div>
        <div className="required__star drop__date__star">&#42;</div>
        <div className="required__star privacy__star">&#42;</div>

        <i
          className="fa-solid fa-circle-info float__icon"
          style={{ marginLeft: "176px" }}
          onClick={switchShowInfo}
        ></i>
        <button className="back__button" type=" button" onClick={prevStep}>
          Back
        </button>
        <div>
          <label>Token Quantity</label>
          <input
            name="concertSupply"
            placeholder="NFT Quantity"
            value={values.concertSupply}
            onChange={handleFormData("concertSupply")}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />{" "}
          <label>Price per NFT</label>
          <input
            name="concertPrice"
            placeholder="Price per NFT (MATIC)"
            className="price__input"
            onKeyPress={(event) => {
              if (!/[0-9\.]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            maxLength={5}
            value={values.concertPrice}
            onChange={handleFormData("concertPrice")}
          />{" "}
          <img
            src="/media/polygon-logo-white.png"
            height={25}
            className="price__eth__logo polygon__logo__dark"
          />
          <div className="eth__to__usd">(${priceInUSD})</div>
        </div>
        <label>Resale Fee (Max 10%)</label>
        <div className="select">
          <select
            name="concertResaleFee"
            placeholder="Resale Fee"
            onChange={handleFormData("concertResaleFee")}
            value={values.concertResaleFee}
          >
            <option value="" disabled selected>
              Resale Fee
            </option>
            <option value="0">0%</option>
            <option value="1">1%</option>
            <option value="2">2%</option>
            <option value="3">3%</option>
            <option value="4">4%</option>
            <option value="5">5%</option>
          </select>
        </div>
        {/* <label>Release Date</label>
      <input name="concertReleaseDate" placeholder="Release Date)" />{" "}
      <label>Release Time</label>
      <input name="concertReleaseTime" placeholder="Release Time" />{" "} */}
        {/* Concert Date Selector*/}
        <DatePicker
          selected={startDate}
          showTimeSelect
          minDate={addDays(new Date(), 2)}
          onChange={(date) => {
            {
              setStartDate(date);
              setFormDate(date, "concertReleaseDate");
            }
          }}
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
          placeholderText="Release Date &#38; Time"
          onChangeRaw={(event) => handleChangeRaw(event.target.value)}
          dateFormat="MM/dd/yyy, h:mm aa"
        />
        {/* Concert Set Time Selector */}
        {/* <DatePicker
          selected={releaseTime}
          onChange={(time) => setReleaseTime(time)}
          onSelect={handleFormData("concertSetTime")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText="Release Time"
          popperPlacement="bottom"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 0],
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
        /> */}
        <label>Listing Privacy</label>
        <div className="select">
          <select
            name="concertListingPrivacy"
            onChange={handleFormData("concertListingPrivacy")}
          >
            <option value="" disabled selected>
              Listing Privacy
            </option>
            <option value="Public">Public</option>
            <option value="Unlisted">Unlisted</option>
          </select>
        </div>
        <input
          type="button"
          className="login__button rules__button ti__button"
          value="Next"
          onClick={nextStep}
        />
        <div className="progress__bar">
          <div className="progress__step step__6"></div>
        </div>
      </FormBox>
    </>
  );
};

export default TokenInfo;
