import Card from "../../components/Card";

export default function page() {
  return (
    <div className="bg-[#D4B483] h-screen py-20">
      <main className="text-left max-w-sm mx-auto bg-black rounded-2xl shadow-md overflow-hidden p-3">
        <Card
          name="Janine Doe"
          avatar="https://randomuser.me/api/portraits/women/51.jpg"
          email="janinedoe@example.com"
          desc="Software Engineer passionate about building amazing web applications."
        />
      </main>
    </div>
  );
}
