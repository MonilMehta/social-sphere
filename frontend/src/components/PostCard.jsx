import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/profile-img.jpg";
import axios from "axios";

const PostCard = ({ post, updatePosts }) => {
  const history = useNavigate();
  const { _id, mediaFile, caption, postedBy, numberOfLikes, numberOfComments, hasUserLikedPost } = post;
  const { username, name, profilepic } = postedBy;

  const postImg = mediaFile && mediaFile.length > 0 ? mediaFile[0] : null;
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(""); // Initialize comment state

  const handleCommentClick = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }
  
      const response = await axios.get(
        `https://social-sphere-xzkh.onrender.com/api/v1/comments/p/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      setComments(response.data); // Assuming response.data is an array of comments
      setIsCommentModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `https://social-sphere-xzkh.onrender.com/api/v1/likes/p/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Post liked successfully:", response.data);
      // Update posts after like action
      updatePosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSubmitComment = async () => {
    // Send comment to the server and update comments after successful submission
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `https://social-sphere-xzkh.onrender.com/api/v1/comments/p/${_id}`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Comment posted successfully:", response.data);
      // Update comments after comment submission
      // You may fetch updated comments here or use the existing state
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div
      className="p-5 mb-10 mt-8 w-[35vw] h-[90vh] rounded-2xl border-2"
      style={{ position: "relative" }}
    >
      <div className="flex flex-row items-center mb-5 ml-8">
        <img
          src={profilepic || defaultImage}
          alt="User avatar"
          className="w-12 h-12 rounded-full cursor-pointer"
          onClick={() => history(`/profile/${username}`)}
        />
        <h3 className="ml-2 text-black">@{username || "Unknown"}</h3>
      </div>

      <div className="h-3/4 flex justify-center">
        {postImg ? (
          <img
            src={postImg}
            alt="Post Image"
            className="rounded-md h-full "
          />
        ) : (
          <div className="h-full bg-slate-100"></div>
        )}
      </div>

      <div className="post-icons flex ml-4 mt-2">
        <div
          className="icon-wrapper mr-6 flex flex-row"
          onClick={handleLikeClick}
          style={{ cursor: "pointer" }}
        >
          {numberOfLikes} 
          {hasUserLikedPost?
            <FaThumbsUp className="ml-2 text-red-500" size={24} />:
            <FaThumbsUp className="ml-2" size={24} />
          }
        </div>
        <div
          className="icon-wrapper mr-6 flex flex-row"
          onClick={handleCommentClick}
          style={{ cursor: "pointer" }}
        >
          {numberOfComments} <FaComment className="ml-2" size={24} />
        </div>
        <div className="icon-wrapper">
          <FaShare size={24} />
        </div>
      </div>

      <div className="textbody ml-4">
        <p className="mt-4">{caption}</p>
      </div>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px) hue-rotate(90deg)",
              zIndex: 49,
            }}
          ></div>
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "8px",
              zIndex: 90,
            }}
          >
          <div className="flex flex-row items-center mb-5 ml-8">
          <img
            src={profilepic || defaultImage}
            alt="User avatar"
            className="w-12 h-12 rounded-full"
          />
          <h3 className="ml-2 text-black">@{username || "Unknown"}</h3>
        </div>
  
        <div className="h-3/4 flex justify-center">
          {postImg ? (
            <img
              src={postImg}
              alt="Post Image"
              className="rounded-md h-60 w-80"
            />
          ) : (
            <div></div>
          )}
        </div>
        <div>
        {Array.isArray(comments) && comments.length > 0 && (
          <div>
            {comments.map((comment) => (
              <div key={comment._id} style={{ marginBottom: "8px" }}>
                <p style={{ marginBottom: "4px" }}>{comment.content}</p>
                <p style={{ fontSize: "0.8rem", color: "#888" }}>
                  Posted by: @{comment.commentedBy.username}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "16px" }}>
              Add a Comment
            </h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
              placeholder="Write your comment..."
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setIsCommentModalOpen(false);
                  setComment("");
                }}
                style={{
                  backgroundColor: "#ccc",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PostCard;
