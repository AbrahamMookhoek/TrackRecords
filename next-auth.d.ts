import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth'{
    interface Session{
        user: {
            spotify_access_token?: string,
            spotify_refresh_token?: string,
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser{
        spotify_access_token?: string,
        spotify_refresh_token?: string,
        new_session?: boolean,
    }
}

declare module 'next-auth/jwt'{
    interface JWT extends DefaultJWT{
        spotify_access_token?: string,
        spotify_refresh_token?: string,
        access_token_expires?: number,
    }
}