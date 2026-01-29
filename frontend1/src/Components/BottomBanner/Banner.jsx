import React from 'react'
import './banner.css'
import banner from "../../images/pic/Banner11.jpg"

export default function Banner() {
  return (
    <>
      <div className='BannerSection'>
        <img src={banner} className='BannerImg' alt="" />
      </div>
    </>
  )
}
