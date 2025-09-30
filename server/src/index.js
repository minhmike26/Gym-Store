const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectToDatabase } = require("./lib/db");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
const healthRouter = require("./routes/health");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const paymentsRouter = require("./routes/payments");

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);

// Root
app.get("/", (req, res) => {
  res.json({ name: "Gym Store API", status: "ok" });
});

const port = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
