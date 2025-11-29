"use client";

import { useAuth } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  const { signOut } = useAuth();

  return (
    <div>
      <h1>You are not authorized to access this page</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default Page;
