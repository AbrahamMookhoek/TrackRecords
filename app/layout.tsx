import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { options } from './api/auth/[...nextauth]/options'
import SessionProvider from './SessionProvider'
import Home from './page'
import CalendarPage from './dashboard/calendar/page'
import Dashboard from './dashboard/page'
 

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Track Records',
  description: 'Music Analytics Web App',
}

export default async function RootLayout({ children, }: { children: React.ReactNode }) {
  const session = await getServerSession(options)

  if (session){
    console.log("Printed in root level layout " + session.user.email)
  }
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {!session ? (
            <Home/>
          ): (
            <Dashboard/>
          )}
        </SessionProvider>
      </body>
    </html>
  )
}
