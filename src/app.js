import express, { json, urlencoded } from "express";
import path from "path";

import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";
import hpp from "hpp";

import errorHandler from "./middlewares/error";
import ApiError from "./utils/ApiError";
import * as bookingController from "./controllers/bookingController";

import authLimiter from "./middlewares/ratelimiter";
import authRouter from "./routes/authRoutes";
import bookingRouter from "./routes/bookingRoutes";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import reviewRouter from "./routes/reviewRoutes";

const app = express();

app.enable("trust proxy");

const __dirname = path.resolve();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet());

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());
//gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

app.use("/v1", authLimiter);

app.post("/webhook-checkout", bookingController.webhookCheckout);

app.use("/v1/tours", tourRouter);
app.use("/v1/users", userRouter);
app.use("/v1/reviews", reviewRouter);
app.use("/v1/bookings", bookingRouter);
app.use("/v1/auth", authRouter);

// catch 404 and forward to error handler
app.use("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// error handler
app.use(errorHandler);

export default app;
