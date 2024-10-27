require("dotenv").config();
require("express-async-errors");

//extra security packages
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const authenticateUser = require("./middleware/authentication");
const path = require("path");

const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/order");
const categoryRouter = require("./routes/category");
const usersRouter = require("./routes/user");

// connectDB

const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, // limit each IP to 100 request per windowMs
  })
);
app.use(express.json());


app.use(cors());
app.options("*", cors());
// Middleware to serve static files in public directory
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));


// routes
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/category", categoryRouter);
app.use(authenticateUser);
app.use("/api/v1/orders", ordersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
