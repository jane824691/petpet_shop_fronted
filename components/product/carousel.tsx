import React, { useState, useEffect } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

interface Images {
  photo_path?: string
  sort_order?: number
}

// Props interface
interface CarouselProps {
  pid?: string;
  firstImage: string;
  images: Images[];
}

export default function Carousel({
  firstImage,
  images,
}: CarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  const DEFAULT_IMG = '../image/product/638348807730300000 (1).jfif'

  // 商品圖可能存在專案路徑裡，也可能存在Firebase的連結
  const getImagePath = (image?: string | null) => {
    if (!image) return DEFAULT_IMG
    if (image.startsWith('http')) return image
    return `../image/product/${image}`
  }

  const imagePath01 = getImagePath(firstImage)
  
  return (
    <>
      {/* as React.CSSProperties - 告訴 TypeScript 這裡是合法的 CSS 屬性 */}
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={50}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        <SwiperSlide>
          <img src={imagePath01} className="mx-auto img-fluid w-100" />
        </SwiperSlide>

        {images?.map((v, i) => (
          <SwiperSlide key={v.sort_order ?? i}>
            <img
              src={getImagePath(v.photo_path)}
              className="mx-auto img-fluid w-100"
              alt="images in Swiper"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={50}
        slidesPerView={3}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={imagePath01} className="mx-auto img-fluid w-100" />
        </SwiperSlide>

        {images?.map((v, i) => (
          <SwiperSlide key={v.sort_order ?? i}>
            <img
              src={getImagePath(v.photo_path)}
              className="mx-auto img-fluid w-100"
              alt="images in Swiper"
            />
          </SwiperSlide>
        ))}

      </Swiper>
    </>
  )
}