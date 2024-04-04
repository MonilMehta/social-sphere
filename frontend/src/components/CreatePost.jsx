import React from 'react'

const CreatePost = () => {
  return (
    <div className='create-post'>
      <h3>Create Post</h3>
      <form>
        <textarea placeholder='What Circling?'></textarea>
        <button type='submit'>Post</button>
      </form>
    </div>
  )
}

export default CreatePost
