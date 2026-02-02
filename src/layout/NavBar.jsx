export default function Navbar() {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-black border-b border-gray-800">
      <h1 className="text-xl font-bold">E365 Events</h1>
      <div className="space-x-6 text-gray-300">
        <a href="#" className="hover:text-white">Home</a>
        <a href="#" className="hover:text-white">Services</a>
        <a href="#" className="hover:text-white">Contact</a>
      </div>
    </nav>
  );
}
