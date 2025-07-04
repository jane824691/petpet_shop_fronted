import styles from '@/css/favorite.module.css'
import { BsFillTicketDetailedFill, BsFillTrophyFill, BsCart4 } from 'react-icons/bs'
import Link from 'next/link'
import AuthContext from '@/components/contexts/AuthContext'
import { useContext } from 'react'
import Image from 'next/image'

const LeftList = ({ photo }) => {
    const { auther } = useContext(AuthContext)

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
                <div className={styles.name}>會員名稱</div>
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
                            <span style={{ color: 'white' }}></span>User
                        </div>
                    </>
                )}
                <br></br>
                <div className={styles.nowLocationOut}>
                    <div className={styles.nowLocation}>編輯個人資料</div>
                </div>
            </div>

            <div className={styles.iconsOut}>
                <div className={styles.icons}>
                    <br></br>
                    <div className={styles.icon}>
                        <BsFillTicketDetailedFill className={styles.iconSick} />
                        <Link className={styles.iconLink} href="/favorite/couponHistory">
                            {' '}
                            優惠券管理
                        </Link>
                    </div>
                    <div className={styles.icon}>
                        <BsCart4 className={styles.iconSick} />
                        <Link className={styles.iconLink} href="/member/member-orderList">
                            {' '}
                            購物清單
                        </Link>
                    </div>
                    <div className={styles.icon}>
                        <BsFillTrophyFill className={styles.iconSick} />
                        <Link className={styles.iconLink} href="/favorite/game">
                            {' '}
                            取得優惠券
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftList