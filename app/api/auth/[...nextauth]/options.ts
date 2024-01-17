import type { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import CredentialsProvider from 'next-auth/providers/credentials'

import { FirestoreAdapter } from '@auth/firebase-adapter'
import { cert } from 'firebase-admin/app'

const spotifyScopes = {

}

export const options: NextAuthOptions = {

    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        })
    }),
    
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
            // authorization: `https://accounts.spotify.com/authorize?scope=ugc-image-upload&user-read-private&user-read-email`
          }),
        
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "Your Username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Your Password"
                }
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data
                // to verify with credentials
                // Docs: https:next-auth.js.org/configuration/providers/credentials
                const user = { id: "42", name: "Dave", password: "nextauth" }

                if (credentials?.username === user.name && credentials?.password == user.password)
                {
                    return user
                }
                else
                {
                    return null
                }
            }
        })
    ],
}