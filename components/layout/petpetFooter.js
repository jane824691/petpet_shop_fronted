// import './App.css';
// import styles from '@/styles/petpetIndex.module.css'
import styles from "@/css/petpetFooter.module.css"
export default function PetpetFooter() {
 return (
<>  
  <div className={styles.footer}>

    <div className={styles.footerBlock}>
      <div className={styles.footerTitle}>ABOUT US</div>
        <div className={styles.footerContent}>
          <div>品牌介紹</div>
          <div>寵物商城</div>
          <div>寵物日記</div>
          <div>寵物論壇</div>
        </div>
      </div>
    <div/>

    <div className={styles.footerBlock}>
      <div className={styles.footerTitle}>ONLINE SERVICE</div>
        <div className={styles.footerContent}>
          <div>運送服務</div>
          <div>付款服務</div>
          <div>條款細則</div>
          <div>會員權益</div>
        </div>
      </div>
    <div/>

    <div className={styles.footerBlock}>
      <div className={styles.footerTitle}>CONTACT US</div>
        <div className={styles.footerContent}>
          <div>佩佩星球</div>
          <div>電話：02-22222222</div>
          <div>時間：(一)至(五) 8:30 - 17:30</div>
          <div>電郵：info@ispan.com.tw</div>
          <div>聯絡地址：台北市復興南路一段390號2樓</div>
        </div>
      </div>


  </div>
{/* 這是footer */}



</>
  )
}
