import { Inter } from 'next/font/google'
import '../globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Track Records',
  description: 'Music Analytics Web App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar/> */}
        <main className="overflow-hidden">
          {children}
        </main>
        {/* <Footer/> */}
      </body>
    </html>
  )
}
