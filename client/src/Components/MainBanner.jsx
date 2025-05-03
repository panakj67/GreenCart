import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const MainBanner = () => {
  return (
    <div className='relative'>
        <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block'/>
        <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden'/>
        <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-20 md:pb-0 px-4 md:px-20 md:pl-18 lg:pl-24 '>
          <h1 className='text-3xl md:text-4xl lg:text-5xl text-gray-700 text-center md:text-left max-w-72 md:max-w-80 lg:max-w-110 font-bold leading-tight lg:leading-15'>Freshness You Can Trust, Savings You will Love!</h1>
          <div className='flex items-center gap-10 mt-6'>
              <Link to={'/products'} className='p-7 md:px-8 py-3 bg-[#4fbf8b] hover:bg-[#44ae7c] transition rounded text-white cursor-pointer'>Shop Now</Link>
              <Link to={'/products'} className='group font-semibold  hidden md:flex items-center gap-2 cursor ppointer'>Explore deals
              <img src={assets.black_arrow_icon} alt="" />
              </Link>
          </div>
        </div>
    </div>
  )
}

export default MainBanner