"use client";

import { ShippingFormInputsType } from "@repo/types";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { ConfirmError } from "@stripe/stripe-js";
import React, { useState } from "react";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputsType;
}) => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConfirmError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Önemli!
    setLoading(true);
    setError(null);

    if (checkoutState.type === "success") {
      try {
        await checkoutState.checkout.updateEmail(shippingForm.email);
        await checkoutState.checkout.updateShippingAddress({
          name: "shipping_address",
          address: {
            line1: shippingForm.address,
            city: shippingForm.city,
            country: "US",
          },
        });

        const res = await checkoutState.checkout.confirm();
        if (res.type === "error") {
          setError(res.error);
        }
      } catch (err) {
        console.error("Payment error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: "accordion" }} />
      <button type="submit" disabled={loading}>
        <span>{loading ? "Processing..." : "Pay now"}</span>
      </button>
      {error && <div className="text-red-500">{error.message}</div>}
    </form>
  );
};

export default CheckoutForm;
