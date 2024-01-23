// 'use client'

// import { useState } from 'react';
// import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
// import {auth} from '@/app/firebase/config'
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// const SignInPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
//   const router = useRouter()

//   const handleSignIn = async () => {
//     try {
//         const res = await signInWithEmailAndPassword(email, password).catch(e => {
//           console.log(e)
//         })

//         if(res)
//         {
//           window.sessionStorage.setItem('user', true)
//           setEmail('');
//           setPassword('');
//           router.push('/dashboard/calendar')
//         }
//     }catch(e){
//         console.error(e)
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <div className="relative bg-gray-800 p-10 rounded-lg shadow-xl w-96">
//         <h1 className="text-white text-2xl mb-5">Sign In</h1>
//         <input 
//           type="email" 
//           placeholder="Email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         <button 
//           onClick={handleSignIn}
//           className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
//         >
//           Sign In
//         </button>

//         <div className="absolute bottom-0 bg-gray-800">
//           <Link href="/signup" key="signup" className="regular-16 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
//             <h1>Don't have an account? Sign up here!</h1>
//           </Link>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default SignInPage;

'use client';
import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <button onClick={() => signIn('spotify')}>Login</button>
  )
}