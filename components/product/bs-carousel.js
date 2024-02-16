import React from 'react'

export default function BsCarousel() {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="../../images/product/carousel 1.png" className="d-block w-50 mx-auto" alt="AD1" />
        </div>
        <div className="carousel-item">
          <img src="../../images/product/carousel 2.png" className="d-block w-50 mx-auto" alt="AD2" />
        </div>
        <div className="carousel-item">
          <img src="../../images/product/carousel 3.png" className="d-block w-50 mx-auto" alt="AD3" />
        </div>
      </div>
      <button
        className="carousel-control-prev Carouselbtn:hover"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next Carouselbtn:hover"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
