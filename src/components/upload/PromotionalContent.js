import React, { useState } from "react";
import FormBox from "../form/FormBox";
import { FileUploader } from "react-drag-drop-files";
import "./PromotionalContent.css";

const imgFileTypes = ["PNG", "JPG"];
const fileTypes = ["MP4", "MOV", "WAV", "MP3"];

const PromotionalContent = ({
  prevStep,
  nextStep,
  handleFormData,
  values,
  uploadFile1,
  uploadFile2,
  thumbnailFile,
  setThumbnailFile,
  promoClipFile,
  setPromoClipFile,
  whileUploading,
  infoBox,
}) => {
  const [error, setError] = useState(false);

  const handleThumbnailChange = (file) => {
    setThumbnailFile(file);
    handleFormData("concertThumnbailImage");
    uploadFile1(file, "ThumbnailImage");
  };

  const handlePromoChange = (file) => {
    setPromoClipFile(file);
    handleFormData("concertPromoClip");
    uploadFile2(file, "PromoClip");
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
                Thumbnail Image is Required. <br /> Promo Clip is Optional{" "}
                <br />
                (but recommneded)
              </p>
            </div>
          </div>
        )}
        <div className="required__star thumbnail__star">&#42;</div>

        <i
          className="fa-solid fa-circle-info float__icon"
          style={{ marginLeft: "176px" }}
          onClick={switchShowInfo}
        ></i>
        <button className="back__button" type="button" onClick={prevStep}>
          Back
        </button>
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
                <h5 className="subtitle__float__title ">(1:1 Aspect Ratio)</h5>
              </>
            )}
          </div>
          <div className="uploader__box">
            <FileUploader
              class="uploader__box"
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
        <div>
          <div className="thumbnail__center__title">
            {promoClipFile && (
              <>
                <h3 className="thumbnail__float__title">
                  File: {promoClipFile.name}
                </h3>
                <h5 className="subtitle__float__title ">
                  (Optional, 30 Seconds Max)
                </h5>
              </>
            )}
            {promoClipFile === "" && (
              <>
                <h3 className="thumbnail__float__title">Upload Promo Clip</h3>
                <h5 className="subtitle__float__title ">
                  (Optional, 30 Seconds Max)
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
        {/* <label>Thumbnail Image Link</label>
      <input
        name="concertThumbnailImage"
        placeholder="Upload Thumbnail Image"
      />{" "}
      <label>Upload Promo Clip (30 seconds max)</label>
      <input
        name="concertPromoClip"
        placeholder="Upload Promo Clip (30 seconds max)"
      />{" "}
      <label>Thumbnail Image Link</label>
      <input
        name="concertPromoContent"
        placeholder="Add Additional Public Promo Images or Clips"
      />{" "} */}
        <input
          type="button"
          className="login__button rules__button pc__button"
          value="Next"
          onClick={nextStep}
        />
        <div className="progress__bar">
          <div className="progress__step step__5"></div>
        </div>
      </FormBox>
    </>
  );
};

export default PromotionalContent;
