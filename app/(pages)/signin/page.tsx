"use client";
import {
  useActionState,
  useState,
  useRef,
  useEffect,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { register } from "@/app/actions/register";

export default function SignIn() {
  const router = useRouter();
  const [loginState, loginAction, loginPending] = useActionState(login, {});
  const [registerState, registerAction, registerPending] = useActionState(
    register,
    {}
  );
  const [isRegistered, setIsRegistered] = useState<boolean>(true);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setIsUploading(true);

      try {
        const res = await fetch("/api/users/uploadFile", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.fileUrl) {
          setUploadedFileUrl(data.fileUrl);
        }
      } catch (error) {
        console.error("Error al subir el archivo", error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setCredentials({ email, password });

    const bucketName = process.env.BUCKET_NAME!;
    const defaultUrl = `${bucketName}/profile_imgs/default_profile_pic.jpeg`;

    if (uploadedFileUrl) {
      formData.append("uploadedFileUrl", uploadedFileUrl);
    } else {
      formData.append("uploadedFileUrl", defaultUrl);
    }

    formData.delete("file");

    startTransition(() => {
      registerAction(formData);
    });
  }

  useEffect(() => {
    if (
      registerState?.message === "You've just registered, congratulations!" &&
      credentials
    ) {
      startTransition(() => {
        const loginData = new FormData();
        loginData.append("email", credentials.email);
        loginData.append("password", credentials.password);
        loginAction(loginData);
      });
      router.push("/books");
    }
  }, [registerState, credentials, loginAction, router]);

  useEffect(() => {
    if (loginState?.message === "Success") {
      router.push("/books");
    }
  }, [loginState, router]);

  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <h2 className="text-3xl text-center font-bold text-[#D4B483] mb-6">
        {isRegistered
          ? "Log in with your email and password"
          : "Create an account"}
      </h2>
      <div className="flex flex-col items-center gap-6">
        {isRegistered ? (
          <form
            action={loginAction}
            className="bg-[#D4B483] p-10 rounded-md w-full max-w-md"
          >
            <label className="text-black text-xl font-bold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
            />
            {loginState?.errors?.email && (
              <p className="text-red text-sm">{loginState.errors.email}</p>
            )}
            <label className="text-black text-xl font-bold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
            />
            {loginState?.errors?.password && (
              <p className="text-red text-sm">{loginState.errors.password}</p>
            )}
            <div className="my-4 mx-6">
              <button
                type="submit"
                disabled={loginPending}
                className="bg-black text-[#D4B483] text-xl font-bold rounded-md p-3 w-full"
              >
                Log in
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#D4B483] p-10 rounded-md w-full max-w-md"
          >
            <label className="text-black text-xl font-bold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
            />
            {registerState?.errors?.name && (
              <p className="text-red text-sm">{registerState.errors.name}</p>
            )}
            <label className="text-black text-xl font-bold">Image</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            {registerState?.errors?.file && (
              <p className="text-red text-sm">{registerState.errors.file}</p>
            )}
            <label className="text-black text-xl font-bold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
            />
            {registerState?.errors?.email && (
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
            {registerState?.errors?.password && (
              <p className="text-red text-sm">
                {registerState.errors.password}
              </p>
            )}
            <input
              type="hidden"
              name="uploadedFileUrl"
              value={uploadedFileUrl}
            />
            <div className="my-4 mx-6">
              <button
                type="submit"
                disabled={isUploading || registerPending}
                className="bg-black text-[#D4B483] text-xl font-bold rounded-md p-3 w-full"
              >
                {isUploading ? "Loading profile image..." : "Create"}
              </button>
            </div>
          </form>
        )}
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
