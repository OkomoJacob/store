const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

// Initialize app
const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

// Load stripe
const stripe = require("stripe")(
  "sk_test_51M2rd7BPljLkxUJO19h5qF725P3cXNebnsBxhw7Qx0Ik3Sojlu1rHTiWuizZW9IIkb7gaolkGTmLrr1DEJlthp6X00nNYSzVW1"
);

app.post("/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // Shipping Details
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
    //   shipping_options: [
    //     {
    //       shipping_rate_data: {
    //         fixed_amount: { amount: 0, currency: "usd" },
    //         display_name: "Free shipping",
    //         delivery_estimate: {
    //           minimum: { unit: "business_day", value: 5 },
    //           maximum: { unit: "business_day", value: 7 },
    //         },
    //       },
    //     },
    //   ],
      //   Line items
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.product],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:4242/success.html",
      cancel_url: "http://localhost:4242/cancel.html",
    });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

// Open port
app.listen(4242, () => console.log("App is running on 4242"));
