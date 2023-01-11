import React, { useState, useEffect } from "react";
import "./BlogPost.css";
import "./../Blog.css";
import { useNavigate } from "react-router-dom";
import ProductionRow from "../../home/ProductionRow";
import ProductionPop from "../../home/ProductionPop";
import { fetchCurrentUser } from "../../../firebase";

function BlogPost({ children, postDate, postTitle, prevPost, nextPost }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [productionID, setProductionID] = useState(0);
  const [showProductionPop, setShowProductionPop] = useState();

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);
  let navigate = useNavigate();
  return (
    <div className="blog__page">
      {showProductionPop && (
        <ProductionPop
          currentUser={currentUser}
          productionID={productionID}
          setProductionID={setProductionID}
          setShowProductionPop={setShowProductionPop}
          setCurrentUser={setCurrentUser}
        />
      )}
      <div className="blog__header">
        <div className="blog__header__contents"></div>
        <div className="blog__fadeBottom"></div>
      </div>
      <div className="post__page">
        <div className="post__overall">
          <div className="post__header">
            <h1 className="post__title">{postTitle}</h1>
            <div className="post__author__div">
              <p className="post__author">Author: Jimmy Dendrinos</p>
              <p className="post__date">Date: {postDate}</p>
            </div>
          </div>
          <div className="post__box">{children}</div>
        </div>
        <div className="post__buttons__div">
          <button
            className="post__button post__previous__button"
            onClick={() => {
              navigate(prevPost);
            }}
          >
            &#171; Previous
          </button>
          <button
            className="post__button post__next__button mobile__hide"
            onClick={() => {
              navigate("/blog");
            }}
          >
            View All
          </button>
          <button
            className="post__button post__next__button"
            onClick={() => {
              navigate(nextPost);
            }}
          >
            Next &#187;
          </button>
        </div>
      </div>{" "}
      <div className="blog__footer">
        <div className="blog__footer__content">
          {" "}
          <ProductionRow
            setShowProductionPop={setShowProductionPop}
            productionID={productionID}
            setProductionID={setProductionID}
            intro="Support the Build"
          />
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
