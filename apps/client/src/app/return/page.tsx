import Link from "next/link";
import React from "react";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-medium">Invalid session</h1>
        <p className="text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`
  );
  const data = await res.json();

  return (
    <div className="">
      <h1>Payment : {data.status}</h1>
      <p>Payment Status : {data.payment_status}</p>
      <Link href={"/orders"}>See your orders</Link>
    </div>
  );
};

export default ReturnPage;
