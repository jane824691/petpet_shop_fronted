import styles from '@/css/petpetHeader.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import AuthContext from '../contexts/AuthContext'
import { useContext } from 'react'
import { useCart } from '@/components/hooks/use-cart-state'
import { useHeaderAnimation } from '@/components/contexts/HeaderAnimationContext'
import { useLanguage } from '@/components/contexts/LanguageContext'
import { useIntl } from 'react-intl'

export default function PetpetHeader() {
  const { locale, changeLanguage } = useLanguage()
  const intl = useIntl()
  const { auther, logout } = useContext(AuthContext)
  const { items } = useCart()
  // TODO: adding fading animate add & minus button at cart page
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const { showAnimation, addingProductAmount } = useHeaderAnimation()

  const toggleLanguage = () => {
    const newLocale = locale === 'zh-TW' ? 'en-US' : 'zh-TW'
    changeLanguage(newLocale)
  }

  const isZH = locale === 'zh-TW'

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.container} p-0 p-sm-2`}>
          {/* 網站icon */}
          <Link href="/" className={styles.logoLink}>
            <div className={styles.headerLeft}>
              <div className={styles.logo} />
              <div className={styles.brandName}>{intl.formatMessage({ id: 'header.logo' })}</div>
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
                {intl.formatMessage({ id: 'header.food' })}
              </Link>
            </div>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.outdoorPart}`}
              >
                {intl.formatMessage({ id: 'header.outdoor' })}
              </Link>
            </div>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.toyPart}`}
              >
                {intl.formatMessage({ id: 'header.toy' })}
              </Link>
            </div>
            <div>
              <Link
                href="/product/list"
                className={`${styles.headerMiddleItem} ${styles.livingPart}`}
              >
                {intl.formatMessage({ id: 'header.living' })}
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
                  <Link className={styles.headerRightIconLink} href="/member">
                    <i className={`bi bi-person fs-2 ${styles.iconSmall}`}></i>
                  </Link>
                </div>
              </>
            ) : (
              <>{/* 在 auther.account 不存在的情況下，隱藏 ICONS */}</>
            )}
            <div
              className={`${styles.headerRightIcon} d-flex align-items-center`}
              onClick={toggleLanguage}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleLanguage();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={intl.formatMessage({ id: 'header.toggleLanguage' })}
            >
            
              <div className={`${styles.headerRightIconLink}`}>
                {isZH ? (
                  <i className={`bi bi-globe2 fs-2 pe-2 ${styles.iconSmall}`}></i>
                ) : (
                  <span>EN</span>
                )}
              </div>
            </div>
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
                    className={`${styles.headerRightIconLink} text-decoration-none`}
                    style={{ color: 'white' }}
                    href="/member/login"
                  >
                    {intl.formatMessage({ id: 'header.login' })}
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
                      <Link href="/">{intl.formatMessage({ id: 'header.logout' })}</Link>
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
