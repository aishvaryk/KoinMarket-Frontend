"use client"
import { CryptoTable } from './components/CryptoTable'
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";

export default function Home() {
  return (
  <ThemeProvider theme={theme}>
    <CryptoTable></CryptoTable>
    </ThemeProvider>
  )
}
