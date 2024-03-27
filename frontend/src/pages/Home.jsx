import React from 'react'
import Sidebar from '../components/Sidebar'
import RightSidebar from '../components/RightSidebar'
import Posts from '../components/Posts'

const Home = () => {
  return (
    <div className='mainpage'>
        <div className='main1'>
            <Sidebar />
        </div>
        <div className='main2'>
          <Posts/>
        </div>
        <div className='main3'>
          <RightSidebar />
        </div>
    </div>
  )
}

export default Home
