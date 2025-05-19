import { useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

// 範例出處
// https://swiperjs.com/demos#thumbs-gallery
// https://codesandbox.io/s/k3cyyc
export default function Carousel({
  pid,
  firstImage,
  mainImage,
  secondaryImage,
  additionalImage,
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const imagePath01 = firstImage
    ? `../image/product/${firstImage}`
    : '../image/product/638348807730300000 (1).jfif'

  const imagePath02 = mainImage
    ? `../image/product/${mainImage}`
    : '../image/product/638348807730300000 (1).jfif'

  const imagePath03 = secondaryImage
    ? `../image/product/${secondaryImage}`
    : '../image/product/638348807730300000 (1).jfif'

  const imagePath04 = additionalImage
    ? `../image/product/${additionalImage}`
    : '../image/product/638348807730300000 (1).jfif'
  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={50}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        <SwiperSlide>
          <img src={imagePath01} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath02} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath03} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath04} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath01} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
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
        <SwiperSlide>
          <img src={imagePath02} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath03} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath04} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imagePath01} className="mx-auto img-fluid w-100" />
        </SwiperSlide>
      </Swiper>
    </>
  )
}
