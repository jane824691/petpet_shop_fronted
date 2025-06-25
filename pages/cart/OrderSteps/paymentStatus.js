import { useEffect, useState } from 'react'
import Image from 'next/image'
import OrderUnderMember from "../[oid]"

const PaymentStatus = () => {

  const [oid, setOid] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)

  useEffect(() => {
    const storedOid = sessionStorage.getItem('last_oid')
    if (storedOid) {
      setOid(storedOid)
    }
  }, [])

  return (
    <>
      <div className='d-flex m-5 flex-column'>
        {oid &&
          (<>
            {orderStatus === 1 ? (
              <h2 className='mx-auto my-auto text-center pt-5'>
                付款成功！
                <br />
                <Image
                  src={'/pics/nike.png'}
                  alt="打勾"
                  width={100}
                  height={100}
                  className="mx-auto my-3"
                />
              </h2>
            ) : (
              <h2 className='mx-auto my-auto text-center pt-5'>
                付款未成功！
                <br />
                <Image
                  src={'/pics/error.png'}
                  alt="打勾"
                  width={100}
                  height={100}
                  className="mx-auto my-3"
                />
              </h2>
            )}
            <OrderUnderMember oid={oid} onStatusChange={setOrderStatus} />
          </>
          )}
      </div>
    </>
  )
}

export default PaymentStatus
