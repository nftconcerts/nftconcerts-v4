import { constants } from "os";
import React, { useState } from "react";
import FormBox from "../form/FormBox";
import "./Setlist.css";

const Setlist = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  whileUploading,
  infoBox,
}) => {
  const [numSongs, setNumSongs] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const notZero = (input) => {
    if (input === "" || input === "0" || input === "00") {
      return false;
    } else {
      return true;
    }
  };

  const updateSong = (i) => {};

  const setlistInputs = () => {
    var rows = [];
    var rowNums = parseInt(values.concertNumSongs);

    if (rowNums > values.concertSetList.length) {
      for (
        let i = values.concertSetList.length;
        i < values.concertNumSongs;
        i++
      ) {
        values.concertSetList.push("");
        console.log("Song Array: ", values.concertNumSongs);
        console.log("ArrayLength", values.concertSetList.length);
      }
    }

    console.log("number of rows: ", rowNums);
    if (values.concertNumSongs === "") {
      return (
        <div className="no__songs__error">Please set the number of songs.</div>
      );
    } else {
      for (var i = 1; i <= rowNums; i++) {
        const songInput = (n) => {
          const songName = `song${n}`;
          const songPlaceholder = `Song ${n}`;
          return (
            <>
              <input
                defaultValue={values.concertSetList[n - 1]}
                name={songName}
                placeholder={songPlaceholder}
                id={n}
                key={n}
                className="song__input"
                onChange={(input) => {
                  values.concertSetList[input.target.id - 1] =
                    input.target.value;

                  console.log(input.target.name, ": ", input.target.value);
                  console.log("current song array: ", values.concertSetList);
                }}
              />
              <div className="indiv__song__star">&#42;</div>
            </>
          );
        };
        rows.push(songInput(i));
      }
      return rows;
    }
  };

  const [showInfo, setShowInfo] = useState(false);
  const switchShowInfo = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };

  return (
    <>
      <FormBox>
        {whileUploading && infoBox()}
        {showInfo && (
          <div className="info__pop__up">
            <div className="info__box">
              <p>
                To ensure music rights compliance, a complete and correct
                setlist is required for each NFT Concert. <br />
              </p>
            </div>
          </div>
        )}
        <div className="required__star num__songs__star">&#42;</div>
        <i
          className="fa-solid fa-circle-info float__icon"
          style={{ marginLeft: "176px" }}
          onClick={switchShowInfo}
        ></i>
        <button className="back__button" type="button" onClick={prevStep}>
          Back
        </button>
        <div className="setlist__box">
          <input
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            maxLength="2"
            name="concertNumSongs"
            className="num__songs__input"
            placeholder="Number of Songs"
            defaultValue={values.concertNumSongs}
            onChange={handleFormData("concertNumSongs")}
          />{" "}
          <div className="songs__input__div">{setlistInputs()}</div>
          <input
            type="button"
            className="login__button rules__button sl__button"
            value="Next"
            onClick={nextStep}
          />
          <div className="progress__bar sl__bar">
            <div className="progress__step step__4"></div>
          </div>
        </div>
      </FormBox>
    </>
  );
};

export default Setlist;
