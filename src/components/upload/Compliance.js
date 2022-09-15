import React, { useEffect, useState } from "react";
import FormBox from "../form/FormBox";
import "./Compliance.css";

const Compliance = ({
  prevStep,
  nextStep,
  handleFormData,
  values,

  uploadProgress,
  uploadProgress1,
  uploadProgress2,
  whileUploading,
  infoBox,
}) => {
  const [showCompliance, setShowCompliance] = useState(false);

  const ComplianceCheck = () => {
    if (values.concertRecording === "") {
      return (
        <>
          Missing Concert Recording
          <br /> Please go back to the beginning and upload.
        </>
      );
    } else if (uploadProgress < 100) {
      return (
        <>
          Still Uploading. <br />
          Please wait until upload completes.
        </>
      );
    } else if (values.concertName === "") {
      return (
        <>
          Missing Concert Name. <br />
          Please go back and input.
        </>
      );
    } else if (values.concertArtist === "") {
      return (
        <>
          Missing Artist Name.
          <br /> Please go back and input.
        </>
      );
    } else if (values.concertPerformanceDate === "") {
      return (
        <>
          Missing Performance Date.
          <br /> Please go back and input.
        </>
      );
    } else if (values.concertRecordingType === "") {
      return (
        <>
          Missing Recording Type.
          <br /> Please go back and select.
        </>
      );
    } else if (values.concertNumSongs === "") {
      return (
        <>
          Setlist is required.
          <br /> Please go back and input.
        </>
      );
    } else if (values.concertSetList === []) {
      return (
        <>
          Setlist is Required.
          <br /> Please go back and input.
        </>
      );
    } else if (values.concertThumbnailImage === "") {
      return (
        <>
          Thumbnail Image is Required.
          <br /> Please go back and upload.
        </>
      );
    } else if (values.concertSupply === "") {
      return (
        <>
          Missing NFT Quantity.
          <br /> Please go back and input.
        </>
      );
    } else if (values.concertPrice === "") {
      return (
        <>
          Missing NFT Price. <br />
          Please go back and input.
        </>
      );
    } else if (values.concertResaleFee === "") {
      return (
        <>
          Missing Resale Fee.
          <br /> Please go back and select.
        </>
      );
    } else if (values.concertReleaseDate === "") {
      return (
        <>
          Missing Release Date. <br />
          Please go back and input.
        </>
      );
    } else if (values.concertDescription === "") {
      return (
        <>
          Description is required. <br />
          Please go back and select.
        </>
      );
    } else if (!document.getElementById("originalContent").checked) {
      return (
        <>
          Original Content Required. <br />
          Please select checkbox.
        </>
      );
    } else if (!document.getElementById("venuePermission").checked) {
      return (
        <>
          Venue Permission Required.
          <br /> Please select checkbox.
        </>
      );
    } else if (!document.getElementById("exclusiveRights").checked) {
      return (
        <>
          Exclusive Rights Required.
          <br /> Please select checkbox.
        </>
      );
    } else if (!document.getElementById("termsOfService").checked) {
      return "Please Accept the Terms of Service.";
    } else {
      nextStep();
      return 5;
    }
  };

  const switchCompliance = () => {
    if (showCompliance) {
      setShowCompliance(false);
    } else setShowCompliance(true);
  };

  const [uploaded, setUplaoded] = useState(false);

  const checkIfUploaded = () => {
    console.log(
      "checking if uploaded",
      uploadProgress,
      uploadProgress1,
      uploadProgress2
    );
    if (uploadProgress === 100) {
      if (uploadProgress1 === 0) {
        if (uploadProgress2 === 100) {
          setUplaoded(true);
        } else if (uploadProgress2 === 0) {
          setUplaoded(true);
        }
      }

      if (uploadProgress1 === 100) {
        if (uploadProgress2 === 100) {
          setUplaoded(true);
        } else if (uploadProgress2 === 0) {
          setUplaoded(true);
        }
      }
    }
  };

  useEffect(() => {
    checkIfUploaded();
  }, [uploadProgress, uploadProgress1, uploadProgress2]);

  return (
    <FormBox>
      {whileUploading && infoBox()}
      {showCompliance && (
        <div className="compliance__prompt">{ComplianceCheck()}</div>
      )}
      <button className="back__button" onClick={prevStep}>
        Back
      </button>
      <div className="compliance__box">
        <label className="consent">All Content Uploaded Is Original</label>
        <div className="checkbox__div">
          <input
            placeholder="All Content Uploaded Is Original And Mine"
            type="checkbox"
            className="large__checkbox"
            required="required"
            id="originalContent"
          />{" "}
        </div>
        <label className="consent">
          Venue Granted Permission<br></br> to Record the Show
        </label>
        <div className="checkbox__div">
          <input
            placeholder="Venue Granted Permission To Record"
            type="checkbox"
            className="large__checkbox"
            required="required"
            id="venuePermission"
          />{" "}
        </div>
        <label className="consent">
          I Will Not Release This Recording On<br></br> Another Platform
          <br />
          (YouTube, SoundCloud, etc.){" "}
        </label>
        <div className="checkbox__div">
          <input
            placeholder="I will not release this content somewhere else."
            type="checkbox"
            className="large__checkbox"
            required="required"
            id="exclusiveRights"
          />
        </div>
        <label className="consent">
          I agree to the NFT Concerts <br />
          <a
            href="/terms-of-service"
            className="nftc__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
        </label>
        <div className="checkbox__div">
          <input
            name="concertCompliance"
            placeholder="I agree to the NFT Concerts Terms of Service"
            type="checkbox"
            className="large__checkbox"
            required="required"
            id="termsOfService"
          />{" "}
        </div>
        {(whileUploading && !uploaded && (
          <input
            type="submit"
            className="login__button rules__button compliance__button"
            value="Uploading..."
            onClick={switchCompliance}
            disabled={whileUploading}
          />
        )) || (
          <input
            type="submit"
            className="login__button rules__button compliance__button"
            value="Review &#38; Confirm"
            onClick={switchCompliance}
          />
        )}
      </div>
      <div className="progress__bar compliance__bar">
        <div className="progress__step step__7 "></div>
      </div>
    </FormBox>
  );
};

export default Compliance;
