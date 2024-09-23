import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    const user = await getUserProfile(userId);
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch user profile:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
