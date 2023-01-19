import React, { useState } from "react";
import FormBox from "../form/FormBox";
import "./UploadRecording.css";

import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["MP4", "MOV", "WAV", "MP3"];

const UploadRecording = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  uploadFile,
  file,
  setFile,
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

  const handleChange = (file) => {
    setFile(file);
    handleFormData("concertRecording");
    uploadFile(file, "ConcertRecordings");
    nextStep();
  };

  return (
    <>
      <FormBox>
        {whileUploading && infoBox()}
        {showInfo && (
          <div className="info__pop__up">
            <div className="info__box">
              <p>
                Upload your complete show recording in video or audio format.
              </p>
            </div>
          </div>
        )}
        <div className="required__star upload__star">&#42;</div>
        <i
          className="fa-solid fa-circle-info float__icon"
          style={{ marginLeft: "176px" }}
          onClick={switchShowInfo}
        ></i>
        <button className="back__button" type="button" onClick={prevStep}>
          Back
        </button>
        <form className="upload__form">
          <div className="center__title">
            {file && <h3 className="float__title">File: {file.name}</h3>}
            {file === "" && (
              <h3 className="float__title">Upload Concert Recording</h3>
            )}
          </div>
          <div className="uploader__box">
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
                      <span className="highlight">Click to Upload</span>
                    </>
                  </div>
                  <p className="upload__form__box__bottom">
                    [MP4, MOV, MP3, WAV]
                  </p>
                </div>
              }
            />
          </div>

          <input
            type="button"
            className="login__button"
            value="Next"
            onClick={nextStep}
          />
          <div className="progress__bar">
            <div className="progress__step step__1"></div>
          </div>
        </form>
      </FormBox>
    </>
  );
};

export default UploadRecording;
