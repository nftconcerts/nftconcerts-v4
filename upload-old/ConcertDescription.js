import React, { useState } from "react";
import FormBox from "../form/FormBox";
import "./ConcertDescription.css";

const ConcertDescription = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  whileUploading,
  infoBox,
}) => {
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
                Recording type requried. <br />
                Additional concert information fields are optional but
                recommended. <br />
              </p>
            </div>
          </div>
        )}
        <div className="required__star recording__type__star">&#42;</div>
        <i
          className="fa-solid fa-circle-info float__icon"
          style={{ marginLeft: "176px" }}
          onClick={switchShowInfo}
        ></i>
        <button className="back__button" type="button" onClick={prevStep}>
          Back
        </button>
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
        <label>Recording Type</label>
        <div className="select">
          <select
            name="concertRecordingType"
            placeholder="Recording Type"
            defaultValue={values.concertRecordingType}
            onChange={handleFormData("concertRecordingType")}
          >
            <option className="placeholder__option" value="" disabled selected>
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
        <label>Description</label>
        <textarea
          name="concertDescription"
          placeholder="Description"
          value={values.concertDescription}
          onChange={handleFormData("concertDescription")}
          className="my__text__area"
          rows="5"
        />{" "}
        <input
          type="button"
          className="login__button cd__button"
          value="Next"
          onClick={nextStep}
        />
        <div className="progress__bar di__bar">
          <div className="progress__step step__3"></div>
        </div>
      </FormBox>
    </>
  );
};

export default ConcertDescription;
