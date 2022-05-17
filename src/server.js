import mongoose from "mongoose";
import config from "./config/config.js";
import app from "./app.js";

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => console.log("Connected to MongoDB"));

const port = config.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHandler = (err) => {
  console.log(err.name, err.message);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
