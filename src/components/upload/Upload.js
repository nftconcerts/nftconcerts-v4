import React, { useState } from "react";
import Rules from "./Rules";
import UploadRecording from "./UploadRecording";
import Compliance from "./Compliance";
import Confirmation from "./Confirmation";
import "./Upload.css";
import {
  getDownloadURL,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";
import { storage, fetchCurrentUser } from "./../../firebase";
import makeid from "./../../scripts/makeid";
import ConcertInfo from "./ConcertInfo";
import ListingInfo from "./ListingInfo";
import "react-datepicker/dist/react-datepicker.css";

function Upload() {
  //State for Steps
  const [formNum, setFormNum] = useState(1);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser());

  // State for form data
  const [formData, setFormData] = useState({
    concertRecording: "",
    concertName: "",
    concertArtist: "",
    concertPerformanceDate: "",
    concertVenue: "",
    concertLocation: "",
    concertTourName: "",
    concertLiveAttendance: "",
    concertRecordingType: "",
    concertDescription: "",
    concertNumSongs: "",
    concertSetList: [],
    concertThumbnailImage: "",
    concertPromoClip: "",
    concertPromoContent: "",
    concertSupply: "",
    concertPrice: "",
    concertResaleFee: "0",
    concertReleaseDate: "",
    concertListingPrivacy: "public",
    concertCompliance: "",
    productionTeamAccess: "true",
  });
  // file upload data
  const [concertRecordingFile, setConcertRecordingFile] = useState(
    formData.concertRecording
  );
  const [thumbnailFile, setThumbnailFile] = useState(
    formData.concertThumbnailImage
  );
  const [promoClipFile, setPromoClipFile] = useState(formData.concertPromoClip);
  const [whileUploading, setWhileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgress1, setUploadProgress1] = useState(0);
  const [uploadProgress2, setUploadProgress2] = useState(0);

  const setFormDate = (date, dateName) => {
    setFormData((prevState) => ({
      ...prevState,
      [dateName]: date,
    }));
  };

  const setPtAccess = (access) => {
    setFormData((prevState) => ({
      ...prevState,
      productionTeamAccess: access,
    }));
  };
  //go to next step
  const nextStep = () => {
    setFormNum(formNum + 1);
  };

  //go back a step
  const prevStep = () => {
    setFormNum(formNum - 1);
  };

  // handling form input data by taking onchange value and updating our previous form data state
  const handleInputData = (input) => (e) => {
    // input value from the form
    const { value } = e.target || {};

    //updating for data state taking previous state and then adding new value to create new object
    setFormData((prevState) => ({
      ...prevState,
      [input]: value,
    }));
  };

  //upload files to Firebase Storage
  const uploadFile = async (file, folder) => {
    if (!file) return;
    const storageRef = sRef(
      storage,
      `/private/${currentUser.user.uid}/${folder}/${makeid(5)}-${file.name}`
    );
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
          setFormData((prevState) => ({
            ...prevState,
            ["concertRecording"]: url,
          }));
        });
      }
    );
  };
  //upload files to Firebase Storage
  const uploadFile1 = async (file, folder) => {
    if (!file) return;
    const storageRef = sRef(
      storage,
      `/private/${currentUser.user.uid}/${folder}/${makeid(5)}-${file.name}`
    );
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
        setUploadProgress1(prog);
        if (prog === 100) {
          setWhileUploading(true);
        }
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFormData((prevState) => ({
            ...prevState,
            ["concertThumbnailImage"]: url,
          }));
        });
      }
    );
  };
  //upload files to Firebase Storage
  const uploadFile2 = async (file, folder) => {
    if (!file) return;
    const storageRef = sRef(
      storage,
      `/private/${currentUser.user.uid}/${folder}/${makeid(5)}-${file.name}`
    );
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
        setUploadProgress2(prog);
        if (prog === 100) {
          setWhileUploading(true);
        }
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFormData((prevState) => ({
            ...prevState,
            ["concertPromoClip"]: url,
          }));
        });
      }
    );
  };

  const uploadInfo = (fileType, progNum) => {
    if (progNum === 0) {
      return;
    } else if (progNum < 100) {
      return (
        <div className="upload__progess">
          <p>
            Uploading {fileType}: {progNum}%
          </p>
        </div>
      );
    } else if (progNum === 100) {
      return (
        <div className="upload__progress">
          <p> {fileType} Uploaded </p>
        </div>
      );
    }
  };

  const infoBox = (version) => {
    return (
      <div className={`upload__info__div ${version}`}>
        <div className="upload__info__box">
          {uploadInfo("Concert Recording", uploadProgress)}
          {uploadInfo("Thumbnail Image", uploadProgress1)}
          {uploadInfo("Promo Clip", uploadProgress2)}
        </div>
      </div>
    );
  };

  //javascript switch case to show different form in each step

  switch (formNum) {
    // case 1 to show stepOne form and passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the form
    case 1:
      return (
        <>
          <Rules
            nextStep={nextStep}
            handleFormData={handleInputData}
            values={formData}
            className="nftc__rules"
            whileUploading={whileUploading}
            infoBox={infoBox}
          />
        </>
      );

    // case 2 to show stepTwo form passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the form
    case 2:
      return (
        <>
          <UploadRecording
            prevStep={prevStep}
            nextStep={nextStep}
            handleFormData={handleInputData}
            values={formData}
            uploadFile={uploadFile}
            file={concertRecordingFile}
            setFile={setConcertRecordingFile}
            whileUploading={whileUploading}
            infoBox={infoBox}
          />
        </>
      );

    case 3:
      return (
        <>
          <ConcertInfo
            prevStep={prevStep}
            nextStep={nextStep}
            handleFormData={handleInputData}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            values={formData}
            setFormDate={setFormDate}
            uploadFile1={uploadFile1}
            whileUploading={whileUploading}
            infoBox={infoBox}
          />
        </>
      );
    case 4:
      return (
        <>
          <ListingInfo
            prevStep={prevStep}
            nextStep={nextStep}
            handleFormData={handleInputData}
            values={formData}
            whileUploading={whileUploading}
            infoBox={infoBox}
            setFormDate={setFormDate}
            uploadFile2={uploadFile2}
            promoClipFile={promoClipFile}
            setPromoClipFile={setPromoClipFile}
            setPtAccess={setPtAccess}
          />
        </>
      );
    case 5:
      return (
        <>
          {whileUploading && infoBox()}
          <Compliance
            prevStep={prevStep}
            nextStep={nextStep}
            handleFormData={handleInputData}
            values={formData}
            whileUploading={whileUploading}
            infoBox={infoBox}
            uploadProgress={uploadProgress}
            uploadProgress1={uploadProgress1}
            uploadProgress2={uploadProgress2}
          />
        </>
      );
    case 6:
      return (
        <>
          <Confirmation
            prevStep={prevStep}
            nextStep={nextStep}
            handleFormData={handleInputData}
            values={formData}
            whileUploading={whileUploading}
            uploadProgress={uploadProgress}
            uploadProgress1={uploadProgress1}
            uploadProgress2={uploadProgress2}
            thumbnailFile={thumbnailFile}
          />
        </>
      );

    default:
  }
}

export default Upload;
