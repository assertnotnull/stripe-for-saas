"use client";

import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { loggedInUserAtom } from "./atoms";

export default function CheckoutButton() {
  const [user] = useAtom(loggedInUserAtom);
  const handleCheckout = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      toast.error("Please log in to create a new Stripe Checkout session");
      return;
    }

    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
    const stripe = await stripePromise;
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: "price_1P5quBP2uzVsjiHbnFuGb6nA",
        userId: data.user?.id,
        email: data.user?.email,
      }),
    });
    const session = await response.json();
    console.log({ session });
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return user ? (
    <div>
      <h1>Signup for a Plan</h1>
      <p>Clicking this button creates a new Stripe Checkout session</p>
      <button className="btn btn-accent" onClick={handleCheckout}>
        Buy Now
      </button>
    </div>
  ) : (
    <h1>Create an account first</h1>
  );
}
