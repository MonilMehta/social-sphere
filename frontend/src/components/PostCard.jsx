import React from 'react';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa'; // Import icons from FontAwesome
import image from '../assets/profile-img.jpg';
import postimage from '../assets/images.jpeg';
// import '../styles/Post.css';
const PostCard = ({ post }) => {
  // Check if the post has a preview image URL, otherwise use a default image
  const postImg = post?.url ||  post.preview?.images[0]?.source.url || null;
  // Check if the post has an author, otherwise provide a default author name
  const author = post.author || 'Unknown';
  console.log(post)
  return (
    // <div className='postcard'>
    //   <div className='user-details'>
    //     <img src={image} alt='User avatar' className='profile-img' />
    //     <h3>@{author}</h3>
    //   </div>
    //   {/* Display the post image */}
    //   <div className='imagepost'>
    //   {postImg ? (
    //     <img src={postImg} alt='' className='post-img' />
    //   ) : (
    //     <img src='postimg' alt='' className='post-img' />
    //   )}
    //   </div>

    //   <div className='post-icons'>
    //     <div className='icon-wrapper'>
    //       <FaThumbsUp size={24} />
    //     </div>
    //     <div className='icon-wrapper'>
    //       <FaComment size={24} />
    //     </div>
    //     <div className='icon-wrapper'>
    //       <FaShare size={24} />
    //     </div>
    //     <div className='post-details'>
    //       <h4>{post.ups} Likes</h4>
    //       <h4>0 Comments</h4>
    //     </div>
    //   </div>
    //   {/* Display the post title */}
    //   <div className='textbody'>
    //     <p>{post.title}</p>
    //   </div>
    // </div>
    <div className='p-5 mb-10 mt-8 w-[35vw] h-[90vh] rounded-2xl border-2'>
      <div className='flex flex-row items-center mb-5 ml-8'>
        <img src={image} alt='User avatar' className='w-12 h-12 rounded-full' />
        <h3 className='ml-2 text-black'>@{author}</h3>
      </div>
      {/* Display the post image */}
      <div className='h-3/4 flex justify-center'>
        {postImg ? (
          <img src={postImg} alt='Post Image' className='rounded-md h-full ' />
        ) : (
          <div className='h-full bg-slate-100'></div>
        )}
      </div>

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
          <h4 className='mr-4 text-white'>{post.ups} Likes</h4>
          <h4 className='text-white'>0 Comments</h4>
        </div>
      </div>
      {/* Display the post title */}
      <div className='textbody ml-4'>
        <p className='mt-4'>{post.title}</p>
      </div>
    </div>
  );
};

export default PostCard;
