import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard'; // Import the PostCard component

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get('https://social-sphere-xzkh.onrender.com/api/v1/posts/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const fetchedPosts = response.data;
        setPosts(fetchedPosts);
        console.log('Posts fetched successfully:', fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []); // Empty dependency array means this effect runs only once after mount

  return (
    <div className="flex flex-col items-start">
      {Array.isArray(posts) && posts.map(post => (
        <PostCard key={post._id} post={post} /> // Assuming post has _id property
      ))}
    </div>
  );
};

export default Posts;
