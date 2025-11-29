import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";
import { producer } from "../utils/kafka";

// Aynı session için birden fazla order oluşturulmasını önlemek için
const processedSessions = new Set<string>();

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      // Try to get price from Stripe, fallback to cart price if not found
      const stripePrice = await getStripeProductPrice(item.id);
      const unitAmount =
        typeof stripePrice === "number"
          ? stripePrice
          : Math.round(item.price * 100);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    })
  );
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems as any,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "custom",
      // The URL of your payment completion page
      return_url:
        "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
    });

    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );

  console.log(session);

  // Ödeme başarılıysa ve bu session daha önce işlenmediyse order oluştur
  if (
    session.status === "complete" &&
    session.payment_status === "paid" &&
    !processedSessions.has(session_id)
  ) {
    processedSessions.add(session_id);

    const lineItems = session.line_items?.data || [];

    await producer.sendMessage("payment.successful", {
      value: {
        userId: session.client_reference_id,
        email: session.customer_details?.email,
        amount: session.amount_total,
        status: "success",
        products: lineItems.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          price: item.price?.unit_amount,
        })),
      },
    });

    console.log("✅ Order message sent to Kafka for session:", session_id);
  }

  return c.json({
    status: session.status,
    payment_status: session.payment_status,
  });
});

export default sessionRoute;
