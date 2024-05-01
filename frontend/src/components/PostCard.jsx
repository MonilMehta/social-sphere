import React from 'react';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa'; // Import icons from FontAwesome
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import defaultImage from '../assets/profile-img.jpg'; // Default image placeholder
import axios from 'axios';

const PostCard = ({ post, updatePosts }) => {
  const history = useNavigate(); // Get history object from react-router-dom
  const { _id, mediaFile, caption, postedBy, numberOfLikes, numberOfComments } = post;
  const { username, name, profilepic } = postedBy;

  const postImg = mediaFile && mediaFile.length > 0 ? mediaFile[0] : null;

  const handleCommentClick = () => {
    // Navigate to the comments page with the post ID as a parameter
    history(`/comments/${_id}`, { post });
  };

  const handleLikeClick = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
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

      console.log('Post liked successfully:', response.data);
      // Update posts after like action
      updatePosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className='p-5 mb-10 mt-8 w-[35vw] h-[90vh] rounded-2xl border-2'>
      <div className='flex flex-row items-center mb-5 ml-8'>
        <img src={profilepic || defaultImage} alt='User avatar' className='w-12 h-12 rounded-full' />
        <h3 className='ml-2 text-black'>@{username || 'Unknown'}</h3>
      </div>

      <div className='h-3/4 flex justify-center'>
        {postImg ? (
          <img src={postImg} alt='Post Image' className='rounded-md h-full ' />
        ) : (
          <div className='h-full bg-slate-100'></div>
        )}
      </div>

      <div className='post-icons flex ml-4 mt-2'>
        <div className='icon-wrapper mr-6 flex flex-row' onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
          {numberOfLikes} <FaThumbsUp className='ml-2' size={24} />
        </div>
        <div className='icon-wrapper mr-6 flex flex-row' onClick={handleCommentClick} style={{ cursor: 'pointer' }}>
          {numberOfComments} <FaComment className='ml-2' size={24} />
        </div>
        <div className='icon-wrapper'>
          <FaShare size={24} />
        </div>
      </div>

      <div className='textbody ml-4'>
        <p className='mt-4'>{caption}</p>
      </div>
    </div>
  );
};

export default PostCard;
