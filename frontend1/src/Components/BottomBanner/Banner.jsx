import React from 'react'
import './banner.css'
import banner from "../../images/1700 by 320 banner/Banner1.jpg"

export default function Banner() {
  return (
    <>
      <div className='BannerSection'>
        <img src={banner} className='BannerImg' alt="" />
      </div>
    </>
  )
}
