import React from 'react';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa'; // Import icons from FontAwesome
import image from '../assets/profile-img.jpg';
import postimage from '../assets/images.jpeg';
import '../styles/Post.css';
const PostCard = ({ post }) => {
  // Check if the post has a preview image URL, otherwise use a default image
  const postImg = post?.url ||  post.preview?.images[0]?.source.url || null;
  // Check if the post has an author, otherwise provide a default author name
  const author = post.author || 'Unknown';
  console.log(post)
  return (
    <div className='postcard'>
      <div className='user-details'>
        <img src={image} alt='User avatar' className='profile-img' />
        <h3>@{author}</h3>
      </div>
      {/* Display the post image */}
      <div className='imagepost'>
      {postImg ? (
        <img src={postImg} alt='' className='post-img' />
      ) : (
        <img src='postimg' alt='' className='post-img' />
      )}
      </div>

      <div className='post-icons'>
        <div className='icon-wrapper'>
          <FaThumbsUp size={24} />
        </div>
        <div className='icon-wrapper'>
          <FaComment size={24} />
        </div>
        <div className='icon-wrapper'>
          <FaShare size={24} />
        </div>
        <div className='post-details'>
          <h4>{post.ups} Likes</h4>
          <h4>0 Comments</h4>
        </div>
      </div>
      {/* Display the post title */}
      <div className='textbody'>
        <p>{post.title}</p>
      </div>
    </div>
  );
};

export default PostCard;
