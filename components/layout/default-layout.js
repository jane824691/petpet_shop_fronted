import PetpetHeader from './petpetHeader'
import PetpetFooter from './petpetFooter'
import Head from 'next/head'

export default function DefaultLayout({ children }) {
  return (
    <>
      <Head>
        <title>PetPet佩佩星球-電商平台Demo</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <PetpetHeader />
      <main>{children}</main>
      <PetpetFooter />
    </>
  )
}
