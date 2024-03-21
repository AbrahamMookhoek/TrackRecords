import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import SessionProvider from "./providers/SessionProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Provider from "./providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Track Records",
  description: "Music Analytics Web App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <AppRouterCacheProvider>
            <SessionProvider session={session}>
              {children}
            </SessionProvider>
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}
