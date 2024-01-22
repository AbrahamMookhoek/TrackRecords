import type { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

import { app, db } from '../../../firebase/config'
import { FirestoreAdapter } from '@auth/firebase-adapter'

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: FirestoreAdapter(app),
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: `https://accounts.spotify.com/authorize?scope=ugc-image-upload,user-read-private,user-read-email`
          }),
    ],
    callbacks: {
        async jwt({token, account}){
            if (account) {
                token.spotify_access_token = account.access_token
                token.spotify_refresh_token = account.refresh_token
            }
            return token
        },
        async session({session, token}){
            if (session){
                session.user.spotify_access_token = token.spotify_access_token
                session.user.spotify_refresh_token = token.spotify_refresh_token
            }
            
            return session
        }
    },
    session: {
        strategy: "jwt"
    }
}