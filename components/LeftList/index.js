import styles from '@/css/favorite.module.css'
import { BsFillTicketDetailedFill, BsFillTrophyFill, BsCart4 } from 'react-icons/bs'
import Link from 'next/link'
import AuthContext from '@/components/contexts/AuthContext'
import { useContext } from 'react'
import Image from 'next/image'
import { useIntl } from 'react-intl'

const LeftList = ({ photo }) => {
    const { auther } = useContext(AuthContext)
    const intl = useIntl()

    return (
        <div className={`${styles.leftList} d-flex align-items-center flex-column`}>
            <div className={styles.memberPicOut}>
                <Image
                    alt=""
                    src=
                    {`${photo
                        ? photo
                        : '/pics/headshot.jpg'
                        }`}
                    className={styles.memberPic}
                    width="140"
                    height="140"
                ></Image>
            </div>

            <div className={styles.memberItems}>
                <br></br>
                <div className={styles.name}>{intl.formatMessage({ id: 'member.name' })}</div>
                <br></br>
                {auther.account ? (
                    <>
                        <div className={styles.name}>
                            <span>{auther.account}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.name}>
                            <span style={{ color: 'white' }}></span>{intl.formatMessage({ id: 'member.user' })}
                        </div>
                    </>
                )}
                <br></br>
                <div className={styles.nowLocationOut}>
                    <div className={styles.nowLocation}>{intl.formatMessage({ id: 'member.editProfile' })}</div>
                </div>
            </div>

            <div className={styles.iconsOut}>
                <div className={styles.icons}>
                    <br></br>
                    <div className={styles.icon}>
                        <BsFillTicketDetailedFill className={styles.iconSick} />
                        <Link className={styles.iconLink} href="/favorite/couponHistory">
                            {' '}
                            {intl.formatMessage({ id: 'coupon.title' })}
                        </Link>
                    </div>
                    <div className={styles.icon}>
                        <BsCart4 className={styles.iconSick} />
                        <Link className={styles.iconLink} href="/member/member-orderList">
                            {' '}
                            {intl.formatMessage({ id: 'member.orderList' })}
                        </Link>
                    </div>
                    <div className={styles.icon}>
                        <BsFillTrophyFill className={styles.iconSick} />
                        <Link className={styles.iconLink} href="/favorite/game">
                            {' '}
                            {intl.formatMessage({ id: 'coupon.get' })}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftList