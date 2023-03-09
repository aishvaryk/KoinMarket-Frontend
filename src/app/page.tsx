import Image from 'next/image'
import styles from './page.module.css'
import { Navbar } from './components/Navbar'
import { CryptoTable } from './components/CryptoTable'

export default function Home() {
  return (
    <header>
      <Navbar></Navbar>
      <CryptoTable></CryptoTable>
    </header>
  )
}
