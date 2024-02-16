import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'next/image'

function ReactBsCarousel() {
  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          src="../../images/product/carousel 1.png"
          className="d-block mx-auto"
          alt="AD1"
          height={'300'}
        />
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="../../images/product/carousel 2.png"
          className="d-block mx-auto"
          alt="AD1"
          height={'300'}
        />

        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="../../images/product/carousel 3.png"
          className="d-block mx-auto"
          alt="AD1"
          height={'300'}
        />

        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default ReactBsCarousel
