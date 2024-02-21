import type { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

import { app, db } from '../../../firebase/config'
import { FirestoreAdapter } from '@auth/firebase-adapter'

import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'

import refreshAccessToken from '@/app/utils/spotify'
import { spotifyGetSavedTracks } from '@/app/utils/spotify'

async function refreshToken(token){
    let returnedObj = await refreshAccessToken(token.spotify_refresh_token)

    token.access_token = returnedObj.access_token
    token.access_token_expires = Date.now() + returnedObj.expires_in * 1000

    return token
}

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
            authorization: `https://accounts.spotify.com/authorize?scope=ugc-image-upload,user-read-private,user-read-email,user-library-read`,
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                console.log("IN THE FIRST IF STATEMENT")
                token.spotify_access_token = account.access_token
                token.spotify_refresh_token = account.refresh_token
                token.access_token_expires = account.expires_at * 1000
                user.new_session = true

                console.log("Gathering user spotify songs right now")
                spotifyGetSavedTracks(token.spotify_access_token, user.name)

                return token
            }

            if(Date.now() < token.access_token_expires)
            {
                return token;
            }

            const newToken = await refreshToken(token)
            return newToken
        },
        async session({ session, token }) {
            if (session) {
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