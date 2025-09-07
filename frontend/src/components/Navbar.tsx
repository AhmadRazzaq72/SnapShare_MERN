import { Cloud } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
      <div className="flex items-center space-x-2 text-white">
        <Cloud size={28} className="text-blue-400" />
        <span className="text-xl font-semibold tracking-wide">AirShareX</span>
      </div>
      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-sm transition">
        Sign In
      </button>
    </nav>
  );
}
