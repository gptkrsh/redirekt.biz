import Domains from "@/components/Dashboard/Domains";
import Redirects from "@/components/Dashboard/Redirects";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession()

  if (!session) return (
    <div className="w-screen flex items-center justify-center h-[calc(100vh-4rem)] max-h-max py-10 px-8 md:px-20 lg:px-32 animate-in fade-in animate-out fade-out space-y-8 flex-col">
      You are not signed in, please sign in first. <br />
      <Link href="/api/auth/signin">Sign in</Link>
    </div>
  )

  return (
    <div className="w-screen flex items-center justify-center h-[calc(100vh-4rem)] max-h-max py-10 px-8 md:px-20 lg:px-32 animate-in fade-in animate-out fade-out space-y-8 flex-col"
      data-aos="fade-down">
      <h1>Hey, {session.user?.name?.split(' ')[0]} 👋🏻</h1>
      <p className="text-lg mt-4 max-w-prose text-center">
        Welcome to your dashboard. You can manage your redirects here.
      </p>
      <Domains />
      <Redirects />
    </div>
  );
}