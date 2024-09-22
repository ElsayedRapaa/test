"use client";

import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { verifySchema } from "@/schemas/verify-schema";
import HeaderBackButton from "@/components/header-back-button";
import { useSession } from "next-auth/react";

const VerifyCode = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        body: JSON.stringify({
          username: decodeURIComponent(data.username),
          code: data.code,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log("Error Verification Code Not Valid", err);
    }
  };

  if (session?.user.isVerify === true) {
    return (
      <section className="h-full bg-white text-black">
        <HeaderBackButton />
        <div className="text-center my-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Your verification is doen...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full bg-white text-black">
      <HeaderBackButton />
      <div className="text-center my-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-8">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input {...field} placeholder="Enter your username" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="w-fit block mx-auto outline-none border border-blue-600 bg-transparent text-blue-600 px-2 py-1 rounded-md cursor-pointer hover:text-white hover:bg-blue-600 duration-300"
            type="submit"
          >
            Verify
          </button>
        </form>
      </Form>
    </section>
  );
};

export default VerifyCode;
