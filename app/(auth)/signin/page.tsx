"use client";

import { signIn } from "next-auth/react";
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
import { FaLock } from "react-icons/fa";
import { MdHomeFilled } from "react-icons/md";

import AuthHeader from "@/components/auth-header";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signin-schema";
import Link from "next/link";

const Signin = () => {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setPending(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setError("Incorrect username of password");
      } else {
        setError(result.error);
      }
    }
    if (result?.url) {
      router.replace("/");
    }
    setPending(false);
  };

  return (
    <section
      className="
        bg-gray-100
        h-full
      "
    >
      <AuthHeader />
      <h1 className="text-4xl text-center mt-6 mb-16 text-black">Mastercoin</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="
            w-full
            flex
            flex-col
            gap-y-4
            px-16
          "
        >
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-gray-100 px-2">
              <MdEmail size={22} className="text-black" />
            </div>
            <FormField
              control={form.control}
              name="identifier"
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
            Login
          </Button>
          <Link
            href="/register"
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
            Register in now
          </Link>
        </form>
      </Form>
      <div
        className="
          w-fit
          ml-auto
          px-16
          mt-4
        "
      >
        <Link
          href="/"
          className={`text-blue-600 cursor-pointer hover:text-blue-700 duration-300 ${
            pending && "pointer-events-none"
          }`}
        >
          <MdHomeFilled size={36} />
        </Link>
      </div>
      {error.length > 0 && (
        <div className="my-8 w-fit shadow-lg bg-destructive/20 p-4 text-destructive text-sm mx-auto rounded-md">
          {error}
        </div>
      )}
      <h1 className="text-text-white w-fit mx-auto mt-4 bg-green-500 p-4 rounded-md">
        Win a $100 prize when you register. You can withdraw it in more than one
        way
      </h1>
    </section>
  );
};

export default Signin;
