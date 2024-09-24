import React, { useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';

function SwiperPhoto() {

    useEffect(() => {
        const swiperContainer = document.querySelector('.SwiperContainer');
  
        if (swiperContainer) {
        // 設置 swiper 分頁圓點的寬度和高度
        document.documentElement.style.setProperty('--swiper-theme-color', '#f8723f');
        document.documentElement.style.setProperty('--swiper-pagination-bullet-width', '16px');
        document.documentElement.style.setProperty('--swiper-pagination-bullet-height', '8px');
        document.documentElement.style.setProperty('--swiper-pagination-bullet-border-radius', '8px');

        // 設置非活動狀態的顏色
        document.documentElement.style.setProperty('--swiper-pagination-bullet-inactive-color', '#000000');
        document.documentElement.style.setProperty('--swiper-pagination-bullet-inactive-opacity', '0.2');
    }
    }, []);
  return (
    <div className='SwiperContainer'>
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
        className='swiper'
        >
        <SwiperSlide>
          <img src="../../images/product/carousel 1.png" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="../../images/product/carousel 2.png" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="../../images/product/carousel 3.png" />
        </SwiperSlide>
      </Swiper>
    </div>
    
  );
}

export default SwiperPhoto