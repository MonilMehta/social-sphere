// import React from 'react'

// const CreatePost = () => {
//   return (
//     <div className='create-post'>
//       <h3>Create Post</h3>
//       <form>
//         <textarea placeholder='What Circling?'></textarea>
//         <button type='submit'>Post</button>
//       </form>
//     </div>
//   )
// }

// export default CreatePost

import React, { useState } from "react";

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    // Reset caption and files when closing modal
    setCaption("");
    setFiles([]);
  };

  const handleCaptionChange = (e) => setCaption(e.target.value);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    // Handle post submission with caption and files
    console.log("Caption:", caption);
    console.log("Files:", files);
    // Reset caption and files after submission
    setCaption("");
    setFiles([]);
    closeModal();
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={openModal}
      >
        Create Post
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Create Post</h3>
            <form className="w-full max-w-lg" onSubmit={handlePostSubmit}>
              <textarea
                className="w-full border rounded-md p-2 mb-4"
                placeholder="What's on your mind?"
                value={caption}
                onChange={handleCaptionChange}
              ></textarea>
              <input
                type="file"
                className="mb-4"
                multiple
                onChange={handleFileChange}
              />
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
