import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import UserModel from "@/model/user";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

const getUserProfile = async (userId: string) => {
  await connectToDatabase();

  const user = await UserModel.findById(userId)
    .select("username email wallets transactionHistory")
    .exec();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const user = await getUserProfile(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}
