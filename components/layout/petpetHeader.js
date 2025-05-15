import styles from '@/css/petpetHeader.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import AuthContext from '../contexts/AuthContext'
import { useContext } from 'react'
import { useCart } from '@/components/hooks/use-cart-state'
import { useHeaderAnimation } from '@/components/contexts/HeaderAnimationContext'

export default function PetpetHeader() {
  const { auther, logout } = useContext(AuthContext)
  const { items } = useCart()
  // TODO: adding fading animate add & minus button at cart page
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const { showAnimation, addingProductAmount } = useHeaderAnimation()

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.container} p-2`}>
          {/* 網站icon */}
          <Link href="/" className={styles.logoLink}>
            <div className={styles.headerLeft}>
              <div className={styles.logoOut}>
                <Image
                  src="/logo.svg"
                  alt="Vercel Logo"
                  width={130}
                  height={80}
                  priority
                  className={styles.logo}
                />
              </div>
              <div className={styles.brandName}>佩佩星球</div>
            </div>
          </Link>
          {/* 網站icon */}

          {/* <!-- header中間 --> */}
          <div className={styles.headerMiddle}>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.foodPart}`}
              >
                吃起來
              </Link>
            </div>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.outdoorPart}`}
              >
                走起來
              </Link>
            </div>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.toyPart}`}
              >
                玩起來
              </Link>
            </div>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.livingPart}`}
              >
                住起來
              </Link>
            </div>
          </div>
          {/* <!-- header中間 --> */}

          {/* <!-- header右邊 --> */}
          <div className={styles.headerRight}>
            {auther.account ? (
              <>
                <div className={styles.totalQuantity}>{totalQuantity || 0}</div>
                {showAnimation && (
                  <div className={styles.addingAmount}>
                    +{addingProductAmount}
                  </div>
                )}
                <div className={styles.headerRightIcon}>
                  <Link
                    className={styles.headerRightIconLink}
                    href="/cart/OrderSteps"
                  >
                    <i className={`bi bi-cart fs-2 ${styles.iconSmall}`}></i>
                  </Link>
                </div>
              </>
            ) : (
              <>{/* 隱藏 */}</>
            )}
            {auther.account ? (
              <>
                <div className={styles.headerRightIcon}>
                  <Link className={styles.headerRightIconLink} href="">
                    <i className={`bi bi-bell fs-2 ${styles.iconSmall}`}></i>
                  </Link>
                </div>
              </>
            ) : (
              <>{/* 隱藏 */}</>
            )}
            {auther.account ? (
              <>
                <div className={styles.headerRightIcon}>
                  <Link className={styles.headerRightIconLink} href="/member">
                    <i className={`bi bi-person fs-2 ${styles.iconSmall}`}></i>
                  </Link>
                </div>
              </>
            ) : (
              <>{/* 在 auther.account 不存在的情況下，隱藏 ICONS */}</>
            )}
            {auther.account ? (
              <>
                <div className={styles.headerRightAccount}>
                  <span>{auther.account}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`${styles.headerRightIcon} d-flex align-items-center`}
                >
                  <Link
                    className={styles.headerRightIconLink}
                    style={{ color: 'white', textDecoration: 'none' }}
                    href="/member/login"
                  >
                    登入
                  </Link>
                </div>
              </>
            )}
            {auther.account ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    className={styles.test}
                    style={{ boxShadow: 'none', backgroundColor: 'none', border: 'none' }}
                  ></Dropdown.Toggle>

                  <Dropdown.Menu >
                    <Dropdown.Item style={{ maxWidth: '100vw', overflowX: 'auto' }}
                      onClick={(e) => {
                        e.preventDefault()
                        logout()
                      }}
                    >
                      <Link href="/">登出</Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Dropdown style={{ display: 'none' }}>
                  <Dropdown.Toggle></Dropdown.Toggle>
                </Dropdown>
              </>
            )}
          </div>
          {/* <!-- header右邊 --> */}
        </div>
      </header>
    </>
  )
}
