import React from 'react'
import './Occasions.css'
import pic1 from "../../images/pic/BirdayG.avif"
import pic2 from "../../images/pic/party4.jpg"
import pic3 from "../../images/pic/Anni.jpg"
import pic4 from "../../images/pic/wed.jpg"



export default function Occasions() {

    const occasionData = [
        { id: 1, img: pic1, title: "Birthday"},
        { id: 2, img: pic2, title: "party"},
        { id: 3, img: pic3, title: "Anniversary"},
        { id: 4, img: pic4, title: "wedding"},
    ]
  return (
    <>
      <div className='OccasionsMainSec'>
        <div className='OccasionHeadSec'>
            <h2 className='OccasionTitle'>Shop By Occassions & Relations</h2>
            <p className='OccasionSubtitle'>Surprise Your Loved Ones : </p>

        </div>

        <div className='container'>
            <div className='OccasionCardSec'>
               {
                occasionData.map((item,index)=>(
                     <div className='OccasionCard'>
                     <img src={item.img} alt="" className='occasionalPic' />
                        <h3>{item.title}</h3>
                    </div>
                ))
            }
            </div>
        </div>

      </div>
    </>
  )
}
