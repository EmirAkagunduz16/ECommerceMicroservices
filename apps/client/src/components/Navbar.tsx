import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import { Bell, Home, User } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import ProfileButton from "./ProfileButton";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center pb-4 border-b border-gray-200">
      {/* Left Side */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={36}
          height={36}
          className="w-6 h-6 md:w-9 md:h-9"
        />
        <p className="hidden md:block text-md font-medium tracking-wider">
          TRENDSHOP.
        </p>
      </Link>
      {/* Right Side */}
      <div className="flex items-center gap-4">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-600" />
        </Link>
        <Bell className="w-4 h-4 text-gray-600" />
        <ShoppingCartIcon />
        <div className="">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <ProfileButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
