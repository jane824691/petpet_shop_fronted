import { useEffect, useState } from 'react'
import Image from 'next/image'
import OrderUnderMember from "../[oid]"
import { useIntl } from 'react-intl'

const PaymentStatus = () => {
  const intl = useIntl()
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
        {oid && (
          <>
            {orderStatus === null ? (
              <></>
            ) : orderStatus === 1 ? (
              <h2 className='mx-auto my-auto text-center pt-5'>
                {intl.formatMessage({ id: 'cart.paymentSuccess' })}
                <br />
                <Image
                  src={'/pics/nike.png'}
                  alt={intl.formatMessage({ id: 'cart.checkmark' })}
                  width={100}
                  height={100}
                  className="mx-auto my-3"
                />
              </h2>
            ) : (
              <h2 className='mx-auto my-auto text-center pt-5'>
                {intl.formatMessage({ id: 'cart.paymentFailed' })}
                <br />
                <Image
                  src={'/pics/error.png'}
                  alt={intl.formatMessage({ id: 'cart.errorIcon' })}
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
