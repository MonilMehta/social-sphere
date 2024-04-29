import React, { useState, useEffect } from "react";
import AvatarPlaceholder from "../assets/profile-img.jpg"; // Placeholder image for user avatar
import { MdAdd } from "react-icons/md"; // Plus icon from React Icons

const RightSidebar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [users, setUsers] = useState([]);

  // Simulated data for user recommendations
  const recommendedUsers = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translation = Math.min(scrollY, 160);

  const handleFollow = (userId) => {
    // Logic to handle follow action (e.g., add user to followed list)
    console.log(`Follow user with ID ${userId}`);
  };

  return (
    <div className="h-72 border-2 p-4 mt-5 mr-10 rounded-2xl fixed top-64 right-0 w-72 transform transition-transform duration-500 ease-in-out" style={{ transform: `translateY(${-translation}px)` }}>
      <h3 className="text-center mb-4">Follow:</h3>
      <ul className="space-y-2">
        {recommendedUsers.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={AvatarPlaceholder}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
              <span style={{fontSize:'1.5rem',marginLeft:'20px'}}>{user.name}</span>
            </div>
            <button
              className="bg-black text-white rounded-full p-2"
              onClick={() => handleFollow(user.id)}
            >
              <MdAdd />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
