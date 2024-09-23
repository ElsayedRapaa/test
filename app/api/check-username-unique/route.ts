import db from "@/lib/db";
import UserModel from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signup-schema";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await db();

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const validationResult = UsernameQuerySchema.safeParse({ username });

    if (!validationResult.success) {
      const usernameError =
        validationResult.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        }),
        { status: 400 }
      );
    }

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerify: true,
    });

    return new Response(
      JSON.stringify({
        success: !existingVerifiedUser,
        message: existingVerifiedUser
          ? "Username is already taken"
          : "Username is unique",
      }),
      { status: existingVerifiedUser ? 400 : 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      { status: 500 }
    );
  }
}
