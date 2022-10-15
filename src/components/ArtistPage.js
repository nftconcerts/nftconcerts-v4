import React from "react";
import "./ArtistPage.css";
import { useParams } from "react-router-dom";

const ArtistPage = () => {
  let { id } = useParams();
  console.log("ID: ", id);
  return <div>ArtistPage</div>;
};

export default ArtistPage;
