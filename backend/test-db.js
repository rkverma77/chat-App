import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected");
  try {
    const Message = (await import("./src/models/message.model.js")).default;
    const messages = await Message.find({});
    console.log("Messages:", messages.length);
  } catch (e) {
    console.error("Error:", e.message);
  }
  process.exit();
});
