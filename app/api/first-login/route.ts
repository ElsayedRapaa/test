import db from "@/lib/db";
import UserModel from "@/model/user";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  await db();

  const userId = req.headers.get("userid");

  const user = await UserModel.findById(userId);
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }

  try {
    user.isFirstLogin = false;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "User first login updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating first login:", error);
    return Response.json(
      {
        success: false,
        message: "Error updating first login",
      },
      { status: 500 }
    );
  }
}
