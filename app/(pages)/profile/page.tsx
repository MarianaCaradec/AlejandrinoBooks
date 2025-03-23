"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import Card from "../../components/Card";

export default function page() {
  const { isAuthenticated, user } = useAuth();

  if (!user) {
    return <p>User data not found</p>;
  }

  return (
    <div className="bg-[#D4B483] h-screen py-20">
      <main className="text-left max-w-sm mx-auto bg-black rounded-2xl shadow-md overflow-hidden p-3">
        {isAuthenticated && (
          <Card
            name={user.name}
            avatar={user.image}
            email={user.email}
            desc="Software Engineer passionate about building amazing web applications."
          />
        )}
      </main>
    </div>
  );
}
