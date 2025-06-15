import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="fixed container top-0">
      <div className="flex items-center justify-center w-full z-40 py-10">
        <div className="container flex items-center justify-between">
          <Link href={"/"} className="text-blue-400 text-4xl font-bold">
            Aspirely
          </Link>
          <Link
            href={session?.user ? "/account" : "/signin"}
            className=""
          ></Link>
          {session?.user ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 text-sm font-semibold shadow-xs ring-gray-300 bg-blue-400 text-white rounded-lg px-10 py-3 cursor-pointer  border border-blue-400 hover:text-blue-400 hover:bg-white outline-none">
                  {session.user.name}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 size-5 text-gray-400"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Account Data
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => signOut()}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <Link
              href={"/signin"}
              className="justify-center gap-x-1.5 text-sm font-semibold shadow-xs ring-gray-300 bg-blue-400 text-white rounded-lg px-10 py-3 cursor-pointer  border border-blue-400 hover:text-blue-400 hover:bg-white outline-none"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
