import React, { useState, useEffect } from "react";

const RightSidebar = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translation = Math.min(scrollY, 160); // Limit translation to 20 pixels
  // const sidebarStyles = {
  //   flex: "0 0 250px", /* Fixed width for the right sidebar */
  //   height: "25rem", /* Fixed height for the right sidebar */
  //   border: "2px solid white",
  //   padding: "40px",
  //   marginTop: "20px",
  //   marginRight: "40px",
  //   borderRadius: "20px",
  //   right: "0",
  //   width: "20rem",
  //   position: "fixed",
  //   transform: `translateY(${-translation}px)`,
  //   transition: "transform 0.5s ease-in-out",
  // };

  return (
    <div className="h-72 border-2 p-4 mt-5 mr-10 rounded-2xl fixed top-64 right-0 w-72 transform transition-transform duration-500 ease-in-out" style={{ transform: `translateY(${-translation}px)` }}>
      <h3 className="text-center">Follow:</h3>
    </div>
  );
};

export default RightSidebar;
