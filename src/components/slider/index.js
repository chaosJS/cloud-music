import React, { memo, useEffect, useState } from 'react'

import { SliderContainer } from './style'

import 'swiper/swiper-bundle.css'
import Swiper, { Pagination } from 'swiper'
Swiper.use([Pagination])
const Slider = memo((props) => {
  const [sliderSwiper, setSliderSwiper] = useState(null)
  const { bannerList } = props
  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      let newSliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: { el: '.swiper-pagination' }
      })
      setSliderSwiper(newSliderSwiper)
    }
    /**
     // 仅在 count 更改时更新 
      useEffect(() => {
          document.title = `You clicked ${count} times`;
      }, [count]); 
   */
    // 如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React 跳过对 effect 的调用，只要传递数组作为 useEffect 的第二个可选参数即可：
  }, [bannerList.length, sliderSwiper])

  return (
    <SliderContainer>
      <div className='before'></div>
      <div className='slider-container'>
        <div className='swiper-wrapper'>
          {bannerList.map((slider, index) => {
            return (
              <div className='swiper-slide' key={slider.imageUrl + index}>
                <div className='slider-nav'>
                  <img
                    src={slider.imageUrl}
                    width='100%'
                    height='100%'
                    alt='推荐'
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className='swiper-pagination'></div>
      </div>
    </SliderContainer>
  )
})

export default Slider
