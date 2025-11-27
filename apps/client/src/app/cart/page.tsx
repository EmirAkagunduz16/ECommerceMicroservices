"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import useCartStore from "@/stores/cartStore";
import { CartItemsType, CartItemType, ShippingFormInputsType } from "@/types";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Shopping Cart",
  },
  {
    id: 2,
    title: "Shipping Address",
  },
  {
    id: 3,
    title: "Payment Method",
  },
];

// Temporary
// const cartItems: CartItemsType = [
//   {
//     id: 6,
//     name: "Nike Air Max 270",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 59.9,
//     sizes: ["40", "42", "43", "44"],
//     colors: ["gray", "white"],
//     images: { gray: "/products/6g.png", white: "/products/6w.png" },
//     quantity: 1,
//     selectedSize: "medium",
//     selectedColor: "gray",
//   },
//   {
//     id: 7,
//     name: "Nike Ultraboost Pulse ",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 69.9,
//     sizes: ["40", "42", "43"],
//     colors: ["gray", "pink"],
//     images: { gray: "/products/7g.png", pink: "/products/7p.png" },
//     quantity: 1,
//     selectedSize: "40",
//     selectedColor: "pink",
//   },
//   {
//     id: 8,
//     name: "Levi’s Classic Denim",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 59.9,
//     sizes: ["s", "m", "l"],
//     colors: ["blue", "green"],
//     images: { blue: "/products/8b.png", green: "/products/8gr.png" },
//     quantity: 1,
//     selectedSize: "l",
//     selectedColor: "blue",
//   },
// ];

const CartPage = () => {
  const searchparams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputsType>();

  const activeStep = parseInt(searchparams.get("step") || "1");

  const { cart, removeFromCart } = useCartStore();

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      {/* Title */}
      <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
      {/* Steps */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step) => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              activeStep === step.id ? "border-gray-800" : "border-gray-200"
            }`}
            key={step.id}
          >
            <div
              className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                step.id === activeStep ? "bg-gray-800" : "bg-gray-400"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
      {/* Steps and details */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* Steps */}
        <div className="w-full lg:w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
          {activeStep === 1 ? (
            cart.map((item: CartItemType) => (
              // Single cart item
              <div
                className="flex items-center justify-between"
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              >
                {/* Image and details */}
                <div className="flex gap-8">
                  {/* Image */}
                  <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={item.images?.[item.selectedColor] || ""}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Item details */}
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {item.selectedSize.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Color:{" "}
                        {item.selectedColor.charAt(0).toUpperCase() +
                          item.selectedColor.slice(1)}
                      </p>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item)}
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <PaymentForm />
          ) : (
            <p className="text-sm text-gray-500">
              Please fill in the shipping form first
            </p>
          )}
        </div>
        {/* Details */}
        <div className="w-full lg:w-5/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max">
          <h2 className="font-semibold">Cart Details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium">
                $
                {cart
                  .reduce(
                    (acc: number, item: CartItemType) =>
                      acc + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-500">Discount (10%)</p>
              <p className="font-medium text-red-500">- $10</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-500">Shipping Fee</p>
              <p className="font-medium">$10</p>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p className="text-gray-800 font-semibold">Total</p>
            <p className="font-medium">
              $
              {cart
                .reduce(
                  (acc: number, item: CartItemType) =>
                    acc + item.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </p>
          </div>
          {activeStep === 1 && (
            <button
              className="w-full bg-gray-800 text-white py-2 rounded-md shadow-lg hover:bg-gray-900 transition-all duration-300"
              onClick={() => router.push("/cart?step=2", { scroll: false })}
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
