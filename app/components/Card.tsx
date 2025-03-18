import Image from "next/image";

interface AccountProps {
  name: string;
  avatar: string;
  email: string;
  desc: string;
}

export default function Card({ name, avatar, email, desc }: AccountProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mt-4 text-xl font-semibold text-[#D4B483]">{name}</h1>
      <Image
        src={avatar}
        alt="Profile photo"
        width="200"
        height="300"
        className="object-cover mt-4 rounded-lg"
      />
      <h2 className="text-[#D4B483] p-3">{email}</h2>
      <p className="text-center text-[#E4DFDA]">{desc}</p>
    </div>
  );
}
