import React, { useState } from "react";
import "./ListingInfo.css";
import "./ConcertInfo.css";
import Contract from "../form/Contract";
import { FileUploader } from "react-drag-drop-files";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";

const fileTypes = ["MP4", "MOV", "WAV", "MP3"];

const ListingInfo = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  whileUploading,
  infoBox,
  uploadFile2,
  promoClipFile,
  setPromoClipFile,
  setFormDate,
  setPtAccess,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [startDate, setStartDate] = useState(values.concertReleaseDate);
  const handleChangeRaw = (value) => {};
  const switchShowInfo = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };
  const handlePromoChange = (file) => {
    setPromoClipFile(file);
    handleFormData("concertPromoClip");
    uploadFile2(file, "PromoClip");
  };

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
      }
    }

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

  const updatePtAccess = () => {
    let access = values.productionTeamAccess;
    if (access === "true") {
      setPtAccess("false");
    } else {
      setPtAccess("true");
    }
  };
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
          <h3 className="inline__title">Concert Information (Continued...)</h3>

          <div className="required__star cname__star">&#42;</div>
          <div className="required__star crelease__date__star">&#42;</div>
          {/* 
          <div className="required__star cvenue__star">&#42;</div>
          <div className="required__star clocation__star">&#42;</div>
          <div className="required__star crecording__type__star">&#42;</div>
          <div className="required__star cpricing__star">&#42;</div> */}
          <div className="top__upload__box">
            <div>
              <div className="thumbnail__center__title">
                {promoClipFile && (
                  <>
                    <h3 className="thumbnail__float__title">
                      File: {promoClipFile.name}
                    </h3>
                    <h5 className="subtitle__float__title ">
                      (Optional, 60 Seconds Max)
                    </h5>
                  </>
                )}
                {promoClipFile === "" && (
                  <>
                    <h3 className="thumbnail__float__title">
                      Upload Promo Clip
                    </h3>
                    <h5 className="subtitle__float__title ">
                      (Optional, 60 Seconds Max)
                    </h5>
                  </>
                )}
              </div>
              <div className="uploader__box">
                <FileUploader
                  class="uploader__box"
                  handleChange={handlePromoChange}
                  name="concertRecording"
                  types={fileTypes}
                  multiple={false}
                  children={
                    <div className="thumbnail__uploader__box">
                      <p className="thumbnail__upload__box__top">
                        Drag &#38; Drop or{" "}
                        <span className="highlight">Click to Upload</span>
                      </p>
                      <p className="thumbnail__upload__box__bottom">
                        [MP4, MOV, WAV, MP3]
                      </p>
                    </div>
                  }
                />
              </div>
            </div>
            <label>Description</label>
            <textarea
              name="concertDescription"
              placeholder="Description"
              value={values.concertDescription}
              onChange={handleFormData("concertDescription")}
              className="my__text__area"
              rows="7"
            />{" "}
            <label>Tour Name</label>
            <input
              name="concertTourName"
              type="text"
              placeholder="Tour Name"
              defaultValue={values.concertTourName}
              onChange={handleFormData("concertTourName")}
              className="cd__input first__input"
            />{" "}
            <label>Live Attendance</label>
            <input
              name="concertLiveAttendance"
              type="text"
              placeholder="Live Attendance"
              className="cd__input"
              defaultValue={values.concertLiveAttendance}
              onChange={handleFormData("concertLiveAttendance")}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              maxLength="6"
            />{" "}
          </div>
        </div>
        <div className="right__col">
          {/* Next Page Button */}
          <div className="token__preview__div setlist__div">
            <div className="required__star csetlist__star">&#42;</div>
            <h3 className="token__heading">Setlist</h3>
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
          </div>
        </div>
      </div>
      <div className="token__pricing__div release__date__div">
        <h3 className="token__heading">
          Schedule your NFT Concert Release Date
        </h3>
        <div className="date__picker__div">
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
        </div>
        <div className="fee__div production__access">
          <p className="">
            Give the{" "}
            <a
              href="/production-team"
              target="_blank"
              rel="noreffer"
              className="white__link"
            >
              NFT Concerts Production Team
            </a>{" "}
            a 6 Hour Head Start{" "}
          </p>
          <div className="checkbox__div production__access__checkbox">
            <input
              type="checkbox"
              className="large__checkbox"
              id="productionTeamEarlyAccess"
              onChange={updatePtAccess}
              defaultChecked={values.productionTeamAccess === "true"}
            />
          </div>
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
            <div className="progress__step step__3"></div>
          </div>
        </div>
      </div>
    </Contract>
  );
};

export default ListingInfo;
