"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useAuth } from "@clerk/nextjs";
import { CartItemsType, ShippingFormInputsType } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();

  if (!response.ok) {
    console.error("Backend error:", json);
    throw new Error("Failed to create checkout session");
  }

  return json.checkoutSessionClientSecret;
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputsType;
}) => {
  const { cart } = useCartStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setError("Authentication required");
          return;
        }

        const secret = await fetchClientSecret(cart, token);
        setClientSecret(secret);
      } catch (err) {
        console.error("Checkout initialization error:", err);
        setError("Failed to initialize checkout");
      }
    };

    initializeCheckout();
  }, [cart, getToken]);

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!clientSecret) {
    return <div className="text-sm text-gray-500">Loading payment form...</div>;
  }

  return (
    <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
