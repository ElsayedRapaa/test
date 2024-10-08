import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verification-email";
import { ApiResponse } from "@/types/api-response";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifiCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "MasterCoin | Verification Code",
      react: VerificationEmail({ username, otp: verifiCode }),
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
