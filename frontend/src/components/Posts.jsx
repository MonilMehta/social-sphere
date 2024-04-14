import React, { useState, useEffect } from 'react';
import PostCard from './PostCard'; // Import the PostCard component

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const subreddit = 'pics'; 
    const limit = 20; 
    fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Optional: log the data to verify
        setPosts(data.data.children.map(child => child.data));
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="flex flex-col items-start">
      {posts.map(post => (
        <PostCard key={post.id} post={post} /> // Pass each post as a prop to PostCard
      ))}
    </div>
  );
};

export default Posts;
