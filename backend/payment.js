import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51RBaMWLxzru9hDfEhO7bcHtPc1e88j28Zix6GqabB9fAbeN1jw2GcUJZGu5p4KQnFe9SWxZeIwDf3uGralhMTfMP00bgHVGoqh"
);

const payment = async (amount) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr", // change to your currency
            product_data: {
              name: "Travel Package",
              description: "Payment for your selected travel package",
            },
            unit_amount: amount * 100, // Stripe expects amount in smallest unit
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe session error:", error);
    return { error: error.message };
  }
};

export default payment;
