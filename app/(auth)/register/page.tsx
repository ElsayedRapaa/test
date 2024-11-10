"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { MdEmail } from "react-icons/md";
import { FaLock, FaUser } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signup-schema";
import Link from "next/link";
import Image from "next/image";

const Signin = () => {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setPending(true);
    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!result.success) {
        setError(result.message);
      } else {
        router.push("/signin");
      }
    } catch (err) {
      setError("An error occurred during registration: ");
    } finally {
      setPending(false);
    }
  };

  return (
    <section
      className="
        bg-gray-100
        h-full
        text-black
        flex
        items-center
      "
    >
      <div
        className="
          w-1/2
          h-full
          hidden
          md:flex
          flex-1
          flex-col
          items-center
          justify-center
        "
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              w-1/2
              flex
              flex-col
              gap-y-4
              px-4
            "
          >
            <div className="flex items-center justify-center mb-2 gap-x-2">
              <Image
                src="/images/logo.svg"
                alt="login_logo"
                width={50}
                height={50}
                className="
                  rounded-full
                "
              />
              <h2 className="text-2xl">MasterCoin</h2>
            </div>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-2">
                <FaUser size={22} className="text-black" />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        className="
                          focus:placeholder:opacity-0
                          placeholder:duration-300
                          min-w-[320px]
                          w-[730px]
                          py-2
                          px-4
                          rounded-md
                          outline-none
                          text-black
                        "
                        disabled={pending}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-2">
                <MdEmail size={22} className="text-black" />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Your Email"
                        className="
                          focus:placeholder:opacity-0
                          placeholder:duration-300
                          min-w-[320px]
                          w-[730px]
                          py-2
                          px-4
                          rounded-md
                          outline-none
                          text-black
                        "
                        disabled={pending}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-2">
                <FaLock size={22} className="text-black" />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your Password"
                        className="
                          focus:placeholder:opacity-0
                          placeholder:duration-300
                          min-w-[320px]
                          w-[730px]
                          py-2
                          px-4
                          rounded-md
                          outline-none
                          text-black
                        "
                        required
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              size="lg"
              className="
                text-white
                bg-blue-600
                cursor-pointer
                outline-none
                border-none
                rounded-md
                py-2
                hover:bg-blue-700
                duration-300
              "
              disabled={pending}
              type="submit"
            >
              Register
            </Button>
            <Link
              href="/signin"
              className="
                text-blue-600
                bg-transparent
                cursor-pointer
                border
                border-blue-600
                outline-none
                rounded-md
                py-2
                hover:bg-blue-600
                hover:text-white
                duration-300
                text-center
              "
            >
              Signin in now
            </Link>
          </form>
        </Form>
        <div
          className="
            w-fit
            mx-auto
            px-16
            mt-4
          "
        >
          <Link
            href="/"
            className={`text-blue-600 underline cursor-pointer hover:text-blue-700 duration-300  ${
              pending && "pointer-events-none"
            }`}
          >
            Back to home page
          </Link>
        </div>
        {error.length > 0 && (
          <div className="my-8 w-fit shadow-lg bg-destructive/20 p-4 text-destructive text-sm mx-auto rounded-md">
            {error}
          </div>
        )}
        <h1 className="text-text-white md:w-[320px] leading-7 text-white sm:mx-auto mx-4 mt-4 bg-green-500 p-4 rounded-md text-center">
          Win a $100 prize when you register. You can withdraw it in more than
          one way
        </h1>
      </div>
    </section>
  );
};

export default Signin;
