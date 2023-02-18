import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const userNavigation = [
  { name: "Settings", href: "#" },
  { name: "Sign out", onClick: () => signOut() },
];

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center px-2 lg:px-0">
            <Link href="/" className="flex-shrink-0">
              REDIREKT
            </Link>
          </div>
          <div className="ml-4 block">
            <div className="flex items-center">
              {session ? (
                <>
                  <button
                    type="button"
                    className="flex-shrink-0 rounded-full bg-slate-800 p-1"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-slate-800 text-sm">
                        <span className="sr-only">Open user menu</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="rounded-full !my-0"
                          src={
                            session?.user?.image ||
                            `https://api.dicebear.com/5.x/thumbs/svg?flip=true&seed=${session?.user?.name ?? session?.user?.email ?? ""
                            }`
                          }
                          alt=""
                          height={32}
                          width={32}
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/5.x/thumbs/svg?flip=true&seed=${session?.user?.name ?? session?.user?.email ?? ""
                              }`;
                          }}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded bg-slate-800 py-1 shadow-lg">
                        {userNavigation.map((item) => (
                          <Menu.Item
                            as={item.href ? Link : "div"}
                            key={item.name.toLowerCase()}
                            {...(item.onClick
                              ? { onClick: item.onClick }
                              : { href: item.href })}
                            className="block px-4 py-2 text-sm hover:bg-slate-700 cursor-pointer"
                          >
                            {({ active }) => <span>{item.name}</span>}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn("auth0")}
                  className="flex justify-between items-center rounded px-3 py-2 text-sm font-medium hover:bg-slate-700"
                >
                  Login
                  <ArrowLeftOnRectangleIcon className="h-8 w-8" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
