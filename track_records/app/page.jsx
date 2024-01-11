'use client';

import Header from '@/components/Header'
import Image from 'next/image'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');

  console.log({user})
 
  if (!user && !userSession){
    // router.push('/signup')
  }

  return (
    <main>
      <Header/>
      <br></br>
      <h1 className="bold-16">
        TODO: MAKE SPLASH PAGE SHOWING WHAT WEBSITE IS ABOUT
      </h1>
      <br></br>
    </main>
  )
}
