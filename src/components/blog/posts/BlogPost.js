import React from "react";
import "./BlogPost.css";
import "./../Blog.css";
import { useNavigate } from "react-router-dom";

function BlogPost({ children, postDate, postTitle, prevPost, nextPost }) {
  let navigate = useNavigate();
  return (
    <div className="blog__page">
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
      </div>
    </div>
  );
}

export default BlogPost;
