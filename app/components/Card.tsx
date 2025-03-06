import Image from "next/image";

interface AccountProps {
  name: string;
  avatar: string;
  email: string;
  desc: string;
}

export default function Card({ name, avatar, email, desc }: AccountProps) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
      <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
      <Image
        src={avatar}
        alt={name}
        width="600"
        height="500"
        className="w-full h-64 object-cover mt-4 rounded-lg"
      />
      <h2 className="text-lg text-gray-600 mt-4">{email}</h2>
      <p className="text-gray-500 mt-2">{desc}</p>
    </div>
  );
}
