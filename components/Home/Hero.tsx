import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Hero() {
  const { data: session } = useSession();

  return (
    <div
      className="w-screen flex items-center justify-center h-[calc(100vh-4rem)] max-h-max py-10 px-8 md:px-20 lg:px-32 animate-in fade-in animate-out fade-out space-y-8 flex-col"
      data-aos="fade-down"
    >
      <h1 className="text-5xl font-bold text-center m-0">
        Don't let {" "}<span className="text-blue-500">redirecting</span> {" "}
        <span className="text-violet-500">rekt</span> {" "}
        <span className="text-indigo-500">you</span>
      </h1>
      <p className="text-lg mt-4 max-w-prose text-center">
        Redirect liek a pro with REDIREKT. It's free, open source, and easy to use.
      </p>
      <div>
        {!session ?
          <button
            role="button"
            className="bg-slate-900 hover:bg-slate-700 hover:text-white font-bold py-3 px-6 rounded transition-all text-xl"
            onClick={() => signIn('gitlab')}>
            Get Started
          </button>
          : <Link href="/dashboard" className="bg-slate-900 hover:bg-slate-700 hover:text-white font-bold py-3 px-6 rounded transition-all text-xl">
            Back to the dashboard
          </Link>}
      </div>
    </div>
  )
}