import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Replace with a real user _id from your users collection
const dummyUserId = "6937da82d1be2f4057f06efb";

const token = jwt.sign({ id: dummyUserId }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});

console.log("Dummy JWT token:");
console.log(token);
