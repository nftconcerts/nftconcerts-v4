import React, { useState, useEffect } from "react";
import "./AccountImage.css";
import FormBox from "../form/FormBox";
import { FileUploader } from "react-drag-drop-files";
import { db, fetchCurrentUser, storage } from "./../../firebase";
import {
  getDownloadURL,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";
import { ref as dRef, set, onValue } from "firebase/database";
import makeid from "./../../scripts/makeid";

const fileTypes = ["JPG", "PNG", "GIF"];

const AccountImage = () => {
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [update, setUpdate] = useState(1);

  const [fileUrl, setFileUrl] = useState();

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //download User Data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser, update]);

  //upload files to Firebase Storage
  const uploadFile = async (file, folder) => {
    if (!file) return;
    const storageRef = sRef(
      storage,
      `/private/${currentUser.user.uid}/${folder}/${makeid(5)}-${file.name}`
    );
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
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("upload url: ", url);
          pushChange(url);
          setFileUrl(url);
        });
      }
    );
  };

  const pushChange = (url) => {
    set(dRef(db, "users/" + currentUser.user.uid + "/image"), url).then(
      setUpdate(update + 1)
    );
  };

  const handleChange = (file) => {
    setFile(file);
    uploadFile(file, "accountImages");
  };

  return (
    <FormBox>
      <img src={userData?.image} className="change__account__image"></img>
      {(fileUrl && (
        <h3 className="change__account__title">Image Updated</h3>
      )) || (
        <>
          {(uploadProgress > 0 && (
            <h3 className="change__account__title">Uploading...</h3>
          )) || (
            <h3 className="change__account__title">
              Upload a New Profile Image
            </h3>
          )}
        </>
      )}
      <div className="image__uploader__box">
        <FileUploader
          handleChange={handleChange}
          name="account__image"
          className="image__uploader__box"
          types={fileTypes}
          multiple={false}
          children={
            <div className="inside__image__uploader__div">
              <div>Drag & Drop or Click to Upload</div>
              <div>[JPG, PNG, GIF]</div>
            </div>
          }
        />
      </div>
      <div className="back__button__text">
        <a href="/my-account">Back to Account View</a>
      </div>
    </FormBox>
  );
};

export default AccountImage;
