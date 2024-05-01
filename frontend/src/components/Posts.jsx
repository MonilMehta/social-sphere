import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard'; // Import the PostCard component

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://social-sphere-xzkh.onrender.com/api/v1/posts/');
        const fetchedPosts = response.data; // Assuming the response contains an array of posts
        setPosts(fetchedPosts);
        
        console.log(JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Run once on component mount
  
  return (
    <div className="flex flex-col items-start">
      {posts.map(post => (
        <PostCard key={post.id} post={post} /> // Pass each post as a prop to PostCard
      ))}
    </div>
  );
};

export default Posts;