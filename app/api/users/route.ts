/* eslint-disable @typescript-eslint/no-unused-vars */

import db from "@/lib/db";
import UserModel from "@/model/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await db();

  try {
    const userCount = await UserModel.countDocuments();

    const newUser = await UserModel.findOne({}, { username: 1 })
      .sort({ createdAt: -1 })
      .limit(1);

    return Response.json(
      {
        success: true,
        userCount,
        newUser: newUser ? newUser.username : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching users",
      },
      { status: 500 }
    );
  }
}
