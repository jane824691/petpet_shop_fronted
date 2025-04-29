// https://github.com/Gamote/lottie-react
import Lottie from 'lottie-react'
import catAnimation from '@/assets/loader-cat.json'

// 展示用載入元件
export function DefaultLoader({ show = false }) {
  return (
    <div className={`semi-loader ${show ? '' : 'semi-loader--hide'}`}></div>
  )
}

// 展示用載入文字元件
export function LoaderText({ text = 'loading', show = false }) {
  return (
    <div className={`loading-text-bg ${show ? '' : 'loading-text--hide'}`}>
      <div className={`loading-text ${show ? '' : 'loading-text--hide'}`}>
        {text}...
      </div>
    </div>
  )
}

// lottie-react
export function CatLoader({ text = 'Loading', show = false }) {
  return (
    <div
      className={`cat-loader-bg && loading-text-bg ${
        show ? '' : 'cat-loader--hide' && 'loading-text--hide'
      }`}
    >
      <Lottie
        className={`cat-loader && loading-text ${
          show ? '' : 'cat-loader--hide' && 'loading-text--hide'
        }`}
        animationData={catAnimation}
      />
      <div
        className="fs-1"
        style={{
          color: '#112344',
          textAlign: 'center'
        }}
      >
        {text}...
      </div>
    </div>
  )
}

export function NoLoader({ show = false }) {
  return <></>
}
