import { Navbar } from "./components/Navbar";
import "./globals.css";
import { UserProvider } from "./user/store";

export const metadata = {
  title: "KoinMarket",
  description: "Cryptocurrencies Market Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
  <UserProvider>
    <html lang="en">
      <body>
          <Navbar/>
        {children}
      </body>
    </html></UserProvider>
  );
}
