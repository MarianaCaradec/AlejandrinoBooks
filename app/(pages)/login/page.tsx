"use client";
import { login } from "@/app/actions/auth";
import { register } from "@/app/actions/register";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loginState, loginAction, loginPending] = useActionState(login, {});
  const [registerState, registerAction, registerPending] = useActionState(
    register,
    {}
  );
  const [isRegistered, setIsRegistered] = useState(true);

  useEffect(() => {
    if (loginState?.message === "Success") {
      router.push("/books");
    }
  }, [loginState, router]);

  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <h2 className="text-3xl text-center font-bold text-[#D4B483] mb-6">
        {isRegistered ? "Log In" : "Create an account"}
      </h2>
      <div className="flex flex-col items-center gap-6">
        <form
          action={async (formData) => {
            if (isRegistered) {
              console.log("Form submitted");
              await loginAction(formData);
            } else {
              await registerAction(formData);
              await loginAction(formData);
            }
          }}
          className="bg-[#D4B483] p-10 rounded-md w-full max-w-md"
        >
          {!isRegistered && (
            <>
              <label className="text-black text-xl font-bold">Name</label>
              <input
                type="name"
                name="name"
                placeholder="Name"
                required
                className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
              />
              {registerState?.errors?.name && (
                <p className="text-red text-sm">{registerState.errors.name}</p>
              )}
            </>
          )}
          <label className="text-black text-xl font-bold">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          {isRegistered
            ? loginState?.errors?.email && (
                <p className="text-red text-sm">{loginState.errors.email}</p>
              )
            : registerState?.errors?.email && (
                <p className="text-red text-sm">{registerState.errors.email}</p>
              )}
          <label className="text-black text-xl font-bold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          {isRegistered
            ? loginState?.errors?.password && (
                <p className="text-red text-sm">{loginState.errors.password}</p>
              )
            : registerState?.errors?.password && (
                <p className="text-red text-sm">
                  {registerState.errors.password}
                </p>
              )}
          <div className="my-4 mx-6">
            <button
              type="submit"
              disabled={isRegistered ? loginPending : registerPending}
              className="bg-black text-[#D4B483] text-xl font-bold rounded-md p-3 w-full"
            >
              {!isRegistered ? "Create account" : "Sing In"}
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsRegistered(!isRegistered)}
          className="text-[#D4B483] underline"
        >
          {isRegistered
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
