import Card from "../components/Card";

export default function page() {
  return (
    // <Card
    //   name="Jon Doe"
    //   avatar="https://randomuser.me/api/portraits/men/30.jpg"
    //   email="johndoe@example.com<"
    //   desc="Software Engineer passionate about building amazing web applications."
    // />
    <div className="max-w-sm mx-auto bg-black rounded-2xl shadow-md overflow-hidden p-6">
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 rounded-full border-4 border-gray-200"
          src="https://randomuser.me/api/portraits/men/30.jpg"
          alt="Avatar"
        />
        <h2 className="mt-4 text-xl font-semibold text-orange-900">John Doe</h2>
        <p className="text-orange-500">johndoe@example.com</p>
        <p className="mt-2 text-center text-gray-500">
          Software Engineer passionate about building amazing web applications.
        </p>
      </div>
    </div>
  );
}
