import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import UserModel from "@/model/user";

export async function POST(request: NextRequest) {
  await db();

  try {
    const { email, address, pass } = await request.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      if (!existingUser.address || !existingUser.pass) {
        existingUser.address = address || "";
        existingUser.pass = pass || "";
        await existingUser.save();
      }

      return NextResponse.json(
        { message: "User updated successfully", user: existingUser },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
