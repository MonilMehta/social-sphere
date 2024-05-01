import React from 'react';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa'; // Import icons from FontAwesome
import defaultImage from '../assets/profile-img.jpg'; // Default image placeholder
// import '../styles/Post.css';

const PostCard = ({ post }) => {
  // Extract data from the post object
  const { mediaFile, caption, postedBy, numberOfLikes } = post;
  const { username, name, profilepic } = postedBy;

  // Determine the post image URL or use a default image
  const postImg = mediaFile && mediaFile.length > 0 ? mediaFile[0] : null;

  return (
    <div className='p-5 mb-10 mt-8 w-[35vw] h-[90vh] rounded-2xl border-2'>
      {/* User avatar and username */}
      <div className='flex flex-row items-center mb-5 ml-8'>
        <img src={profilepic || defaultImage} alt='User avatar' className='w-12 h-12 rounded-full' />
        <h3 className='ml-2 text-black'>@{username || 'Unknown'}</h3>
      </div>

      {/* Display the post image or a placeholder */}
      <div className='h-3/4 flex justify-center'>
        {postImg ? (
          <img src={postImg} alt='Post Image' className='rounded-md h-full ' />
        ) : (
          <div className='h-full bg-slate-100'></div>
        )}
      </div>

      {/* Post interaction icons and details */}
      <div className='post-icons flex ml-4 mt-2'>
        <div className='icon-wrapper mr-6'>
          <FaThumbsUp size={24} />
        </div>
        <div className='icon-wrapper mr-6'>
          <FaComment size={24} />
        </div>
        <div className='icon-wrapper'>
          <FaShare size={24} />
        </div>
        <div className='post-details ml-auto mr-4 flex'>
          <h4 className='mr-4 text-white'>{numberOfLikes} Likes</h4>
          <h4 className='text-white'>{post.numberOfComments} Comments</h4>
        </div>
      </div>

      {/* Display the post caption */}
      <div className='textbody ml-4'>
        <p className='mt-4'>{caption}</p>
      </div>
    </div>
  );
};

export default PostCard;
