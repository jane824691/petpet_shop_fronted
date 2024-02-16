import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'


// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules'

export default function CarouselSwiper() {
  return (
    <>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src="../../images/product/carousel 1.png"
            className="d-block mx-auto"
            alt="AD1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="../../images/product/carousel 2.png"
            className="d-block mx-auto"
            alt="AD1"
          />
        </SwiperSlide>
        <SwiperSlide>
        <img
          src="../../images/product/carousel 3.png"
          className="d-block mx-auto"
          alt="AD1"
        />
        </SwiperSlide>

      </Swiper>
    </>
  )
}
