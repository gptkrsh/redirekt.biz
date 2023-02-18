import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { poppins, inter } from "@/styles/fonts";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Navbar from "@/components/Layout/Navbar";
import Bg from "@/components/Layout/Bg";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <main className={`${poppins.variable} ${inter.variable}`}>
        <Bg />
        <Navbar />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
