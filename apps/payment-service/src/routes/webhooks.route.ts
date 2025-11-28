import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const webhookroute = new Hono();

webhookroute.post("/stripe", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret!);
  } catch (error) {
    console.log("Webhook verification failed", error);
    return c.json({ error: "Webhook verification failed" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed", session);
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      //  TODO: create order
      console.log("WEBHOOK RECEIVED", session);
      break;
    default:
      console.log("Unhandled event type", event.type);
      break;
  }
  return c.json({ message: "Webhook received", received: true }, 200);
});

export default webhookroute;
