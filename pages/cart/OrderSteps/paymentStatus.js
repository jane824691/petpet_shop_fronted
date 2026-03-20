import { useEffect, useState } from 'react'
import Image from 'next/image'
import OrderUnderMember from '../[oid]'
import { useIntl } from 'react-intl'
import { doc, firestoreDb, onSnapshot } from '@/utils/firebase'
import dynamic from 'next/dynamic'

const PaymentStatus = () => {
  const intl = useIntl()
  const [oid, setOid] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 因F5重整會回到server component, lottie這種三方套件預設是CSR渲染
  const CatLoader = dynamic(
    () =>
      import('@/components/hooks/use-loader/components').then(
        (mod) => mod.CatLoader
      ),
    {
      ssr: false,
    }
  )

  useEffect(() => {
    setIsLoading(true)
    const storedOid = sessionStorage.getItem('last_oid')
    if (storedOid) {
      setOid(storedOid)
    }
  }, [])

  useEffect(() => {
    if (!oid) return

    const unsubscribe = onSnapshot(
      doc(firestoreDb, 'order_events', oid),
      (snapshot) => {
        console.log('Firestore event:', snapshot.data())

        if (!snapshot.exists()) return

        const data = snapshot.data()

        if (data.status === 'success') {
          setIsLoading(false)
          unsubscribe()
        }

        if (data.status === 'fail') {
          setIsLoading(false)
          unsubscribe()
        }
      }
    )

    return () => unsubscribe()
  }, [oid])

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center w-100 mb-5 vh-100">
          <CatLoader />
        </div>
      ) : (
        <div className="d-flex m-5 flex-column">
          {oid && (
            <>
              {orderStatus === null ? (
                <></>
              ) : orderStatus === 1 ? (
                <h2 className="mx-auto my-auto text-center pt-5">
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
                <h2 className="mx-auto my-auto text-center pt-5">
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
      )}
    </>
  )
}

export default PaymentStatus
