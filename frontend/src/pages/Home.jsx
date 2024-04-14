import React from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Posts from "../components/Posts";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="flex relative top-20 z-10">
        <div className="flex-none w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col items-center mt-6">
          <CreatePost />
          <Posts />
        </div>
        <div className="flex-none w-64 h-64 p-10 mt-10 mr-10 rounded-lg">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
