import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import "./ConcertInformation.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPlace } from "../fetchPlace";

const ConcertInformation = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  setFormDate,
  whileUploading,
  infoBox,
}) => {
  //start date and set time for DatePicker
  const [startDate, setStartDate] = useState(values.concertPerformanceDate);
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

  const getETH = async () => {
    const val = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");

    return val;
  };
  useEffect(() => {
    var eth = getETH();
  }, []);

  return (
    <>
      <FormBox>
        {whileUploading && infoBox()}
        {showInfo && (
          <div className="info__pop__up">
            <div className="info__box">
              <p>
                Input concert information. <br /> All fields required.
              </p>
            </div>
          </div>
        )}
        <div className="required__star concert__name__star">&#42;</div>
        <div className="required__star artist__star">&#42;</div>
        <div className="required__star perf__date__star">&#42;</div>
        <div className="required__star venue__star">&#42;</div>
        <div className="required__star location__star">&#42;</div>
        <i
          className="fa-solid fa-circle-info float__icon"
          style={{ marginLeft: "176px" }}
          onClick={switchShowInfo}
        ></i>
        <button className="back__button" type="button" onClick={prevStep}>
          Back
        </button>
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
            {
              setStartDate(date);
              setFormDate(date, "concertPerformanceDate");
            }
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
        {/* Concert Set Time Selector */}
        {/* <DatePicker
          selected={concertSetTime}
          onChange={(time) => setConcertSetTime(time)}
          onSelect={handleFormData("concertSetTime")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText="Concert Set Time"
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
        {/* Concert Venue Input */}
        <input
          name="concertVenue"
          type="text"
          placeholder="Venue"
          defaultValue={values.concertVenue}
          onChange={handleFormData("concertVenue")}
        />{" "}
        {/* Concert Location Input (city, state, country) */}
        <label>Location (City, State, Country)</label>
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
        {/* Next Page Button */}
        <input
          type="button"
          value="Next"
          className="login__button ci__button"
          onClick={nextStep}
        />
        <div className="progress__bar">
          <div className="progress__step step__2"></div>
        </div>
      </FormBox>
    </>
  );
};

export default ConcertInformation;
