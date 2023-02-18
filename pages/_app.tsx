import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { cal, inter } from "@/styles/fonts";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Navbar from "@/components/Layout/Navbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <main className={`${cal.variable} ${inter.variable}`}>
        <Navbar />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
