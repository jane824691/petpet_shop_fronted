import React from "react"
import Image from 'next/image'

const paymentStatus = () => {


  return (
    <>
      <div className='d-flex m-5' style={{ height: '50vh' }}>
        <h2 className='mx-auto my-auto text-center'>
          付款成功！
          <br/>
          <Image
            src={'/pics/nike.png'}
            alt="打勾"
            width="100"
            height="100"
            className="mx-auto my-3"
          />
        </h2>
        {/* '/pics/error.png' */}

      </div>
    </>
  )
}

export default paymentStatus
