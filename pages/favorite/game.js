import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react'
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { COUPON_ADD, COUPON_USE_ADD } from '@/components/my-const'
import { useRouter } from 'next/router'
import AuthContext from '@/components/contexts/AuthContext'
import GameContext, { themes } from '@/components/contexts/GameContext'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'

const jumpDistance = 150 // 空白鍵的移動距離

export default function Game() {
  const { theme, setTheme } = useContext(GameContext) //背景切換
  const [buttonImage, setButtonImage] = useState('/pics/keyboard.png') //方向鍵切換
  const [keyStates, setKeyStates] = useState({})
  const [position, setPosition] = useState({ left: 0, top: 210 })
  const [sunImageVisible, setSunImageVisible] = useState(false)
  const [cloudImageVisible, setCloudImageVisible] = useState(false)
  const [dogImageVisible, setDogImageVisible] = useState(false)
  const [randomImage1Visible, setRandomImage1Visible] = useState(false)
  const [randomImage2Visible, setRandomImage2Visible] = useState(false)
  const animationFrame = useRef(null)
  const gameContainerRef = useRef(null)
  const [gameContainer, setGameContainer] = useState('rect4')
  const [isJumping, setIsJumping] = useState(false) //跳躍狀態
  const [foodEaten, setFoodEaten] = useState(false) // 用於追蹤是否吃到食物的狀態
  const [gameStarted, setGameStarted] = useState(false) //遊戲開始才抓座標
  const router = useRouter()
  const [dogImageSrc, setDogImageSrc] = useState('/pics/dogImage.png')
  const [showModal, setShowModal] = useState(false) //觸發Modal
  const { auther } = useContext(AuthContext)
  const intl = useIntl()
  const [isMobile, setIsMobile] = useState(false)
  // RWD 判斷
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  //隨機優惠券編號
  const hashTypes = () => {
    const characters = 'ABCDE123456789'
    const length = 8
    let hash = '' //hash變數之後被重新設定(let)
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      hash += characters[randomIndex]
    }
    return hash
  }
  //隨機優惠折扣
  const randomdiscount_coins = () => {
    const discountTypes = [30, 50]
    const randomIndex = Math.floor(Math.random() * discountTypes.length)
    return discountTypes[randomIndex]
  }
  //優惠券
  const [coupondata, setCoupondata] = useState({
    hash: hashTypes(),
    discount_coins: randomdiscount_coins(),
    expiry_date: dayjs().add(30, 'day').format('YYYY-MM-DD'), //這欄位會與當前時間比對，大於才會變色
    coupon_status: 0,
  })

  //比對優惠券過期時間
  useEffect(() => {
    const expiry = dayjs(coupondata.expiry_date).add(30, 'day')
    const today = dayjs()
    if (today.isAfter(expiry)) {
      setCoupondata((prevCouponData) => ({
        ...prevCouponData,
        coupon_status: 1,
      }))
    }
  }, [coupondata.expiry_date])

  // 在组件加載時，使用 useEffect 設置 buttonImage 的初始值
  useEffect(() => {
    // 根據當前 theme 的值設置 buttonImage 的初始值
    //避免theme顏色與方向鍵圖片不一致
    if (theme.name === 'default') {
      setButtonImage('/pics/keyboard.png')
    } else if (theme.name === 'info') {
      setButtonImage('/pics/keyboard-blue.png')
    } else if (theme.name === 'secondary') {
      setButtonImage('/pics/keyboard-pink.png')
    }
  }, [theme]) // 當 theme 改變時執行 useEffect

  const modalShow = async () => {
    try {
      setShowModal(true)
      // 在點擊 "觀看優惠券" 按鈕後，發送 fetch 請求

      const requestData = {
        hash: coupondata.hash,
        discount_coins: coupondata.discount_coins,
        expiry_date: coupondata.expiry_date,
        coupon_status: coupondata.coupon_status,
      }

      const response = await fetch(COUPON_ADD, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        // 在這里處理 coupon 表的後端回傳數據

        // 同時發起 coupon_use 表的請求
        const couponUseRequestData = {
          coupon_id: responseData.couponResult.insertId,
          sid: auther.sid,
        }
        const couponUseResponse = await fetch(COUPON_USE_ADD, {
          method: 'POST',
          body: JSON.stringify(couponUseRequestData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auther.token,
          },
        })

        if (couponUseResponse.ok) {
          const couponUseResponseData = await couponUseResponse.json()
          // 在這裡處理 coupon_use 表的後端回傳數據
          // console.log('Coupon Use 資料新增成功:', couponUseResponseData)
        } else {
          // console.log('Coupon Use 資料新增失敗:', couponUseResponse.status)
        }
      } else {
        // console.log('Coupon 資料新增失敗:', response.status)
      }
    } catch (error) {
      // console.error('Fetch 錯誤:', error)
    }
  }
  const easeInOutQuad = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 5

  const handleJump = () => {
    const originalTop = position.top
    const jumpStartTime = performance.now()

    const jumpFrame = () => {
      const currentTime = performance.now() //當前時間(毫秒)
      const progress = (currentTime - jumpStartTime) / 1000

      setPosition((prevPosition) => ({
        ...prevPosition,
        top: originalTop - easeInOutQuad(progress) * jumpDistance,
      }))
      //時間差的百分比(0~1)
      if (progress < 1) {
        requestAnimationFrame(jumpFrame)
      } else {
        setPosition((prevPosition) => ({
          ...prevPosition,
          top: originalTop,
        }))
        eatFood() // 在跳躍結束後進行碰撞檢測
        setIsJumping(false) //跳躍完成
      }
    }

    requestAnimationFrame(jumpFrame)
  }

  const handleMovement = useCallback(() => {
    setPosition((prevPosition) => {
      let { left, top } = prevPosition
      let newDogImageSrc = dogImageSrc //方向鍵的圖片切換

      if (keyStates.ArrowRight) {
        if (dogImageSrc === '/pics/dogImage.png') {
          newDogImageSrc = '/pics/dogRun.png'
        } else {
          newDogImageSrc = '/pics/dogImage.png'
        }
        left = Math.min(left + 10, 375)
        setDogImageSrc(newDogImageSrc)
      }
      if (keyStates.ArrowLeft) {
        if (dogImageSrc === '/pics/dogwalk.png') {
          newDogImageSrc = '/pics/dogRun2.png'
        } else {
          newDogImageSrc = '/pics/dogwalk.png'
        }
        left = Math.max(left - 10, 0)
        setDogImageSrc(newDogImageSrc)
      }
      if (keyStates.ArrowUp) {
        // top = Math.max(top - 10, 0)
      }
      if (keyStates.ArrowDown) {
        // top = Math.min(top + 10, 208)
      }

      if (keyStates.Space && !isJumping) {
        setIsJumping(true)
        handleJump()
      }
      eatFood() //呼叫，不可刪除
      return { left, top }
    })
  }, [keyStates, isJumping])

  const downHandler = useCallback(
    (e) => {
      e.preventDefault()
      setKeyStates((prevKeyStates) => ({
        ...prevKeyStates,
        [e.code]: true,
      }))
      if (e.code === 'Space' && !isJumping) {
        setIsJumping(true)
        handleJump()
      }
    },
    [isJumping, setKeyStates, setIsJumping]
  )

  const upHandler = useCallback(
    (e) => {
      e.preventDefault()
      setKeyStates((prevKeyStates) => ({
        ...prevKeyStates,
        [e.code]: false,
      }))

      if (e.code === 'Space') {
        setIsJumping(false)
      }
    },
    [setKeyStates, setIsJumping]
  )

  const move = () => {
    if (!gameStarted) {
      //遊戲開始時再抓座標
      return
    }
    handleMovement()
    animationFrame.current = requestAnimationFrame(() => move()) // 呼叫move函式
  }

  const startGame = () => {
    setSunImageVisible(true)
    setCloudImageVisible(true)
    setDogImageVisible(true)
    setRandomImage1Visible(true)
    setRandomImage2Visible(true)

    if (location.hash === '#rect4') {
      setGameContainer('rect4')
    } else {
      setGameContainer('rect3')
    }
    setGameStarted(true) // 設定遊戲已經開始
    animationFrame.current = requestAnimationFrame(move)
  }

  // 吃飼料
  const eatFood = useCallback(() => {
    const dogElem = document.querySelector('#dogImage')
    const food1Elem = document.querySelector('#randomImage1')
    const food2Elem = document.querySelector('#randomImage2')
    if (!dogElem || !food1Elem || !food2Elem) return // 若有任一不存在就直接 return

    const dogRect = dogElem.getBoundingClientRect()
    const randomImage1Rect = food1Elem.getBoundingClientRect()
    const randomImage2Rect = food2Elem.getBoundingClientRect()

    if (
      (dogRect.right > randomImage1Rect.left &&
        dogRect.left < randomImage1Rect.right &&
        dogRect.bottom > randomImage1Rect.top &&
        dogRect.top < randomImage1Rect.bottom) ||
      (dogRect.right > randomImage2Rect.left &&
        dogRect.left < randomImage2Rect.right &&
        dogRect.bottom > randomImage2Rect.top &&
        dogRect.top < randomImage2Rect.bottom)
    ) {
      setFoodEaten(true) // 更新 foodEaten 狀態
      setShowModal(true) // 顯示 Modal
      //modalShow()
    }
  }, [setFoodEaten, setShowModal])

  const dogMovement = useCallback(() => {
    let newTop
    setPosition((prevPosition) => {
      let { left, top } = prevPosition

      eatFood()
      newTop = top

      return { left, top }
    })
    eatFood(newTop)
  }, [eatFood])

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    animationFrame.current = requestAnimationFrame(() => {
      handleMovement()
    })

    return () => {
      cancelAnimationFrame(animationFrame.current)
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [handleMovement])

  return (
    <div className="pt-5">
      {isMobile ? (
        <div
          className="text-center mx-auto my-5 px-5 text-success"
          style={{ fontSize: '22px', marginTop: '100px' }}
        >
          {intl.formatMessage({ id: 'game.rwdTip', defaultMessage: '請在網頁版尺寸時獲得最佳體驗！' })}
        </div>
      ) : (
        <>
          <h3>{intl.formatMessage({ id: 'game.title' })}</h3>
          <div className={`rect ${theme.className}`}>
            <div className="rect2">
              <div
                className={gameContainer}
                ref={gameContainerRef}
                id="gameContainer"
                style={{ position: 'relative' }}
              >
                <div>
                  <Image
                    src={dogImageSrc}
                    alt={intl.formatMessage({ id: 'game.dog' })}
                    id="dogImage"
                    width="95"
                    height="70"
                    style={{
                      left: position.left,
                      top: position.top,
                      display: dogImageVisible ? 'block' : 'none',
                      position: 'absolute',
                      zIndex: 2, //狗在圖片上層
                    }}
                  />
                </div>
                <Image
                  src="/pics/pngtree-cat-food-feed-image_2236974.png"
                  alt={intl.formatMessage({ id: 'game.food1' })}
                  width="60"
                  height="70"
                  style={{
                    display: randomImage1Visible ? 'block' : 'none',
                    marginLeft: '220px',
                    marginTop: '80px',
                    zIndex: 1,
                  }}
                  className="randomImage"
                  id="randomImage1"
                />
                <Image
                  src="/pics/dog-food.png"
                  alt={intl.formatMessage({ id: 'game.food2' })}
                  width="80"
                  height="90"
                  style={{
                    display: randomImage2Visible ? 'block' : 'none',
                    marginLeft: '350px',
                    marginTop: '100px',
                    zIndex: 1,
                  }}
                  className="randomImage"
                  id="randomImage2"
                />
                <Image
                  src="/pics/sun.png"
                  alt={intl.formatMessage({ id: 'game.sun' })}
                  width="75"
                  height="75"
                  style={{
                    display: sunImageVisible ? 'block' : 'none',
                    marginLeft: '390px',
                  }}
                  id="sunImage"
                />
                <Image
                  src="/pics/cloud.png"
                  alt={intl.formatMessage({ id: 'game.cloud' })}
                  width="75"
                  height="50"
                  style={{
                    display: cloudImageVisible ? 'block' : 'none',
                    marginLeft: '80px',
                  }}
                  id="cloudImage"
                />
              </div>
              <span
                style={{
                  marginLeft: '200px',
                  marginTop: '30px',
                  color: '#CA9145',
                  fontSize: '22px',
                }}
              >
                {intl.formatMessage({ id: 'header.logo' })}
                <Image
                  src="/pics/pinkcat.png"
                  alt={intl.formatMessage({ id: 'game.pinkcat' })}
                  width="25"
                  height="25"
                  id="pinkcatImage"
                  style={{ cursor: 'grab' }}
                  onClick={() => {
                    if (theme.name === 'default') {
                      setTheme(themes.info)
                      setButtonImage('/pics/keyboard-blue.png')
                    } else if (theme.name === 'info') {
                      setTheme(themes.secondary)
                      setButtonImage('/pics/keyboard-pink.png')
                    } else {
                      setTheme(themes.default)
                      setButtonImage('/pics/keyboard.png')
                    }
                  }}
                />
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Image
                src={buttonImage}
                alt="方向鍵"
                width="180"
                height="130"
                style={{
                  marginTop: '10px',
                }}
                id="buttonImage"
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <button
                  className="start btn btn-outline-light btn-lg"
                  onClick={startGame}
                >
                  {intl.formatMessage({ id: 'game.start' })}
                </button>
                <button
                  onClick={() => {
                    router.push('/member')
                  }}
                  className={`end ${theme.className} btn btn-outline-light btn-lg`}
                >
                  {intl.formatMessage({ id: 'game.end' })}{' '}
                </button>
              </div>
            </div>
          </div>

          {/* Modal 範例 */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header className="modal-header-success">
              <Modal.Title className="modal-form py-3">
                {intl.formatMessage({ id: 'game.rewardTitle' })}
              </Modal.Title>
              <Image
                src="/pics/close.png"
                alt={intl.formatMessage({ id: 'game.close' })}
                width="40"
                height="30"
                className="mb-3"
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '-22px',
                  right: '-20px',
                }}
                onClick={() => setShowModal(false)}
              />
            </Modal.Header>
            <Modal.Body className="modal-body-success">
              {intl.formatMessage({ id: 'game.rewardBody' })}
            </Modal.Body>

            <Modal.Footer className="modal-footer-success">
              <Button
                variant="success"
                onClick={() => {
                  setShowModal(false)
                  modalShow()
                  setTimeout(() => {
                    router.push('/favorite/couponHistory')
                  }, 1000)
                }}
                className="pro-shadow" //profile.scss的屬性
              >
                {intl.formatMessage({ id: 'game.viewCoupon' })}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  )
}
