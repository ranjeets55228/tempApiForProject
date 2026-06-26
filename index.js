const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

/**
 * Cart Schema
 */
const cartSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
    },

    customerId: {
      type: String,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    cartJson: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search
cartSchema.index({ shop: 1, customerId: 1 });
cartSchema.index({ shop: 1, ipAddress: 1 });

const Cart = mongoose.model("Cart", cartSchema);

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    message: "Cart API Running",
  });
});

/**
 * Save / Update Cart
 */
app.post("/api/cart/save", async (req, res) => {
  try {
    const {
      shop,
      customerId,
      ipAddress,
      userAgent,
      cartJson,
    } = req.body;

    const query = customerId
      ? { shop, customerId }
      : { shop, ipAddress };

    const cart = await Cart.findOneAndUpdate(
      query,
      {
        shop,
        customerId,
        ipAddress,
        userAgent,
        cartJson,
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

<<<<<<< HEAD
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});
=======
/**
 * Get Cart
 */
app.get("/api/cart", async (req, res) => {
  try {
    const {
      shop,
      customerId,
      ipAddress,
    } = req.query;

    const query = customerId
      ? { shop, customerId }
      : { shop, ipAddress };

    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * Start Server
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
>>>>>>> 5b66d1c (initail changes for required api)
