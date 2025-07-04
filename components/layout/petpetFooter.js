import styles from '@/css/petpetFooter.module.css'
import { useIntl } from 'react-intl'

export default function PetpetFooter() {
  const intl = useIntl()

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.footerBlock}>
          <div className={styles.footerTitle}>{intl.formatMessage({ id: 'footer.aboutUs' })}</div>
          <div className={styles.footerContent}>
            <div>{intl.formatMessage({ id: 'footer.aboutUs' })}</div>
            <div>{intl.formatMessage({ id: 'footer.brandIntroduction' })}</div>
            <div>{intl.formatMessage({ id: 'footer.aboutUs' })}</div>
            <div>{intl.formatMessage({ id: 'footer.aboutUs' })}</div>

          </div>
        </div>
        <div />

        <div className={styles.footerBlock}>
          <div className={styles.footerTitle}>{intl.formatMessage({ id: 'footer.onlineService' })}</div>
          <div className={styles.footerContent}>
            <div>{intl.formatMessage({ id: 'footer.termsOfTransport' })}</div>
            <div>{intl.formatMessage({ id: 'footer.aboutPayment' })}</div>
            <div>{intl.formatMessage({ id: 'footer.privacyPolicy' })}</div>
            <div>{intl.formatMessage({ id: 'footer.termsOfService' })}</div>
          </div>
        </div>
        <div />

        <div className={styles.footerBlock}>
          <div className={styles.footerTitle}>{intl.formatMessage({ id: 'footer.contactUs' })}</div>
          <div className={styles.footerContent}>
            <div>{intl.formatMessage({ id: 'header.logo' })}</div>
            <div>{intl.formatMessage({ id: 'common.tel' })}：02-22222222</div>
            <div>{intl.formatMessage({ id: 'footer.time' })}</div>
            <div>email：info@ispan.com.tw</div>
            <div className='px-2'>{intl.formatMessage({ id: 'footer.address' })}</div>
          </div>
        </div>
      </div>
      {/* 這是footer */}
    </>
  )
}
