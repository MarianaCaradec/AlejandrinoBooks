import Image from "next/image";

export default function Home() {
  return (
    <div className="relative text-[#D4B483]">
      <Image
        src="/bg-home.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-10"
      />
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 drop-shadow-[2px_2px_0px_#000]">
        <main className="flex flex-col justify-center items-center h-screen text-center">
          <h1 className="text-4xl md:text-6xl">Alejandrino Books</h1>
          <h2 className="text-lg md:text-2xl mt-4">Let's read life together</h2>
          <h3 className="text-base md:text-xl mt-7">
            Expertise and trust by our clients since 2010
          </h3>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      </div>
    </div>
  );
}
